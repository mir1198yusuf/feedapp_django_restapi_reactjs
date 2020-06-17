import React from "react";
import "./w3.css";
import axios from "axios";
import API_URL from "./constants.js";


class Heading extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			showLoginForm : false,
			username : '',
			password : '',
			username_error : undefined,
			password_error : undefined,
			login_error : undefined,
			isLoggedIn : false	//though loginbutton/username logic is built on sessionStorage username value, but after login we need to change state apart from removing sessionstorage..so this state used
		};
	}

	toggleLoginForm = (ev) => {
		this.setState({showLoginForm : !this.state.showLoginForm});
		// clear all fields/error before closing/opening form to avoid previous data
		this.setState({
			username : '',
			password : '',
			username_error : undefined,
			password_error : undefined,
			login_error : undefined
		});
	};

	onInputChange = (ev) => {
		let name, value;
		name = ev.target.name;
		value = ev.target.value;
		this.setState({[name] : value});
	};

	onFormSubmit = (ev) => {
		ev.preventDefault();
		this.logInUser();
	};

	logInUser = () => {
		let form_data = new FormData();
		form_data.append("username", this.state.username);
		form_data.append("password", this.state.password);

		axios.post(API_URL + "login/", form_data).then(

				(response) => {

					//store username in sessionstorage
					sessionStorage.setItem("username", response.data.username);

					//store api token in sessionstorage
					sessionStorage.setItem("api_token", response.data.token);

					//close login form
					this.toggleLoginForm();

					this.setState({isLoggedIn : true});
				}
			).catch(
				(error) => {

					let username_error, password_error, login_error;

					if (error.response){ 	//response returned from error

						//username error
						if (error.response.data.username){
							username_error = error.response.data.username[0];
						}
						//password error
						if (error.response.data.password){
							password_error = error.response.data.password[0];
						}
						//general login error
						if (error.response.data.non_field_errors){
							login_error = error.response.data.non_field_errors[0];
						}
					}
					else{		//no error response returned means error at api endpoint
						login_error = "Error at API endpoint in login user";
					}

					this.setState({
						username_error : username_error,
						password_error : password_error,
						login_error : login_error
					});

				}
			);
	};

	onLogoutButtonClick = (ev) => {
		this.logoutUser();
	};

	logoutUser = () => {
		let form_params = {
			headers : {
				"authorization" : "Token " + sessionStorage.getItem("api_token")
			}
		};
		axios.post(API_URL + "logout/", null,form_params).then(
			(response) => {
				sessionStorage.removeItem("api_token");
				sessionStorage.removeItem("username");

				this.setState({isLoggedIn : false});
				//this will change state, causing re-render and now since login/username is built on sessionstorage value, it will work as expected
				//the only use of state.isLoggedIn is to cause re-render..because re-render doesnot occur for sessionstorage value change
			}

		).catch(
			(error) => {
				console.log(error);
			}
		);
	};

	render(){

		let loggedUser = sessionStorage.getItem("username");

		return(
			<div className="w3-dark-grey w3-center">
				<h1 className="w3-text-white w3-wide w3-inline-block">Feed App</h1>
				<div className="w3-inline-block w3-right">
					<div className={loggedUser ? "w3-hide" : "w3-show"} >
						<button className="w3-button w3-round-large" onClick={this.toggleLoginForm} > 
							Login
						</button>
					</div>
					<div className={loggedUser ? "w3-show" : "w3-hide"} >
						<div className="w3-dropdown-hover w3-dark-grey" >
							<button className="w3-button w3-round-large">
								{loggedUser}
							</button>
							<div className="w3-dropdown-content w3-bar-block w3-border w3-right-margin-0" >
								<button className="w3-bar-item w3-button" onClick={this.onLogoutButtonClick} >
									Logout
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* modal login form */}
				<div className={(this.state.showLoginForm) ? "w3-show" : "w3-hide"} >
					<div className="w3-modal w3-center w3-block">
						<div className="w3-modal-content w3-animate-top w3-card-4" >
							<header className="w3-container w3-dark-grey">
								<h3 className="w3-text-white">Login to Feed app</h3>
								<span onClick={this.toggleLoginForm} className="w3-button w3-display-topright" >
									&times;
								</span>
							</header>
							<div className="w3-container w3-text-dark-grey" >
								<form onSubmit={this.onFormSubmit} >
									<div>
										<span className="w3-text-red">{this.state.login_error}</span>
									</div>
									<div>
										Username
										<input className="w3-form-element" type="text" name="username" value={this.state.username} onChange={this.onInputChange} />
										<span className="w3-text-red">{this.state.username_error}</span>
									</div>
									<div>
										Password
										<input className="w3-form-element" type="password" name="password" value={this.state.password} onChange={this.onInputChange} />
										<span className="w3-text-red">{this.state.password_error}</span>
									</div>
									<button className="w3-button w3-form-element w3-round-large w3-dark-grey" type="submit" >Login</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Heading;