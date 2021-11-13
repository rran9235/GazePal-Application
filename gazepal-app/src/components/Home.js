// React Imports
import React, { Component } from 'react';
import { PropTypes } from "prop-types";
import { Link } from 'react-router-dom';
// Material-UI imports
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
// Custom files
// Custom CSS file
import "./../App.css";

const useStyles = theme => ({

	root: {
		backgroundColor: "black",
		color: "white",
		width: "100%",
		height: "100%",
	},

	title: {
		flexGrow: 1,
		width: "100vw",
		height: "33vh",
		backgroundColor: "black",
		color: "white",
		fontFamily: "JetBrains Mono", 
		fontSize: "4em",
		textAlign: "center",
		justifyContent: "bottom",
	},

	exit: {
		flexGrow: 1,
		width: "100%",
		backgroundColor: "black",
		color: "white",
		fontFamily: "JetBrains Mono", 
		fontSize: "3em",
		textAlign: "center",
	},

	grid_children: {
		width: "100%",
		height: "33vh",
	},

	button: {
		width: "100%",
		height: "100%",
		fontFamily: "JetBrains Mono",
		fontSize: "3em",
		textAlign: "center",
	},
});

class Home extends Component {

	constructor(props) {
		super(props);
	}

	HomeSection() {
		const { classes } = this.props;
		return (
			<div>
				<Grid container direction="row" justifyContent="space-evenly">
					<Grid item xm={12} xs={12} className={classes.grid_children}>
						<div className={classes.title}>
							GazePal
						</div>
					</Grid>
					<Grid item xm={4} xs={4} className={classes.grid_children}>
						<Button className={classes.button} onClick={() => {alert("Redirect to SOS alarm page")} }>
							SOS
						</Button>
					</Grid>
					<Grid item xm={4} xs={4} className={classes.grid_children}>
						<Button className={classes.button} component={Link} to="/ptzcamera" onClick={() => {alert("Redirect to PTZ Camera control page")} }>
							PTZ Camera
						</Button>
					</Grid>
					<Grid item xm={4} xs={4} className={classes.grid_children}>
						<Button className={classes.button} onClick={() => {alert("Redirect to Robotic Arm control page")} }>
							Robotic Arm
						</Button>
					</Grid>
					<Grid item xm={4} xs={4} className={classes.grid_children}>
						<Button className={classes.button} onClick={() => {alert("Redirect to Keyboard typing page")} }>
							Keyboard
						</Button>
					</Grid>
					<Grid item xm={4} xs={4}>
						<Button className={classes.button} onClick={() => {alert("Redirect to Home Automation control page")} }>
							Smart Home
						</Button>
					</Grid>
					<Grid item xm={4} xs={4}>
						<Button className={classes.button} onClick={() => {alert("Redirect to Help page")} }>
							Help
						</Button>
					</Grid>
				</Grid>
			</div>
		);
	}

	render() {
		return (this.HomeSection());
	}
}

Home.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default withStyles(useStyles)(Home);