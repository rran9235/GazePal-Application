/*
GazePal Application
Author: Rishi Rangarajan
Year: 2021 

File: PTZCamera.js
Info: PT Camera control component
*/

// React Imports
import React, { Component } from 'react';
import { PropTypes } from "prop-types";
import axios from 'axios';
// Material-UI imports
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Arrow from "@material-ui/icons/ArrowRightAlt";
// Custom files
import sample_img from "./images/sample_ptz_view.jpg"
import WebcamFeed from './WebcamFeed';
// Custom CSS file
import styles from "./style.css";


const useStyles = theme => ({

	root: {
		// backgroundColor: "black",
		// color: "white",
		width: "1280px",
		height: "720px",
		position: "relative",
	},

	grid_parent: {
		width: "100%",
		height: "100%",
		zIndex: 1,
		position: "absolute",
		top: 0,
		left: 0,
	},

	grid_children: {
		width: "100%",
		height: "33vh",
	},

	button: {
		position: "relative",
		width: "100%",
		height: "100%",
		fontFamily: "JetBrains Mono",
		fontSize: "3em",
		textAlign: "center",
		// transition: "all 3s ease-out",
		color: "black",
		overflow: "hidden",
		// border: "0",
		// zIndex: "1",
		backgroundColor: "none",
		opacity: "0",

		"&:hover":{
			color: "white",
			background: "black",
			transition: "3s",
			opacity: 1,
		},

		// "&::before": {
		// 	content: "",
		// 	position: "absolute",
		// 	background: "blue",
		// 	left: "0%",
		// 	right: "0%",
		// 	top: "100%",
		// 	zIndex: -1,
		// 	transition: "top 3s ease-in",
		// 	// opacity: 1,
		// },

		// "&:hover::before": {
		// 	top: "0",
		// 	// opacity: 1,
		// },
	},

	cam_feed: {
		width: "100%",
		height: "100%",
		zIndex: -1,
		position: "absolute",
		top: "50%",
		left: "50%",
		align: "center",
	},

	cam_text: {
		fontSize: "5em",
		textAlign: "center",
	},
});

// Camera class
class PTZCamera extends Component 
{
	constructor(props) 
	{
		super(props);
		this.state = {
			pan_angle: 90,
			tilt_angle: 90,
			increment: 10,
		}
	}

	// Prevent refresh
	handleclick(e)
	{
		e.stopPropagation();
  		e.nativeEvent.stopImmediatePropagation();
	}

	// Update pan and/or tilt
	UpdatePanTilt(button)
	{
		
		if (button == 1)
		{
			this.setState(
				{
					tilt_angle: this.state.tilt_angle - this.state.increment,
					pan_angle: this.state.pan_angle + this.state.increment
				},
			this.WritetoSerial,
			);
		}
		else if (button == 2)
		{
			this.setState(
				{
					tilt_angle: this.state.tilt_angle - this.state.increment
				},
			this.WritetoSerial,
			);
		}
		else if (button == 3)
		{
			this.setState(
				{
					tilt_angle: this.state.tilt_angle - this.state.increment,
					pan_angle: this.state.pan_angle - this.state.increment
				},
			this.WritetoSerial,
			);
		}
		else if (button == 4)
		{
			this.setState(
				{
					pan_angle: this.state.pan_angle + this.state.increment
				},
			this.WritetoSerial,
			);
		}
		else if (button == 6)
		{
			this.setState(
				{
					pan_angle: this.state.pan_angle - this.state.increment
				},
			this.WritetoSerial,
			);
		}
		else if (button == 7)
		{
			this.setState(
				{
					tilt_angle: this.state.tilt_angle + this.state.increment,
					pan_angle: this.state.pan_angle + this.state.increment
				},
			this.WritetoSerial,
			);
		}
		else if (button == 8)
		{
			this.setState(
				{
					tilt_angle: this.state.tilt_angle + this.state.increment
				},
			this.WritetoSerial,
			);
		}
		else if (button == 9)
		{
			this.setState(
				{
					tilt_angle: this.state.tilt_angle + this.state.increment,
					pan_angle: this.state.pan_angle - this.state.increment
				},
			this.WritetoSerial,
			);
		}

	}

