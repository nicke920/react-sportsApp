import React from 'react';
import ReactDOM from 'react-dom';
import { ajax } from 'jquery';
import UserTeam from './UserTeam.js';
import Login from './Login.js';
import { Router, Route, browserHistory, Link } from 'react-router';

const apiUrl = "https://www.mysportsfeeds.com/api/feed/pull/nba/2016-2017-regular/cumulative_player_stats.json";

const apiUrlTeam = "https://www.mysportsfeeds.com/api/feed/pull/nba/2016-2017-regular/overall_team_standings.json?teamstats=W,L,PTS,PTSA";

var config = {
	apiKey: "AIzaSyBe3L4fbcwO-e4-E4frM4GnvsOIZicvPa8",
	authDomain: "sports-app-62415.firebaseapp.com",
	databaseURL: "https://sports-app-62415.firebaseio.com",
	storageBucket: "sports-app-62415.appspot.com",
	messagingSenderId: "558177509173"
};
firebase.initializeApp(config);

export default class SelectedTeam extends React.Component {
constructor() {
		super();
		this.state = {
			playersArray: [],
			teamsArray:[],
			selectedTeam: [],
			userTeam: []
		}
	this.selectTeam = this.selectTeam.bind(this);
	this.addPlayer = this.addPlayer.bind(this);
	this.removePlayer = this.removePlayer.bind(this);
	}
	componentDidMount() {
		ajax({
			url: apiUrl,
			method: 'GET',
			format: 'json',
			headers: {
				Authorization: 'Basic bmlja2U5MjA6YWJvdmUzMzM='
			}
		})
		.then((result) => {
			const players = result.cumulativeplayerstats.playerstatsentry;
			this.setState({
				playersArray: players
			})
		})
		ajax({
			url: apiUrlTeam,
			method: 'GET', 
			format: 'json',
			headers: {
				Authorization: 'Basic bmlja2U5MjA6YWJvdmUzMzM='
			}
		})
		.then((data) => {
			const teams = data.overallteamstandings.teamstandingsentry;
			const teamIDArray = teams.map((val, i) => {
				return (
						{
						name: val.team.City,
						id: val.team.ID
					}
				) 
			})

			console.log('testyy', teamIDArray)
			this.setState({
				teamsArray: teamIDArray
			})
		})

		//FIREBASE APPLICATION
		const dbRef = firebase.database().ref();

		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
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
			if (value.team.ID == each.id) {
				return value
			}
		});
		console.log('coffee', selectedTeamPlayers);
		this.setState({
			selectedTeam: selectedTeamPlayers
		})
	}
	addPlayer(val) {
		if(firebase.auth().currentUser !== null) {
			console.log('fire', val);
			const dbRef = firebase.database().ref();
			dbRef.push(JSON.stringify(val))
		} else {
			alert('soryy bruvvv');
		}
	}
	removePlayer(val, i) {
		console.log('remove',val);
		const dbRef = firebase.database().ref(val.key);
		dbRef.remove();
	}
render() {
	return (
		<div>
			<section className="teamContainer">
				{this.state.teamsArray.map((each, i) => {
					return (
						<img key={`team-${i}`} onClick={() => this.selectTeam(each)} src={`../assets/img/${each.id}.png`} />
					)
				})}
			</section>
			<section className="rosterContainer">
				<table>
				<caption>{() => this.state.selectedTeam[1].team.City}</caption>
					<thead>
						<tr>
							<th scope="col">Player Name</th>
							<th scope="col">Position</th>
							<th scope="col">PPG</th>
							<th scope="col">RPG</th>
							<th scope="col">APG</th>
							<th scope="col">FG%</th>
							<th scope="col">3Pt%</th>
						</tr>
					</thead>
					<tbody>
						{this.state.selectedTeam.map((player, i) => {
							if(this.state.selectedTeam[i].stats.PtsPerGame['#text'] !== '0.0'){
								return (
									<tr onClick={() => this.addPlayer(player)}>
										<th scope="row">{`${this.state.selectedTeam[i].player.FirstName} ${this.state.selectedTeam[i].player.LastName}`}</th>
										<td>{`${this.state.selectedTeam[i].player.Position}`}</td>
										<td>{`${this.state.selectedTeam[i].stats.PtsPerGame['#text']}`}</td>
										<td>{`${this.state.selectedTeam[i].stats.RebPerGame['#text']}`}</td>
										<td>{`${this.state.selectedTeam[i].stats.AstPerGame['#text']}`}</td>
										<td>{`${this.state.selectedTeam[i].stats.FgPct['#text']}`}</td>
										<td>{`${this.state.selectedTeam[i].stats.Fg3PtPct['#text']}`}</td>
									</tr>
								)
							}
						})}
					</tbody>
				</table>
				<table>
					<thead>
						<tr>
							<th scope="col">Player Name</th>
							<th scope="col">Position</th>
							<th scope="col">PPG</th>
							<th scope="col">RPG</th>
							<th scope="col">APG</th>
							<th scope="col">FG%</th>
							<th scope="col">3Pt%</th>
						</tr>
					</thead>
					<tbody>
						{this.state.userTeam.map((player, i) => {
							return (
								<tr onClick={() => this.removePlayer(player, i)}>
									<th scope="row">{`${this.state.userTeam[i].player.FirstName} ${this.state.userTeam[i].player.LastName}`}</th>
									<td>{`${this.state.userTeam[i].player.Position}`}</td>
									<td>{`${this.state.userTeam[i].stats.PtsPerGame['#text']}`}</td>
									<td>{`${this.state.userTeam[i].stats.RebPerGame['#text']}`}</td>
									<td>{`${this.state.userTeam[i].stats.AstPerGame['#text']}`}</td>
									<td>{`${this.state.userTeam[i].stats.FgPct['#text']}`}</td>
									<td>{`${this.state.userTeam[i].stats.Fg3PtPct['#text']}`}</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			</section>
		</div>
	)

}


}
