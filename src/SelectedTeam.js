import React from 'react';
import ReactDOM from 'react-dom';
import { ajax } from 'jquery';
import Login from './Login.js';
import { Router, Route, browserHistory, Link } from 'react-router';

const apiUrl = "https://api.mysportsfeeds.com/v1.1/pull/nba/2017-2018-regular/cumulative_player_stats.json";

const apiUrlTeam = "https://api.mysportsfeeds.com/v1.1/pull/nba/2017-2018-regular/overall_team_standings.json";

var config = {
	apiKey: "AIzaSyBe3L4fbcwO-e4-E4frM4GnvsOIZicvPa8",
	authDomain: "sports-app-62415.firebaseapp.com",
	databaseURL: "https://sports-app-62415.firebaseio.com",
	storageBucket: "sports-app-62415.appspot.com",
	messagingSenderId: "558177509173"
};
firebase.initializeApp(config);


class PreLogin extends React.Component {
	render() {
		return (
			<div className="preLogin">
				<div className="redclass">

					<h2>Hey!</h2>
					<p>You currently have no players on your team!</p>
					<p>If you have logged in, you can add players to your team by clicking on them up above</p>
					<p>If you don't have an account, you're unable to add players to your team. What are you waiting for! Sign up today!</p>
				</div>
			</div>
		)
	}
}




export default class SelectedTeam extends React.Component {
	constructor() {
		super();
		this.state = {
			playersArray: [],
			teamsArray:[{
				rank: '',
				name: '',
				nickname: '',
				id: '',
				stats: ''
			}],
			selectedTeam: [],
			userTeam: [], 
			selectedTeamID: '101'
		}
	this.selectTeam = this.selectTeam.bind(this);
	this.addPlayer = this.addPlayer.bind(this);
	this.removePlayer = this.removePlayer.bind(this);
	this.expandMyTeam = this.expandMyTeam.bind(this);
	}
	componentDidMount() {
		ajax({
			url: apiUrl,
			method: 'GET',
			format: 'json',
			headers: {
				Authorization: 'Basic bmlja2U5MjA6bGFuZ2VyMTE='
			}
		})
		.then((result) => {
			const players = result.cumulativeplayerstats.playerstatsentry;
			const selectedTeamPlayers = players.filter((value, i) => {
				if (value.team.ID == this.state.selectedTeamID) {
					return value
				}
			});
			this.setState({
				playersArray: players,
				selectedTeam: selectedTeamPlayers
			})
			console.log(this.state.playersArray)
		})
		ajax({
			url: apiUrlTeam,
			method: 'GET', 
			format: 'json',
			headers: {
				Authorization: 'Basic bmlja2U5MjA6bGFuZ2VyMTE='
			}
		})
		.then((data) => {
			const teams = data.overallteamstandings.teamstandingsentry;
			console.log(teams)
			const teamIDArray = teams.map((val, i) => {
				return (
						{
						rank: val.rank,
						name: val.team.City,
						nickname: val.team.Name,
						id: val.team.ID,
						stats: val.stats
					}
				) 
			})

			console.log('testyy', teamIDArray)
			this.setState({
				teamsArray: teamIDArray
			})
		})

		//FIREBASE APPLICATION

		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
			const dbRef = firebase.database().ref(`users/${user.uid}/players`);
				dbRef.on('value', (fireData) => {
					const players = fireData.val();
					const parsedPlayers = [];
					for(let playerKey in players) {
						const parsedPlayer = JSON.parse(players[playerKey]);
						parsedPlayer.key = playerKey
						parsedPlayers.push(parsedPlayer);
					}

					this.setState({
						userTeam: parsedPlayers
					});
				});
			}
		})

	}
	selectTeam(each) {
		console.log('hey', each)
		const selectedTeamPlayers = this.state.playersArray.filter((value, i) => {
			if (value.team.ID == each.target.value) {
				return value
			}
		});
		console.log('coffee', selectedTeamPlayers);
		this.setState({
			selectedTeam: selectedTeamPlayers,
			selectedTeamID: each.target.value
		})
	}
	addPlayer(val) {
		if(firebase.auth().currentUser !== null) {
			console.log('fire', val);
			const userID = firebase.auth().currentUser.uid;
			const dbRef = firebase.database().ref(`users/${userID}/players`);
			dbRef.push(JSON.stringify(val))
		} else {
			alert('Please log in to add a player to your team.');
		}
	}
	removePlayer(val, i) {
		console.log('remove',val);
		const userID = firebase.auth().currentUser.uid;
		const dbRef = firebase.database().ref(`users/${userID}/players/${val.key}`);
		dbRef.remove();
	}
	expandMyTeam() {
		this.teamDetails.classList.toggle('hider');
		console.log('clicked');

	}

