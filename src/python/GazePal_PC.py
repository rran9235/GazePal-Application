"""
GazePal Application
Author: Rishi Rangarajan
Year: 2021 

File: GazePal_PC.py
Info: GazePal_PC class definition
"""

# Imports
import csv
import os
import pyautogui
import time
import torch
import torchvision
import cv2 as cv
import numpy as np
import torchvision.transforms as transforms
from collections import Counter
from threading import Thread
from Class_CNN import CNN

# Class declaration
class GazePal_PC:

    # Class constructor
    def __init__(self):
        
        # Initialise screen-based parameters
        self.screen_init()
        # Initialise gaze tracking camera
        self.camera_init()
        # Initialise CNN
        self.CNN_init()

        # Initialise timer
        self.timer = 0

        print("[INFO]: GazePal initialised.")   

    # Initialise screen-based parameters
    def screen_init(self):
        # Set FR names
        self.classes = ["FR1", "FR2", "FR3", "FR4", "FR5", "FR6", "FR7", "FR8", "FR9"]
        # Get screen resolution
        width_px, height_px = pyautogui.size()
        w_r = width_px/3
        h_r = height_px/3
        # Set xy coordinates for FRs
        self.regions = {"FR1" : [1*w_r/2, 1*h_r/2], "FR2" : [3*w_r/2, 1*h_r/2], "FR3" : [5*w_r/2, 1*h_r/2],
                        "FR4" : [1*w_r/2, 3*h_r/2], "FR5" : [3*w_r/2, 3*h_r/2], "FR6" : [5*w_r/2, 3*h_r/2],
                        "FR7" : [1*w_r/2, 5*h_r/2], "FR8" : [3*w_r/2, 5*h_r/2], "FR9" : [5*w_r/2, 5*h_r/2]}
        # Initialise buffer
        self.buffer = [4]*20
        # Initialise message
        self.old_FR = "FR5"

    # Initialise gaze tracking camera-based parameters
    def camera_init(self):
        # Create camera object
        self.GazePal_Camera = cv.VideoCapture(0)
        (self.status, self.frame) = self.GazePal_Camera.read()
        self.stopped = False
        self.thread = Thread(target=self.update, args=())
        self.thread.start()

    # Initialise CNN-based parameters
    def CNN_init(self):
        # Create CNN
        self.model_path = os.path.join("models", "GazePal-Latest.pth")
        self.GazePal_CNN = CNN()
        self.GazePal_CNN.load_state_dict(torch.load(self.model_path))
        # Set image transforms
        self.img_transform = transforms.Compose([transforms.ToPILImage(),
                                        transforms.Resize((100,100)),
                                        transforms.Grayscale(3),
                                        transforms.ToTensor(),
                                        transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))])
        
        # Create Haar Cascade classifier for Eyes
        self.haar_eye = cv.CascadeClassifier(os.path.join("models", "haarcascade_eye.xml"))
        self.haar_face = cv.CascadeClassifier(os.path.join("models", "haarcascade_frontalface_default.xml"))
        
        print("[INFO]: Created Haar Classifier.")

    # Repeatedly acquire images from gaze tracking camera
    def update(self):
        # Loop infinitely
        while True:
            # If stopped then break from loop
            if self.stopped:
                break
            # Read image frame from camera
            (self.status, self.frame) = self.GazePal_Camera.read()

    # Returns acquired image frame
    def read(self):
        # Return frame
        return self.frame

    # Exit protocol
    def stop(self):
        self.stopped = True
        # Release gaze tracking camera object
        self.GazePal_Camera.release()
        # Join threads
        self.thread.join()  
        # Close all OpenCV windows
        cv.destroyAllWindows()


    # Move cursor to within a FR
    def absolute_movement(self, FR):
        # Retrieve xy position inside FR
        pos_x = self.regions[FR][0]
        pos_y = self.regions[FR][1]
        # Move cursor to location
        pyautogui.moveTo(pos_x, pos_y, 0.5)

    # Initiate left-mouse button click
    def cursor_click(self):
        # Perform click
        pyautogui.leftClick()

    # Function to detect faces
    def detect_faces(self, img):
        # Convert to grayscale
        gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
        # Detect face(s) in the image
        faces = self.haar_face.detectMultiScale(gray, 1.3, 5)
        
        # Loop through each face detected
        for (fx, fy, fw, fh) in faces:
            # Draw rectangle(s) over every face
            cv.rectangle(img, (fx,fy), (fx+fw,fy+fh), (225,0,0), 2)

        return faces

    # Detect eyes in image frame
    def detect_eyes(self, img):
        # Convert to grayscale        
        gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
        # Detect eye(s) in the image
        eyes = self.haar_eye.detectMultiScale(gray)
        # Extract image dimensions
        height = np.size(img, 0)
        width = np.size(img, 1)
        # Initialise that no eyes are detected
        left_eye = None
        right_eye = None

        # Loop through each eye detected
        for (ex, ey, ew, eh) in eyes:
            # Check if detected eye is in bottom half of face
            if ey > height/2:
                pass
            else:
                # Centre between the eyes
                centre = ex + ew/2
                # Check if centre of eye is on the right or left
                if centre > width/2:
                    # Draw rectangle(s) over every eye
                    cv.rectangle(img, (ex,ey), (ex+ew,ey+eh), (225,0,0), 2)
                    # Crop eye
                    eye = img[ey:ey+eh, ex:ex+ew]

        # Return cropped image of left eye and right eye
        return eye

    # Predict the gaze for a given image frame
    def predict_gaze(self):
        
        # Reset previous time
        prev_time = time.time()

        # Read frame
        frame = self.read()

        # Flip frame
        frame = cv.flip(frame, 1)

        try:
            # Detect face
            faces = self.detect_faces(frame)
            # Crop face image
            face_img = frame[faces[0][1]:faces[0][1]+faces[0][3], faces[0][0]:faces[0][0]+faces[0][2]]
            # Detect the eyes in face image
            eye = self.detect_eyes(face_img)    
            # Transform image before CNN pass-through
            torch_img = self.image_loader(eye)
            # Obtain CNN prediction distribution
            output = self.GazePal_CNN(torch_img)
            # Extract prediction with highest energy
            _, prediction = torch.max(output.data, 1)

            # Remove oldest prediction in buffer
            self.buffer.pop(0)
            # Append new prediction to buffer
            self.buffer.append(int(prediction))
            # Determine most frequently predicted FR
            prediction = max(self.buffer, key=self.buffer.count)
            # Obtain FR name
            FR = str(self.classes[prediction])

            # Check if FR is not same as previous FR
            if self.old_FR != FR:
                # If not, then move to new FR
                self.absolute_movement(FR)
                # Reset old FR value to current FR
                self.old_FR = FR
                # Reset timer
                self.timer = time.time()
            else:
                # If same, then check time elapsed
                if (time.time() - self.timer) > 2:
                    # If more than 2 seconds on same FR,
                    # then reset time
                    self.timer = time.time()
                    # Initiate cursor click
                    self.cursor_click()
        except:
            # Process errors as FR not available
            FR = "N/A"

        # Print FR number in frame
        cv.putText(frame, FR, (20,50), cv.FONT_HERSHEY_SIMPLEX, 1, (0,255,0), 2)

        # Update new time
        new_time = time.time()
        # Compute and write fps
        time_taken = (new_time - prev_time)
        fps = "FPS: {0:.1f}".format(1/time_taken)
        cv.putText(frame, fps, (120,50), cv.FONT_HERSHEY_SIMPLEX, 1, (0,255,0), 2)
        # Update previous time
        prev_time = new_time
        
        # Show image frame
        cv.imshow("frame", frame)
            
    # Repeatedly predict user gaze
    def gaze_tracking(self):
        # Loop infinitely
        while True:
            # Predict user gaze
            self.predict_gaze()

            # Wait for keystroke
            k = cv.waitKey(1)

            # If keystroke is ESC
            if k == 27:
                # Print message
                print("[INFO]: ESC pressed; quitting program.")
                # Break from loop
                break

            # # If keystroke is SPACE
            # elif k == 32:
            #     if self.logging:
            #         self.logging = False
            #         print("[INFO]: SPACE pressed; stopping logging.")
            #     else:
            #         print("[INFO]: SPACE pressed; starting logging.")
            #         self.logging = True
        
        # Exit GazePal 
        self.stop()

    # Transforms to image before CNN prediction
    def image_loader(self, img):

        # Transform image
        torch_img = self.img_transform(img).float()
        # Convert to tensor
        torch_img = torch.tensor(torch_img, requires_grad=True)
        # Unsqueeze
        torch_img = torch_img.unsqueeze(0)
        # Return new torch image
        return torch_img







