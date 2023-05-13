#include <SPI.h>
#include <Ethernet2.h>
#include <Wiegand.h>
#include <EEPROM.h>
#include <avr/wdt.h>

#define RELAY1 4
#define RELAY2 5
#define RELAY3 6
#define RELAY4 7

#define BUTTON1 17
#define BUTTON2 16
#define BUTTON3 15
#define BUTTON4 14

byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED};
int reset_cause; 

EthernetServer server(80);
EthernetClient client;

EthernetClient client2;

WIEGAND wg;

void setup() {
  read_reset_cause();
  
  // clear watchdog timer
  MCUSR = 0;
  wdt_enable(WDTO_1S);
  
  Serial.begin(9600);
  Serial.println("Gatekeeper GK-400 v1 - Starting");

  pinMode(RELAY1, OUTPUT);  // relay 1
  pinMode(RELAY2, OUTPUT);  // relay 2
  pinMode(RELAY3, OUTPUT);  // relay 3
  pinMode(RELAY4, OUTPUT);  // relay 4
 
  // Register interrupt
  noInterrupts();
  TCCR1A = 0;
  TCCR1B = 0;

  TCNT1 = 63974;
  TCCR1B |= (1 << CS10) | (1 << CS12);
  TIMSK1 |= (1 << TOIE1);
  interrupts();

  load_settings();

  wg.begin();
  Ethernet.begin(mac);

  server.begin();

  Serial.print("IP address: ");
  Serial.println(Ethernet.localIP());

  // start with red light on
  digitalWrite(RELAY3, 0);
  digitalWrite(RELAY4, 1);
}

// temporary buffers
bool json_request = false;
bool handle_post = false;
char header[16] = {0};
int idx = 0;

char itoa_buf[12];
char last_byte = 0;

char wg_pin[8];   // Wiegand PIN (WG-8)
int wg_idx = 0;   // Wiegand PIN position
long wg_card = 0;  // Wiegand card (WG-26)

// buttons that are pressed
bool btn1 = false;
bool btn2 = false;
bool btn3 = false;
bool btn4 = false;

bool detector = false;

// a counter for each relay
short int counter1 = 0;
short int counter2 = 0;
short int counter3 = 0;
short int counter4 = 0;

long uptime = 0;
int loop_timer = 0;
int wg_timer = 0;
int detector_timer = 0;

// set to button number (1-3) when pressed
short int buttonRequest = 0;

// settings
char cloud_ip[16] = {0};
char cloud_token[16] = {0};

char pin1[8] = {0};
char pin2[8] = {0};
char pin3[8] = {0};
char pin4[8] = {0};

