/*
GazePal Application
Author: Rishi Rangarajan
Year: 2021 

File: WebcamFeed.js
Info: Read and show webcam video output
*/

import { Component } from "react";

class WebcamFeed extends Component {
	constructor(props) 
	{
	  super(props);
	  this.streamCamVideo= this.streamCamVideo.bind(this)
	}

	streamCamVideo() 
	{
	  var constraints = { audio: false, video: { width: {ideal: 1280}, height: {ideal: 720}} };
	  navigator.mediaDevices
		.getUserMedia(constraints)
		.then(function(mediaStream) {
		  var video = document.querySelector("video");
  
		  video.srcObject = mediaStream;
		  video.onloadedmetadata = function(e) {
			video.play();
		  };
		})
		.catch(function(err) {
		  console.log(err.name + ": " + err.message);
		}); // always check for errors at the end.
	}

	render() {
		this.streamCamVideo();
	  return (
		<div>
		  <div id="container" style={{position: "absolute",  top: "50%", left: "50%", transform: 'translate(-50%, -50%) scale(100%)'}}>
			<video autoPlay={true} id="videoElement"></video>
		  </div>
		  <br/>
		  {/* <button onClick={this.streamCamVideo}>Start streaming</button> */}
		</div>
	  );
	}
  }

export default (WebcamFeed);