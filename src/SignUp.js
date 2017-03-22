import React from 'react';

export default class SignUp extends React.Component {
	constructor() {
		super();
		this.state = {
			email: '', 
			password: '',
			confirm: '',
			signedUpState: '',
		}
		this.handleChange = this.handleChange.bind(this);
		this.signup = this.signup.bind(this);
	}
	componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				this.setState({
					signedUpState: 'signedIn'
				})
			} else {
				this.setState({
					signedUpState: 'signedOut'
				})
			}
		})
	}
	
	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}
	signup(e) {
		e.preventDefault();
		
		if (this.state.password === this.state.confirm) {
			firebase.auth()
				.createUserWithEmailAndPassword(this.state.email, this.state.password)
				.then((userData) => {
					console.log(userData);
				})
				.catch(function(error) {
					alert(error)
					console.log('error message', error.message);
				})
				
				console.log('signuped')
				console.log('seconddd', this.state.email, this.state.password, this.state.confirm)
				this.setState({
					signedUpState: true
				})
		}
		else {
			alert('sorry your password and confirm password must match');
		}

	}

	
	render() {
		let signUpForm = '';
		if (this.state.signedUpState === 'signedOut') {
			signUpForm = (
				<form onSubmit={this.signup}>
					<h2>Get in the game today</h2>
					<label htmlFor="email">Email</label>
					<input type="email" name="email" onChange={this.handleChange} placeholder="Your email goes here"/>
					<label htmlFor="password">Password</label>
					<input type="password" name="password" onChange={this.handleChange}/>
					<label htmlFor="confirm">Confirm Password</label>
					<input type="password" name="confirm" onChange={this.handleChange}/>
					<button>Sign Up Now</button>
				</form>
			)
		}
		else if (this.state.signedUpState === 'signedIn') {
			signUpForm = (
				<h2>You're all signed up! Go and create you team now!</h2>
			)
		}
		return (

				<div className="registerArea">
						{signUpForm}
				</div>

		)
	}
}