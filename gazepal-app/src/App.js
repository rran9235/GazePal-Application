/*
GazePal Application
Author: Rishi Rangarajan
Year: 2021 

File: App.js
Info: React.js application file
*/

import React, { Component } from "react";
import { Link, Route, BrowserRouter, Switch, Redirect } from "react-router-dom";
// Custom files
import PTZCamera from "./components/PTZCamera";

class App extends Component {
	
	render() {
		return (
			<div>
				<BrowserRouter>
					<PTZCamera/>
				</BrowserRouter>
			</div>
		);
	}
}

export default App;
