#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include "DHT.h"

#define DHTTYPE DHT11  
 
const char *WIFI_SSID = "WIFI_NAME";
const char *WIFI_PASSWORD = "WIFI_PASS";
String url = "http://192.168.1.29:8080/";

//to-do: aggiungere dei pin di default per la gestione output generica
//come per esempio il 2 che gestisce un relay


DHT dht(2, DHTTYPE);
WiFiClient client;
HTTPClient httpClient;


void setup()
{
    Serial.begin(9600);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    while (WiFi.status() != WL_CONNECTED) {
        delay(5);
    }
    Serial.println("Connected");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    dht.begin();
}

float getTemp(){
  return dht.readTemperature();
}

float getHumidity(){
  return dht.readHumidity();
}

String createJson(float temp, float humidity){
  String data = String("{\"mac\":\"")+WiFi.macAddress()+String("\",\"sensors\":{");
  data += String("\"humidity\":")+humidity+String(",");
  data += String("\"temperature\":")+temp+String("}}");
  return data;
}

void send(String data){
    httpClient.begin(client, url);
    httpClient.addHeader("Content-Type", "application/json");
    httpClient.POST(data);
    httpClient.end();
}

void loop()
{
  send(createJson(getTemp(),getHumidity()));
  delay(1000);
}


//to-do: aggiungere una funzione per gestire i pin di default
