import React from 'react';
import ReactDOM from 'react-dom';
import SelectedTeam from './SelectedTeam.js';
import Login from './Login.js';
import SignUp from './SignUp.js';
import { Router, Route, browserHistory, Link } from 'react-router';

class HomePage extends React.Component {
	render() {
		return (
			<div>
				<div className="homePage wrapper">
					<div className="homePageText">
						<div>
							<h1>Keep track of your players all season long</h1>
							<p>Don't have a fantasy team but would like to keep track of your favourite players through the season? Don't we have the perfect app for you.</p>
							 <p>With Nick's Sports App, you can create you custom team with you favourite players and watch how their season progresses. Sign up today!</p> 
							<Link to='/signup' className="signUpToday">Sign Up Today</Link>
						</div>
					</div>
					<div className="homePageImage"></div>
				</div>
				<div className="ctaBanner">
					<div className="wrapper">
						Sign Up for free and get started by creating your team in 2 minutes!
						<Link to='/signup'>Sign Up Today</Link>
					</div>
				</div>
				<section className="information">
					<div className="wrapper">
						<div>
							
						</div>
						<article>
							<div>
								<h2>Watch the games. Track their stats</h2>
								<p>Everything you need all on one page</p>
								<ul>
									<li><span>1.</span> Sign Up for a free account</li>
									<li><span>2.</span> Add your favourite players to your team</li>
									<li><span>3.</span> Watch and track their stats all season!</li>
								</ul>
							</div>
						</article>
					</div>
				</section>
			</div>
		)
	}
}

class App extends React.Component {
	render() {
		return (
			<div>
				<nav>
					<div className="socialMedia">
						<p>Social Media Goes Here</p>
					</div>
					<div className="wrapper">
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
					</div>
				</nav>
				<section className="mainPortal">
					<article>
						{this.props.children || <HomePage />}
					</article>
				</section>
				<footer>2017 | Nicholas Evans</footer>
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