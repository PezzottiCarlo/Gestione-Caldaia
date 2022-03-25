# GestioneCaldaia
Project for displaying temperature and humidity of a boiler.

To install (server / client):
For the server part I used nodejs.
For the client part I used reactjs.
0) Download nodejs from https://nodejs.org/it/ and add o path
1) In the root folder npm -i
2) In the client/ npm -i folder
3) In client/package.json
```javascript
{
  "name": "temperatura",
  "proxy": "http://[ip_server]:[port_server]/",
  ...
```
4) Start server.js -> node server.js
5) Start client react -> npm start

To install (hardware):
For the hardware part I used a nodemcu esp8266 board

0) Download arduino ide from https://www.arduino.cc/en/software
1) Follow thid guide https://www.instructables.com/Steps-to-Setup-Arduino-IDE-for-NODEMCU-ESP8266-WiF/
2) Upload arduino code changing the ip
```c
    String url = "http://[ip_server]:[port]/";
```

