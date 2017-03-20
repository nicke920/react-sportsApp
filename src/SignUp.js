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
		if (firebase.auth().currentUser === null) {
			console.log('noo')
			this.setState({
				signedUpState: false
			})
		}
		else if (firebase.auth().currentUser !== null) {
			console.log('yess')
			this.setState({
				signedUpState: true
			})
		}
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
					console.log('erorrrrr', error.message);
				})
				
				console.log('signupedniggaaa')
				console.log('seconddd', this.state.email, this.state.password, this.state.confirm)
		}
		else {
			alert('sorry your password and confirm password didnt match');
		}

	}

	
	render() {
		let signUpForm = '';
		if (this.state.signedUpState === false) {
			signUpForm = (
				<form onSubmit={this.signup}>
					<h3>Sign Up Today</h3>
					<label htmlFor="email">Email</label>
					<input type="email" name="email" onChange={this.handleChange} placeholder="Your email goes here"/>
					<label htmlFor="password">Password</label>
					<input type="password" name="password" onChange={this.handleChange}/>
					<label htmlFor="confirm">Confirm Password</label>
					<input type="password" name="confirm" onChange={this.handleChange}/>
					<button>Sign In</button>
				</form>
			)
		}
		else if (this.state.signedUpState === true) {
			signUpForm = (
				<h2>Thank's for signing up!</h2>
			)
		}
		return (

				<div className="registerArea">
					<div className="register signUpImage">
						
						
					</div>
					<div className="registerRight">
						{signUpForm}
					</div>
	
					
				</div>

		)
	}
}