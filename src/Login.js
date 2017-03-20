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
		if (firebase.auth().currentUser === null) {
			console.log('noo')
			this.setState({
				loginState: false
			})
		}
		else if (firebase.auth().currentUser !== null) {
			console.log('yess')
			this.setState({
				loginState: true
			})
		}

	}
	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
		console.log('names', this.state.name)
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
				console.log(userData);
			})
			this.setState({
				loginState: true
			})
		
	}
	render() {
		let loginForm = '';
		if (this.state.loginState == false) {
			loginForm = (
				<div className="registerRight">
					<form onSubmit={this.login}>
						<h3>Login</h3>
						<label htmlFor="name">Name</label>
						<input type="text" name="name" onChange={this.handleChange} placeholder="Your name goes here"/>
						<label htmlFor="email">Email</label>
						<input type="email" name="email" onChange={this.handleChange} placeholder="Your email goes here"/>
						<label htmlFor="password">Password</label>
						<input type="password" name="password" onChange={this.handleChange}/>
						<button className="logIn">Log In</button>
					</form>
				</div>
			)
		} 
		else if (this.state.loginState == true) {
			loginForm = (
				<div>
					<h2>You're already logged in! Go and enjoy the app now!!</h2>
					<button onClick={this.signOut}>Sign Out</button>
				</div>
			)
		}
		return (

				<div className="registerArea">
					<div className="register loginImage">
						
						
					</div>
					{loginForm}

					
				</div>

		)
	}
}