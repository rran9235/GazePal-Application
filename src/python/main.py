"""
GazePal Application
Author: Rishi Rangarajan
Year: 2021 

File: main.py
Info: Main file to start GazePal
"""

# Imports
import sys
import time
from GazePal_PC import GazePal_PC
	
# Main function
if __name__ == "__main__":
	# Create GazePal object
	GazePal = GazePal_PC()
	# Perform gaze tracking
	GazePal.gaze_tracking()