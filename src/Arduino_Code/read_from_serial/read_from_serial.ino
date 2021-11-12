
/* 
GazePal: Machine Learning-based Gaze Tracking for Users with Physical Disabilities
Author: Rishi Rangarajan
Year: 2021
Info: Program to run on Arduino to control Pan-Tilt Mechanism using input from Serial port.
*/

// Servo easing library
#include "ServoEasing.hpp"

// Initial pan and tilt positions
int pan_angle = 90;    
int tilt_angle = 90;
// Variable for servo speed
int servo_speed = 20;

// Instantiate for servo motors
ServoEasing PanServo;
ServoEasing TiltServo;

void setup()
{
  Serial.begin(9600);

  // Attach Pan Servo to PIN 9  
  if (PanServo.attach(9, pan_angle) == INVALID_SERVO) {
      Serial.println(F("Error attaching servo"));
  }
  // Attach Pan Servo to PIN 10
  if (TiltServo.attach(10, tilt_angle) == INVALID_SERVO) {
      Serial.println(F("Error attaching servo"));
  }

  // Small delay to take position
  delay(500);

  // Set Servo speed
  PanServo.setSpeed(servo_speed);
  TiltServo.setSpeed(servo_speed);

}

void loop() 
{
  // Check if Serial data is available
  if (Serial.available())
  {
    // Read data into separate variables
    String str_pan = Serial.readStringUntil(',');
    Serial.read();
    String str_tilt = Serial.readStringUntil(',');

    // Convert string to integers
    pan_angle = str_pan.toInt();
    tilt_angle = str_tilt.toInt();

    // Write to Pan and Tilt Servos
    PanServo.startEaseTo(pan_angle);
    TiltServo.startEaseTo(tilt_angle);
  }
}