	// Post to backend 
	WritetoSerial() 
	{
		var pan = this.state.pan_angle.toString(); 
		var tilt = this.state.tilt_angle.toString();
		var angles = { pan, tilt};
		// var params = {method: "POST", data : angles}
		axios
			.post('http://localhost:8080/post', angles)
			.then(() => console.log('Sent Created'))
			.catch(err => {
			console.error(err);
			});
	}

	// GUI button placement
	ControlPTZCamera()
	{
		const { classes } = this.props;
		return (
			<div className={classes.container}>
				<WebcamFeed className={classes.cam_feed}/>
				<Grid container direction="row" justifyContent="space-evenly" className={classes.grid_parent}>
					<Grid item xm={4} xs={4} className={classes.grid_children}>
						<Button	 className={classes.button} onClick={(e) => { e.preventDefault(); this.UpdatePanTilt(1);} }>
							{/* Tilt Up <br/> Pan Left */}
							<Arrow style={{transform: "scale(10) rotate(225deg)"}} />
						</Button>
					</Grid>
					<Grid item xm={4} xs={4} className={classes.grid_children}>
						<Button className={classes.button} onClick={() => {this.UpdatePanTilt(2);} }>
							{/* Tilt Up */}
							<Arrow style={{transform: "scale(10) rotate(270deg)"}} />
						</Button>
					</Grid>
					<Grid item xm={4} xs={4} className={classes.grid_children}>
						<Button className={classes.button} onClick={() => {this.UpdatePanTilt(3);}}>
							{/* Tilt Up <br/> Pan Right */}
							<Arrow style={{transform: "scale(10) rotate(315deg)"}} />
						</Button>
					</Grid>
					<Grid item xm={4} xs={4} className={classes.grid_children}>
						<Button className={classes.button} onClick={() => {this.UpdatePanTilt(4);} }>
							{/* Pan Left */}
							<Arrow style={{transform: "scale(10) rotate(180deg)"}} />
						</Button>
					</Grid>
					<Grid item xm={4} xs={4}>
						{/* <div className={classes.cam_text}>
							Pan: {this.state.pan_angle}
							<br/>
							Tilt: {this.state.tilt_angle}
						</div> */}
					</Grid>
					<Grid item xm={4} xs={4} className={classes.grid_children}>
						<Button className={classes.button} onClick={() => {this.UpdatePanTilt(6);} }>
							{/* Pan Right */}
							<Arrow style={{transform: "scale(10) rotate(0deg)"}} />
						</Button>
					</Grid>
					<Grid item xm={4} xs={4} className={classes.grid_children}>
						<Button className={classes.button} onClick={() => {this.UpdatePanTilt(7);} }>
							{/* Tilt Down <br/> Pan Left */}
							<Arrow style={{transform: "scale(10) rotate(135deg)"}} />
						</Button>
					</Grid>
					<Grid item xm={4} xs={4} className={classes.grid_children}>
						<Button className={classes.button} onClick={() => {this.UpdatePanTilt(8);} }>
							{/* Tilt Down */}
							<Arrow style={{transform: "scale(10) rotate(90deg)"}} />
						</Button>
					</Grid>
					<Grid item xm={4} xs={4} className={classes.grid_children}>
						<Button className={classes.button} onClick={() => {this.UpdatePanTilt(9);} }>
							{/* Tilt Down <br/> Pan Right */}
							<Arrow style={{transform: "scale(10) rotate(45deg)"}} />
						</Button>
					</Grid>
				</Grid>
			</div>
		);
	}

	render() {
		return (this.ControlPTZCamera());
	}
}

PTZCamera.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default withStyles(useStyles)(PTZCamera);