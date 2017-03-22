import React from 'react';

export default class Login extends React.Component {
	constructor() {
		super();
		this.state = {
			name: '',
			email: '', 
			password: '',
			loginState: ''
		}
		this.handleChange = this.handleChange.bind(this);
		this.login = this.login.bind(this);
		this.signOut = this.signOut.bind(this);
	}
	componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
			console.log("userr", user);
			if (user) {
				console.log('YOU ARE LOGGED IN')
				this.setState({
					loginState: true
				})
			} else {
				console.log('YOU ARE NOT LOGGED IN')
				this.setState({
					loginState: false
				})
			}
			
		})


	}
	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
		// console.log('names', this.state.name)
	}
	signOut(e) {
		e.preventDefault();
		firebase.auth().signOut();
		console.log('signed out user');
		this.setState({
			loginState: false
		})
	}
	login(e) {
		e.preventDefault();
		firebase.auth()
			.signInWithEmailAndPassword(this.state.email, this.state.password)
			.then((userData) => {
				// console.log(userData);
				this.setState({
					loginState: true
				})
			})
			.catch(function(error) {
				alert(error)
				// console.log('error message', error)
			})
		
	}
	render() {
		// let loginForm = '';
		let	login = (
				<form onSubmit={this.login}>
					<h2>Login to your account</h2>
					<label htmlFor="email">Email</label>
					<input type="email" name="email" onChange={this.handleChange} placeholder="Your email goes here"/>
					<label htmlFor="password">Password</label>
					<input type="password" name="password" onChange={this.handleChange}/>
					<button className="logIn">Sign in to your account</button>
				</form>
			)
		let	loggedIn = (
				<div>
					<h2>You are logged in now! Enjoy!</h2>
					<button onClick={this.signOut}>Sign Out</button>
				</div>
			)
	


		return (
				<div className="registerArea">

					{this.state.loginState === true ? loggedIn : login}

				</div>

		)
	}
}