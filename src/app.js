import React from 'react';
import ReactDOM from 'react-dom';
import SelectedTeam from './SelectedTeam.js';
import Login from './Login.js';
import { Router, Route, browserHistory, Link } from 'react-router';


class App extends React.Component {
	render() {
		return (
			<div>
				<section className="mainPortal">
					<aside>
						<li>
							<Link to='/login'>Home</Link>
						</li>
						<li>
							<Link to='/teams'>Teams</Link>
						</li>
					</aside>
					<article>
						{this.props.children}
					</article>
				</section>
				
			</div>
		)
	}
}


ReactDOM.render(<Router history={browserHistory}>
	<Route path='/' component={App}>
		<Route path="/login" component={Login} />
		<Route path="/teams" component={SelectedTeam} />
	</Route>
	</Router>, document.getElementById('app'));
// <p key={i}>{this.props.player.player.FirstName}</p>