import React from 'react';
import ReactDOM from 'react-dom';
import SelectedTeam from './SelectedTeam.js';
import Login from './Login.js';
import SignUp from './SignUp.js';
import { Router, Route, browserHistory, Link } from 'react-router';

class HomePage extends React.Component {
	render() {
		return (
			<div className="homePage">
				<div className="homePageText">
					<h1>Keep track of your players all season long</h1>
					<p>Don't have a fantasy team but would like to keep track of your favourite players through the season? Don't we have the perfect app for you.</p> 
					<p>With Nick's Sports App, you can create you custom team with you favourite players and watch how their season progresses. Sign up today!</p>
					<Link to='/signup' className="signUpToday">Sign Up Today</Link>
				</div>
			</div>
		)
	}
}

class App extends React.Component {
	render() {
		return (
			<div>
					<nav>
						<h2><Link to='/'>Nick's Sports App</Link></h2>
						<div>
							<Link to='/teams'>Teams</Link>
						</div>
						<div className="accountsContainer">
							<div className="accounts">
								<Link to='/login'>My Account</Link>
							</div>
							<div className="accounts">
								<Link to='/signup'>Sign Up</Link>
							</div>
						</div>
					</nav>
				<section className="mainPortal">
					<article>
						{this.props.children || <HomePage />}
					</article>
				</section>
				
			</div>
		)
	}
}


ReactDOM.render(<Router history={browserHistory}>
	<Route path='/' component={App}>
		<Route path="/login" component={Login} />
		<Route path="/signup" component={SignUp} />
		<Route path="/teams" component={SelectedTeam} />
	</Route>
	</Router>, document.getElementById('app'));
// <p key={i}>{this.props.player.player.FirstName}</p>