render() {
	let teamInfo = '';

	const teamStats = this.state.teamsArray.filter((team) => {
		if (this.state.selectedTeamID == team.id) {
			return team
		}
	})
	console.log(teamStats)
	if (teamStats[0] !== undefined) {
		teamInfo = (
			<div className="teamDetails">
				<div className="detailsStack">
					<div className='imageContainer'>
						<img src={`../assets/img/${this.state.selectedTeamID}.png`} alt=""/>
						<div>
							<h2>{`${teamStats[0].name} ${teamStats[0].nickname}`}</h2>
							<h3>{`${teamStats[0].stats.Wins['#text']} - ${teamStats[0].stats.Losses['#text']}`}</h3>
						</div>
					</div>	
					<div className="teamInfo">
						<div>
							<p>{`NBA Rank: ${teamStats[0].rank}`}</p>
							<p>{`PPG: ${teamStats[0].stats.PtsPerGame['#text']}`}</p>
							<p>{`PPGA: ${teamStats[0].stats.PtsAgainstPerGame['#text']}`}</p>
							<p>{`+/-: ${teamStats[0].stats.PlusMinusPerGame['#text']}`}</p>
						</div>
						<div>
							<p>{`FGM-FGA: ${teamStats[0].stats.FgMadePerGame['#text']}-${teamStats[0].stats.FgAttPerGame['#text']}`}</p>
							<p>{`FG%: ${teamStats[0].stats.FgPct['#text']}%`}</p>
							<p>{`3PM-3PA: ${teamStats[0].stats.Fg3PtMadePerGame['#text']}-${teamStats[0].stats.Fg3PtAttPerGame['#text']}`}</p>
							<p>{`FG%: ${teamStats[0].stats.Fg3PtPct['#text']}%`}</p>
						</div>
					</div>
				</div>
				<div className='teamTable'>
					<table>
						<caption>Click on a player to save them to your team</caption>
						<thead>
							<tr>
								<th scope="col">Player Name</th>
								<th scope="col">Position</th>
								<th scope="col">PPG</th>
								<th scope="col">RPG</th>
								<th scope="col">APG</th>
							</tr>
						</thead>
						<tbody>
							{this.state.selectedTeam.map((player, i) => {
								if(this.state.selectedTeam[i].stats.PtsPerGame['#text'] !== '0.0'){
									return (
										<tr key={`player${i}`} onClick={() => this.addPlayer(player)}>
											<th scope="row">{`${this.state.selectedTeam[i].player.FirstName} ${this.state.selectedTeam[i].player.LastName}`}</th>
											<td>{`${this.state.selectedTeam[i].player.Position}`}</td>
											<td>{`${this.state.selectedTeam[i].stats.PtsPerGame['#text']}`}</td>
											<td>{`${this.state.selectedTeam[i].stats.RebPerGame['#text']}`}</td>
											<td>{`${this.state.selectedTeam[i].stats.AstPerGame['#text']}`}</td>
										</tr>
									)
								}
							})}
						</tbody>
					</table>
				</div>
			</div>

			)
	}

	let viewToShow = '';
	if (this.state.userTeam.length > 0) {
		viewToShow = (
			<section className="rosterContainer">
				<div className="ctaBanner">
					<h2>Your Team</h2>
				</div>
				<table className="myTeam">
					<caption><Link className="linkFull" onClick={this.expandMyTeam}>Expand</Link></caption>
					<thead>
						<tr>
							<th scope="col">Player</th>
							<th scope="col">GP</th>
							<th scope="col">MIN</th>
							<th scope="col">FGM-FGA</th>
							<th scope="col">FG%</th>
							<th scope="col">FTM-FTA</th>
							<th scope="col">FT%</th>
							<th scope="col">3P%</th>
							<th scope="col">RPG</th>
							<th scope="col">APG</th>
							<th scope="col">BPG</th>
							<th scope="col">SPG</th>
							<th scope="col">PPG</th>
						</tr>
					</thead>
					<tbody>

						{this.state.userTeam.map((player, i) => {
							return (
								<tr key={`userTeam${i}`} onClick={() => this.removePlayer(player, i)}>
									<th scope="row">{`${this.state.userTeam[i].player.FirstName} ${this.state.userTeam[i].player.LastName}, (${this.state.userTeam[i].player.Position})`}</th>
									<td>{`${this.state.userTeam[i].stats.GamesPlayed['#text']}`}</td>
									<td>{`${(this.state.userTeam[i].stats.MinSecondsPerGame['#text'] / 60).toFixed(1)}`}</td>
									<td>{`${this.state.userTeam[i].stats.FgMadePerGame['#text']}-${this.state.userTeam[i].stats.FgAttPerGame['#text']}`}</td>
									<td>{`${this.state.userTeam[i].stats.FgPct['#text']}`}</td>
									<td>{`${this.state.userTeam[i].stats.FtMadePerGame['#text']}-${this.state.userTeam[i].stats.FtAttPerGame['#text']}`}</td>
									<td>{`${this.state.userTeam[i].stats.FtPct['#text']}`}</td>
									<td>{`${this.state.userTeam[i].stats.Fg3PtPct['#text']}`}</td>
									<td>{`${this.state.userTeam[i].stats.RebPerGame['#text']}`}</td>
									<td>{`${this.state.userTeam[i].stats.AstPerGame['#text']}`}</td>
									<td>{`${this.state.userTeam[i].stats.BlkPerGame['#text']}`}</td>
									<td>{`${this.state.userTeam[i].stats.StlPerGame['#text']}`}</td>
									<td>{`${this.state.userTeam[i].stats.PtsPerGame['#text']}`}</td>
								</tr>
							)
						})}
					</tbody>
				</table>


			</section>
			)
	} else {
		viewToShow = (
			<PreLogin />
			)
	}

	return (
		<div>
			<section className="teamContainer" ref={ref => this.teamDetails = ref}>
				<div className="wrapper">
					<select value={this.state.value} id="teamSelector" onChange={this.selectTeam}>
						{this.state.teamsArray.map((each,i) => {
							return (
								<option key={`teamsArray${i}`} value={each.id}>{each.name}</option>
							)
						})}
					</select>

						{teamInfo}
				</div>
			</section>

			{viewToShow}
		</div>
	)

}
}
