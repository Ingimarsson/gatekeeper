# GK-400v1

To write a program to the device:

 - Install Arduino IDE
 - Install libraries Ethernet2 and Wiegand (see zips in lib folder)
 - Write "ArduinoISP" program from examples to an Arduino Nano (we will use as a programmer)
 - Select programmer "Arduino as ISP" in IDE menu
 - Connect Arduino Nano to ISP pins on device, all pins are same but D10 (nano) to reset (device)
 - Arduino Nano reset must be pulled to ground when programming starts, and released after first timeout

Make sure fuses are correct, to use internal 8 MHz clock and brownout level 1:

    low 0xE2, high 0xD9, extended 0xFD

Set fuses (change avrdude paths):

    avrdude -Cavrdude.conf -v -V -patmega328p -cstk500v1 -P/dev/ttyUSB0 -b19200 -U lfuse:w:0xe2:m -U hfuse:w:0xd9:m -U efuse:w:0xfd:m

Make sure to give unique MAC address to each unit.