void loop() {
  Ethernet.maintain();
  loop_timer = 0;

  client = server.available();

  // check for server connections
  if (client) {
    Serial.println("Client connected.");

    char command = NULL;

    while (client.connected()) {
      if (client.available()) {
        char c = client.read();

        // break loop and send response if request is complete
        if (last_byte == '\n' && c == '\r') {
          Serial.println("Request received");
          break;
        }
        
        last_byte = c;

        // read beginning of line into array
        if (idx < 16) {
          header[idx++] = c;
        }

        // if line ends then handle GET request
        if (c == '\n') {
          if (idx == 1) break;
          
          if (strstr(header, "GET") != NULL) {
            command = header[8];
            
            if (command == 'o') gate_open();
            else if (command == 'c') gate_close();
            else if (command == 'g') grant();
            else if (command == 'd') deny();
            else command = NULL;

            if (header[5] == 'j') json_request = true;
          }

          if (strstr(header, "POST") != NULL) {
            handle_post = true;
          }

          memset(header, 0, sizeof header);
          idx = 0;
        }
      }
    }

    memset(header, 0, sizeof header);
    idx = 0;

    if (handle_post) {
      int n = 0;
      while (n < 6 && client.connected()) {
        if (client.available()) {
          char c = client.read();
          if (c == '\n') continue;
          
          if (idx < 16) {
            header[idx++] = c;
          }

          if (c == ';') {
            header[idx-1] = 0;
            Serial.println(header);
            if (n == 0) strncpy(cloud_ip, header, 16);
            if (n == 1) strncpy(cloud_token, header, 16);
            if (n == 2) strncpy(pin1, header, 8);
            if (n == 3) strncpy(pin2, header, 8);
            if (n == 4) strncpy(pin3, header, 8);
            if (n == 5) strncpy(pin4, header, 8);
            n++;
            
            memset(header, 0, sizeof header);
            idx = 0;
          }
        }
      }
      delay(1);
      client.stop();
      save_settings();
    }

    if (command) {
      send_json(command);
    }
    else {
      send_http(json_request);
    }

    json_request = false;
    handle_post = false;
            
    delay(1);
    client.stop();
    Serial.println("DISCON");
  }

  if(wg.available()) {
    wg_timer = 0;

    Serial.print("WG DECIMAL INPUT = ");
    Serial.print(wg.getCode());
    Serial.print(", Type W");
    Serial.println(wg.getWiegandType());
    
    if (wg_idx < 8 && wg.getWiegandType() == 4 && wg.getCode() != 13 && wg.getCode() != 27) {
      wg_pin[wg_idx++] = wg.getCode() + '0';
    }

    if (wg.getWiegandType() == 26) {
      wg_card = wg.getCode();
      // check remote server
      if (check_remote_server(wg_pin, wg_card, 0)) gate_open();
    }

    // Pressing asterisk or hashtag means ENTER
    if (wg.getCode() == 13 || wg.getCode() == 27) {
      // first check local pins and then remote server
      if (check_local_pin(wg_pin)) gate_open(); 
      if (check_remote_server(wg_pin, 0, 0)) gate_open(); 
      memset(wg_pin, 0, sizeof wg_pin);
      wg_idx = 0;
    }
  }

  // check if buttons are pressed
  if (buttonRequest) {
    Serial.print("BUTTON PRESS = ");
    Serial.println(buttonRequest);
    
    // buttons 1 and 2 always open gate
    if (buttonRequest == 1) gate_open();
    if (buttonRequest == 2) gate_open();
    if (check_remote_server("", 0, buttonRequest)) gate_open();
  }

  buttonRequest = 0;
}

bool check_local_pin(char* code) {
  if (code[0] == 0) return false;
  
  return !strcmp(code, pin1)
    || !strcmp(code, pin2)
    || !strcmp(code, pin3)
    || !strcmp(code, pin4);
}

bool check_remote_server(char* code, long card, short int button) {
  IPAddress server2;
  server2.fromString(cloud_ip);

  bool response = false;

  memset(header, 0, sizeof header);
  idx = 0;

  client2.stop();

  if (client2.connect(server2, 4123)) {
    Serial.println("CONN");
    client2.print("GET /api/endpoint?token=");
    client2.print(cloud_token);
    if (code[0] != 0) {
      client2.print("&code=");
      client2.print(code);
    }
    if (card != 0) { 
      client2.print("&card=");
      client2.print(card);
    }
    if (button != 0) { 
      client2.print("&button=");
      client2.print(button); 
    }
    client2.println("");
    client2.println("Connection: close");
    client2.println();

    while (client2.connected()) {
      if (client2.available()) {
        if (idx < 16) {
          header[idx++] = client2.read();
        }
        else if (strstr(header, "200") != NULL) {
          Serial.println("RES !200");
          response = true;
          break;
        }
        else {
          Serial.println("RES 200");
          break;
        }
      }
    }
  }

  idx = 0;
  delay(1);
  client2.stop();

  return response;
}

void save_settings() {
  // Tiny validation on IP address
  if (cloud_ip[0] <= '9' && cloud_ip[0] >= '1') {
    EEPROM.put(0, cloud_ip);
    EEPROM.put(16, cloud_token);
    EEPROM.put(32, pin1);
    EEPROM.put(40, pin2);
    EEPROM.put(48, pin3);
    EEPROM.put(56, pin4);
    EEPROM.put(64, 0xFF);
  }
  loop_timer = 100;
  uptime = 600;
  while (1) {}
}

