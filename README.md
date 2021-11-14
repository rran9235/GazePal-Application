# GazePal Application Source Code
Author: Rishi Rangarajan <br />
Year: 2021

## Info
This repository contains the source code for GazePal, which is a Machine Learning-based Gaze Tracking System for users with Severe Speech and Motor Impairments. GazePal is a hardware-agnostic solution, which estimates the user's gaze to a region on the screen using just a video feed from the PC's integrated webcam. GazePal allows its users to view their ambient environment without turning their heads. The user's gaze is used as an input modality to control the GUI, which allows them to adjust the orientation of a pan-tilt mechanism. A scene camera (external USB webcam) is mounted on top of this structure, which allows users to control where the camera is pointed towards.

The research project was completed in fulfilment of the requirements for the degree of Bachelor of Engineering (Honours) in the School of Aerospace, Mechanical and Mechatronice Engineering (AMME) at the University of Sydney.

## Repository Organisation
The source code for the application is contained inside the folder `src`. The folder `gazepal-app` contains the GUI application, which was developed using React.js for the client side and Node.js for the server side operations. 

### Gaze estimation program 
`src\python` contains the gaze estimation program and the relevant files, which is written in Python.

### Servo Motor Control 
`src\arduino` contains the code run on an Arduino Uno to read data from the serial port and write them to the servo motors, which achieves the desired orientation on the pan-tilt mechanism.

### Graphical User Interface
`gazepal-app` contains all of the files relating to GazePal's GUI. The GUI is responsible for showing the video feed of the scene camera and helping the users adjust the pan and tilt values of the rotating structure. 

### Pan-Tilt Mechanism Part Files
`Pan-Tilt Mechanism Part Files` contains the STL files used for 3D-printing. The structure comprises of 4 parts. The parts were not designed by me, they were created by Kong Yang and is available at GrabCAD through the link: https://grabcad.com/library/pan-and-tilt-1
