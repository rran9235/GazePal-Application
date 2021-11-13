"""
GazePal Application
Author: Rishi Rangarajan
Year: 2021 

File: Class_CNN.py
Info: CNN class definition
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision
import torchvision.transforms as transforms

# Class definition
class CNN(nn.Module):

    # Class constructor
    def __init__(self):

        super().__init__()
        # Convolutional layers
        self.conv1 = nn.Conv2d(3, 6, 5)
        self.conv2 = nn.Conv2d(6, 16, 5)
        # Pooling layers
        self.pool = nn.MaxPool2d(2, 2)
        # Dropout layers
        self.dropout = nn.Dropout(p=0.5)
        # Fully connected layers
        self.fc1 = nn.Linear(7744, 120)
        self.fc2 = nn.Linear(120, 84)
        self.fc3 = nn.Linear(84, 9)

        # Print message
        print("[INFO]: Created CNN object")

    # Step forward
    def forward(self, x):

        # Conv & Pooling layers
        x = self.pool(F.relu(self.conv1(x)))
        x = self.pool(F.relu(self.conv2(x)))
        
        # print(x.shape)
        x = x.view(x.size(0), -1)
        
        # FCs
        x = F.relu(self.fc1(x))
        x = self.dropout(x)
        x = F.relu(self.fc2(x))
        x = self.dropout(x)
        x = self.fc3(x)

        # Return prediction
        return x