void load_settings() {
  EEPROM.get(0, cloud_ip);
  EEPROM.get(16, cloud_token);
  EEPROM.get(32, pin1);
  EEPROM.get(40, pin2);
  EEPROM.get(48, pin3);
  EEPROM.get(56, pin4);
}

void gate_open() {
  digitalWrite(RELAY1, 1);
  counter1 = 1;

  turn_green();
}

void gate_close() {
  digitalWrite(RELAY2, 1);
  counter2 = 1;

  turn_red();
}

void turn_green() {
  digitalWrite(RELAY3, 1);
  digitalWrite(RELAY4, 0);
  counter3 = 1;
}

void turn_red() {
  digitalWrite(RELAY3, 0);
  digitalWrite(RELAY4, 1);
  counter3 = 0;
}

void turn_off() {
  digitalWrite(RELAY3, 0);
  digitalWrite(RELAY4, 0);
  counter3 = 0;
}

// open gate if vehicle is present
void grant() {
  if (btn4) gate_open();
}

// turn on red light if vehicle is present
void deny() {
  if (detector) turn_red();
}

ISR(TIMER1_OVF_vect) {
  TCNT1 = 63974;
  interrupt();
}

// the interrupt function should execute every 100 milliseconds
void interrupt() {
  uptime++;
  loop_timer++;
  wg_timer++;

  // restart if loop is hanging
  if (loop_timer < 50 || uptime < 300) {
    wdt_reset();
  }

  // clear pin buffer if left for too long
  if (wg_idx > 0 && wg_timer > 200) {
      memset(wg_pin, 0, sizeof wg_pin);
      wg_idx = 0;
  }

  // increment counters if started
  if (counter1 != 0) counter1++;
  if (counter2 != 0) counter2++;
  if (counter3 != 0) counter3++;
  if (counter4 != 0) counter4++;

  // turn off relay and stop counters
  if (counter1 > 10) {
    digitalWrite(RELAY1, 0);
    counter1 = 0;
  }

  if (counter2 > 10) {
    digitalWrite(RELAY2, 0);
    counter2 = 0;
  }

  if (counter3 > 100 && !detector) {
    turn_red();
  }

  if (counter3 > 100 && detector) {
    turn_off();
  }

  // if buttons go from low to high
  if (!btn1 && !digitalRead(BUTTON1)) { 
    buttonRequest = 1;
    gate_open();
  }
  if (!btn2 && !digitalRead(BUTTON2)) {
    buttonRequest = 2;
    gate_open();
  }
  if (!btn3 && !digitalRead(BUTTON3)) buttonRequest = 3;

  // when detector is clear again, turn red light back on
  if (!btn4 && detector) turn_red();

  // if detector loop 
  if (btn4) { 
    detector_timer++;
  } else {
    detector_timer = 0;
    detector = false;
  }

  // only trigger sensor after 1 second of signal
  if (detector_timer > 10 && !detector) {
    turn_off();

    detector = true;
  }

  // read buttons
  btn1 = !digitalRead(BUTTON1);
  btn2 = !digitalRead(BUTTON2);
  btn3 = !digitalRead(BUTTON3);
  btn4 = !digitalRead(BUTTON4);
}

void send_json(char type) {
  client.println(F("HTTP/1.1 200 OK"));
  client.println(F("Content-Type: text/html"));
  client.println(F("Connection: close"));
  client.println();
  
  if (type == 'o') {
    client.print(F("{\"command\": \"open\"}"));
  }
  else if (type == 'c') {
    client.print(F("{\"command\": \"close\"}"));
  }
  else if (type == 'g') {
    client.print(F("{\"command\": \"grant\", \"detector\": "));
    client.print(detector ? "true" : "false");
    client.print("}");
  }
  else if (type == 'd') {
    client.print(F("{\"command\": \"deny\", \"detector\": "));
    client.print(detector ? "true" : "false");
    client.print("}");
  }
}

