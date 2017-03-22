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
							<p>Don't have a fantasy team but would like to keep track of your favourite players through the season?</p>
							 <p>With PlayerWatch, you can create you custom team with you favourite players and watch how their season progresses.</p> 
							<Link to='/signup' className="linkFull">Sign Up Today</Link>
						</div>
					</div>
					<div className="homePageImage"></div>
				</div>
				<div className="ctaBanner">
					<div className="wrapper">
						Sign Up for free and get started by creating your team in 2 minutes!
						<Link to='/signup' className="linkTransparent">Sign Up Today</Link>
					</div>
				</div>
				<section className="information">
					<div className="wrapper">
						<div className="secondImage">
						</div>
						<article>
							<div className="infoText">
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
						<div className="wrapper">
							<i className="fa fa-facebook" aria-hidden="true"></i>
							<i className="fa fa-twitter" aria-hidden="true"></i>
							<i className="fa fa-github" aria-hidden="true"></i>
							<i className="fa fa-instagram" aria-hidden="true"></i>
						</div>
					</div>
					<div className="wrapper">
						<h2 className="logo">
							<Link to='/'>PlayerWatch</Link>
						</h2>
						
						<div className="accountsContainer">
							<div className="accounts teams">
								<Link to='/teams'>Teams</Link>
							</div>
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
				<footer>
					<div className="socialMedia">
						<div className="wrapper">
							2017 | Nicholas Evans
							<i className="fa fa-facebook" aria-hidden="true"></i>
							<i className="fa fa-twitter" aria-hidden="true"></i>
							<i className="fa fa-github" aria-hidden="true"></i>
							<i className="fa fa-instagram" aria-hidden="true"></i>
						</div>
					</div>
				</footer>
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