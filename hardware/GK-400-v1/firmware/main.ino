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

EthernetServer server(80);
EthernetClient client;

EthernetClient client2;

WIEGAND wg;

void setup() {
  // clear watchdog timer
  MCUSR = 0;
  wdt_disable();
  
  Serial.begin(9600);
  Serial.println("hello");

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

// a counter for each relay
short int counter1 = 0;
short int counter2 = 0;
short int counter3 = 0;
short int counter4 = 0;

long uptime = 0;
int loop_timer = 0;
int wg_timer = 0;

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
            if (header[8] == 'o') gate_open();
            if (header[8] == 'c') gate_close();
            if (header[8] == 'g') grant();
            if (header[8] == 'd') deny();

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

    send_http(json_request);
    json_request = false;
    handle_post = false;
            
    delay(1);
    client.stop();
    Serial.println("Client disconnected");
  }

  if(wg.available()) {
    wg_timer = 0;

    Serial.print("WG DECIMAL INPUT = ");
    Serial.print(wg.getCode());
    Serial.print(", Type W");
    Serial.println(wg.getWiegandType());
    
    if (wg_idx < 8 && wg.getWiegandType() == 4 && wg.getCode() != 13) {
      wg_pin[wg_idx++] = wg.getCode() + '0';
    }

    if (wg.getWiegandType() == 26) {
      wg_card = wg.getCode();
      // check remote server
      if (check_remote_server(wg_pin, wg_card, 0)) gate_open();
    }

    if (wg.getCode() == 13) {
      // first check local pins and then remote server
      if (check_local_pin(wg_pin) || check_remote_server(wg_pin, 0, 0)) gate_open(); 
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

  memset(header, 0, sizeof header);
  idx = 0;

  client2.stop();

  if (client2.connect(server2, 4123)) {
    Serial.println("Server connection established");
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
          Serial.println("Server responded with 200");
          client2.stop();
          return true;
        }
        else {
          Serial.println("Server did not respond with 200");
          client2.stop();
         return false;
        }
      }
    }
  }
}

void save_settings() {
  EEPROM.put(0, cloud_ip);
  EEPROM.put(16, cloud_token);
  EEPROM.put(32, pin1);
  EEPROM.put(40, pin2);
  EEPROM.put(48, pin3);
  EEPROM.put(56, pin4);

  wdt_enable(WDTO_1S);
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
  counter4 = 0;
}

void turn_red() {
  digitalWrite(RELAY3, 0);
  digitalWrite(RELAY4, 1);
  counter3 = 0;
  counter4 = 1;
}

// open gate if vehicle is present
void grant() {
  if (btn4) gate_open();
}

// turn on red light if vehicle is present
void deny() {
  if (btn4) turn_red();
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
  if (loop_timer > 50 && uptime > 300) {
    wdt_enable(WDTO_1S);
    while (1) {}
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

  if (counter3 > 100) {
    digitalWrite(RELAY3, 0);
    counter3 = 0;
  }

  if (counter4 > 50) {
    digitalWrite(RELAY4, 0);
    counter4 = 0;
  }

  // if buttons go from low to high
  if (!btn1 && !digitalRead(BUTTON1)) buttonRequest = 1;
  if (!btn2 && !digitalRead(BUTTON2)) buttonRequest = 2;
  if (!btn3 && !digitalRead(BUTTON3)) buttonRequest = 3;

  // if button goes from high to low
  if (btn4 && digitalRead(BUTTON4)) turn_red();

  // read buttons
  btn1 = !digitalRead(BUTTON1);
  btn2 = !digitalRead(BUTTON2);
  btn3 = !digitalRead(BUTTON3);
  btn4 = !digitalRead(BUTTON4);
}

void send_http(bool json) {
  client.println("HTTP/1.1 200 OK");
  client.println("Content-Type: text/html");
  client.println("Connection: close");
  client.println();

  if (json) {
    client.print("{\"uptime\": ");
    client.print(uptime/10);
    client.print("}");
  }
  else {
    client.print(F("<!doctype html><title>GK-400</title><meta name=viewport content='width=300,initial-scale=1'><style>.container{width:300px;margin:0 auto;font-family:sans}a{display:block;width:100%;background-color:#a5a5a5;text-align:center;padding:10px 0;margin:8px 0;font-size:14px;font-weight:900;color:#fff;text-decoration:none;border-radius:6px;cursor:pointer;}.imp{background-color:#2196f3}.info{display:flex;justify-content:space-between}h1,h4{text-align:center}p{margin:6px 0}input,select{width:100%}hr{margin:20px 0}</style><div class=container><h1>Gatekeeper</h1><h4>GK-400 (v. 2021-06-25)</h4><hr><a onclick=\"fetch('?a=open');\">OPEN</a><a onclick=\"fetch('?a=close');\">CLOSE</a><h4>Information</h4><hr><div class=info><p><b>IP address</b><p>"));
    client.print(Ethernet.localIP());
    client.print("</div><div class=info><p><b>Gateway</b><p>");
    client.print(Ethernet.gatewayIP());
    client.print("</div><div class=info><p><b>Uptime</b><p>");
    client.print(uptime / 36000);
    client.print("h ");
    client.print((uptime / 600) % 60);
    client.print("m</div><div class=info><p><b>Last PIN</b><p>");
    client.print(wg_pin);
    client.print("</div><div class=info><p><b>Last card</b><p>");
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