void send_http(bool json) {
  client.println(F("HTTP/1.1 200 OK"));
  client.println(F("Content-Type: text/html"));
  client.println(F("Connection: close"));
  client.println();

  if (json) {
    client.print("{\"uptime\": ");
    client.print(uptime/10);
    client.print(", \"detector\": ");
    client.print(detector_timer);
    client.print(", \"freeMemory\": ");
    client.print(freeMemory());
    client.print(", \"reset\": ");
      client.print(reset_cause);
    client.print("}");
  }
  else {
    client.print(F("<!doctype html><title>GK-400</title><meta name=viewport content='width=300,initial-scale=1'><style>.container{width:300px;margin:0 auto;font-family:sans}a{display:block;width:100%;background-color:#a5a5a5;text-align:center;padding:10px 0;margin:8px 0;font-size:14px;font-weight:900;color:#fff;text-decoration:none;border-radius:6px;cursor:pointer;}.imp{background-color:#2196f3}.info{display:flex;justify-content:space-between}h1,h4{text-align:center}p{margin:6px 0}input,select{width:100%}hr{margin:20px 0}</style><div class=container><h1>Gatekeeper</h1><h4>GK-400 (v. 2021-06-25)</h4><hr><a onclick=\"fetch('?a=open');\">OPEN</a><a onclick=\"fetch('?a=close');\">CLOSE</a><h4>Information</h4><hr><div class=info><p><b>IP address</b><p>"));
    client.print(Ethernet.localIP());
    client.print(F("</div><div class=info><p><b>Gateway</b><p>"));
    client.print(Ethernet.gatewayIP());
    client.print(F("</div><div class=info><p><b>Uptime</b><p>"));
    client.print(uptime / 36000 / 24);
    client.print("d ");
    client.print((uptime / 36000) % 24);
    client.print("h ");
    client.print((uptime / 600) % 60);
    client.print(F("m</div><div class=info><p><b>Last PIN</b><p>"));
    client.print(wg_pin);
    client.print(F("</div><div class=info><p><b>Last card</b><p>"));
    client.print(wg_card);
    client.print(F("</div><h4>Server</h4><hr><p>Gatekeeper IP address</p><input name='ip' value='"));
    client.print(cloud_ip);
    client.print(F("'><p>API token</p><input name='token' value='"));
    client.print(cloud_token);
    client.print(F("'><h4>Local Access</h4><hr><p>These codes can be used to open without permission from server</p><br><p>Code 1</p><input name='pin1' value='"));
    client.print(pin1);
    client.print(F("'><p>Code 2</p><input name='pin2' value='"));
    client.print(pin2);
    client.print(F("'><p>Code 3</p><input name='pin3' value='"));
    client.print(pin3);
    client.print(F("'><p>Code 4</p><input name='pin4' value='"));
    client.print(pin4);
    client.print(F("'><hr><a onclick=\"fetch('/', {method: 'post', body: Array.from(document.getElementsByTagName('input')).map(x => x.value).join(';') + ';'}).catch(() => setTimeout(() => location.reload(), 2500));\" class=imp>SAVE</a><hr><p>Brynjar Ingimarsson &copy; 2020 - 2021</p><br><br></div>"));
  }
}

void read_reset_cause() {
  char config_saved = EEPROM.read(64);

  // Power on
  if (MCUSR & (1 << PORF)) {
    reset_cause = 0;
  }
  // External reset
  else if (MCUSR & (1 << EXTRF)) {
    reset_cause = 1;
  }
  // Brown-out detected
  else if (MCUSR & (1 << BORF)) {
    reset_cause = 2;
  }
  // Watchdog triggered
  else if (MCUSR & (1 << WDRF)) {
    if (config_saved == 0x00) {
      reset_cause = 3;
    }
    else {
      reset_cause = 4;
    }
  }

  if (config_saved) EEPROM.put(64, 0x00);
  MCUSR = 0;
}

#ifdef __arm__
// should use uinstd.h to define sbrk but Due causes a conflict
extern "C" char* sbrk(int incr);
#else  // __ARM__
extern char *__brkval;
#endif  // __arm__

int freeMemory() {
  char top;
#ifdef __arm__
  return &top - reinterpret_cast<char*>(sbrk(0));
#elif defined(CORE_TEENSY) || (ARDUINO > 103 && ARDUINO != 151)
  return &top - __brkval;
#else  // __arm__
  return __brkval ? &top - __brkval : &top - __malloc_heap_start;
#endif  // __arm__
}
