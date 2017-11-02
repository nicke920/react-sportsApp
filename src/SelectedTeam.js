import React from 'react';
import ReactDOM from 'react-dom';
import { ajax } from 'jquery';
import Login from './Login.js';
import { Router, Route, browserHistory, Link } from 'react-router';

const apiUrl = "https://api.mysportsfeeds.com/v1.1/pull/nba/2017-2018-regular/cumulative_player_stats.json";

const apiUrlTeam = "https://api.mysportsfeeds.com/v1.1/pull/nba/2017-2018-regular/overall_team_standings.json";

const apiUrlPlayer = "https://api.mysportsfeeds.com/v1.1/pull/nba/2017-2018-regular/player_gamelogs.json?"

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
			selectedTeamID: '101',
			modalShowing: true,
			selectedPlayer: '',
			loadingScreen: true,
			updaterShowing: false,
			updaterSaying: ''

		}
	this.selectTeam = this.selectTeam.bind(this);
	this.addPlayer = this.addPlayer.bind(this);
	this.removePlayer = this.removePlayer.bind(this);
	this.expandMyTeam = this.expandMyTeam.bind(this);
	this.showPlayerModal = this.showPlayerModal.bind(this);
	this.exitPlayerModal = this.exitPlayerModal.bind(this);
	this.escFunction = this.escFunction.bind(this);
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
				selectedTeam: selectedTeamPlayers,
				loadingScreen: false
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
			console.log('a', data)
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
		document.addEventListener("keydown", this.escFunction, false)

	}
	componentWilLUnmout() {
		document.addEventListener("keydown", this.escFunction, false)
	}

	escFunction(ev) {
		if (ev.keyCode === 27 && this.state.modalShowing === true) {
			this.setState({
				modalShowing: false
			})
		}
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
			
			const userID = firebase.auth().currentUser.uid;
			const dbRef = firebase.database().ref(`users/${userID}/players`);
			const userTeamArray = this.state.userTeam;
			const addedPlayer = val;
			let okToAdd = true;
			console.log('useteaa', this.state.userTeam)
			console.log('valuuuuu', val)

			for (var i = 0; i < userTeamArray.length; i++) {
				if (addedPlayer.player.ID === userTeamArray[i].player.ID) {
					okToAdd = false
				} 
			}
			
			if (okToAdd === true) {
				dbRef.push(JSON.stringify(val))
				
				this.setState({
					updaterShowing: true,
					updaterSaying: `You just added ${val.player.FirstName} ${val.player.LastName} to your watchlist!`
				})

				setTimeout(function() { 
					this.setState({
						updaterShowing: false
					}); 
					this.updaterDiv.classList.remove('slide')
				}.bind(this), 1700);

				this.updaterDiv.classList.add('slide')
			} else {
				this.setState({
					updaterShowing: true,
					updaterSaying: `You cannot add ${val.player.FirstName} ${val.player.LastName} again. He's already on your team`
				})

				setTimeout(function() { 
					this.setState({
						updaterShowing: false
					}); 
					this.updaterDiv.classList.remove('slide')
				}.bind(this), 2500);

				this.updaterDiv.classList.add('slide')
			}

		} else {
			alert('Please log in to add a player to your team.');
		}
	}
	removePlayer(val, i) {
		console.log('remove',val);
		const userID = firebase.auth().currentUser.uid;
		const dbRef = firebase.database().ref(`users/${userID}/players/${val.key}`);
		dbRef.remove();

		this.setState({
			updaterShowing: true,
			updaterSaying: `You just removed ${val.player.FirstName} ${val.player.LastName} from your watchlist!`
		})

		setTimeout(function() { 
			this.setState({
				updaterShowing: false
			}); 
			this.updaterDiv.classList.remove('slide')
		}.bind(this), 1700);

		this.updaterDiv.classList.add('slide')
	}
	expandMyTeam() {
		this.teamDetails.classList.toggle('hider');
		console.log('clicked');
	}

	showPlayerModal(id, playerFormat, teamAbbr) {
		console.log('888', apiUrlPlayer + 'player=' + playerFormat)
		ajax({
			url: apiUrlPlayer + 'player=' + playerFormat,
			method: 'GET',
			format: 'json',
			headers: {
				Authorization: 'Basic bmlja2U5MjA6bGFuZ2VyMTE='
			}
		})
		.then((result) => {
			this.setState({
				modalShowing: true,
				selectedPlayer: result
			})
			console.log('result', typeof result)
		})
	}
	exitPlayerModal(ev) {
		console.log('eventtt', ev)
		this.setState({
			modalShowing: false
		})
	}

render() {
	let updater = '';


		updater = (
				<div className="updater" ref={ref => this.updaterDiv = ref}>
					<p>{this.state.updaterSaying}</p>
				</div>
			)


	let loadingScreen = '';

	if (this.state.loadingScreen === true) {
		loadingScreen = (
				<div className="loading">
					<h1>Loading players...</h1>
				</div>
			)
	}



	let teamInfo = '';

	const teamStats = this.state.teamsArray.filter((team) => {
		console.log('887',team)
		if (this.state.selectedTeamID == team.id) {
			return team
		}
	})


	let playerModal = '';

	if (this.state.modalShowing === true) {
		{console.log('NEWWEST', this.state.selectedPlayer)}
		let playerGameArray = '';
		if (this.state.selectedPlayer !== '') {
			playerGameArray = this.state.selectedPlayer.playergamelogs.gamelogs
			console.log('runn', playerGameArray.reverse())

			playerModal = (
					<div className="modal">
						<div className="modalContainer">
							<div className="playerInfo">
								<div className="playerInfoContainer">
									<h3>{`${playerGameArray[0].player.FirstName} ${playerGameArray[0].player.LastName}`}</h3>
									<div className="playerDetailInfo">
										<h4>{`${playerGameArray[0].player.Position}`}</h4>
									</div>
									<h5>Last 10 games played:</h5>
									<a className="exitmodal" onClick={this.exitPlayerModal}><i className="fa fa-times-circle-o" aria-hidden="true"></i></a>
								</div>
							</div>
							<div className="stats">
								<div className="table">
									<table>
										<thead>
											<tr>
												<th scope="col">Date</th>
												<th scope="col">Game</th>
												<th scope="col">Min</th>
												<th scope="col">FG</th>
												<th scope="col">FT</th>
												<th scope="col">3's</th>
												<th scope="col">Points</th>
												<th scope="col">Reb</th>
												<th scope="col">Ast</th>
												<th scope="col">Stl</th>
												<th scope="col">Blks</th>
												<th scope="col">TO</th>
											</tr>
										</thead>
										<tbody>
								{
									playerGameArray.map((game, i) => {
											const date = game.game.date.split('-');
											const dateformat = `${date[1]}/${date[2]}`
										
										return (
											<tr key={`game${i}`}>
												<th scope="row">{`${dateformat}`}</th>
												<th scope="row">{`${game.game.awayTeam.Abbreviation} @ ${game.game.homeTeam.Abbreviation}`}</th>
												<td>{`${(game.stats.MinSeconds['#text'] / 60).toFixed(0)}`}</td>
												<td>{`${game.stats.FgMade['#text']}-${game.stats.FgAtt['#text']}`}</td>
												<td>{`${game.stats.FtMade['#text']} / ${game.stats.FtAtt['#text']}`}</td>
												<td>{`${game.stats.Fg3PtMade['#text']} / ${game.stats.Fg3PtAtt['#text']}`}</td>
												<td>{`${game.stats.Pts['#text']}`}</td>
												<td>{`${game.stats.Reb['#text']}`}</td>
												<td>{`${game.stats.Ast['#text']}`}</td>
												<td>{`${game.stats.Stl['#text']}`}</td>
												<td>{`${game.stats.Blk['#text']}`}</td>
												<td>{`${game.stats.Tov['#text']}`}</td>
											</tr>
											)
									})
								}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				)
		}
		
	}
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
							<p><span className="teamInfo-bold">Rank:</span>{`#${teamStats[0].rank}`}</p>
							<p><span className="teamInfo-bold">PPG:</span>{`${teamStats[0].stats.PtsPerGame['#text']}`}</p>
							<p><span className="teamInfo-bold">PPGA:</span>{`${teamStats[0].stats.PtsAgainstPerGame['#text']}`}</p>
							<p><span className="teamInfo-bold">+/-:</span>{`${teamStats[0].stats.PlusMinusPerGame['#text']}`}</p>
						</div>
						<div>
							<p><span className="teamInfo-bold">FG:</span>{`${teamStats[0].stats.FgMadePerGame['#text']}-${teamStats[0].stats.FgAttPerGame['#text']}`}</p>
							<p><span className="teamInfo-bold">FG%:</span>{`${teamStats[0].stats.FgPct['#text']}%`}</p>
							<p><span className="teamInfo-bold">3P:</span>{`${teamStats[0].stats.Fg3PtMadePerGame['#text']}-${teamStats[0].stats.Fg3PtAttPerGame['#text']}`}</p>
							<p><span className="teamInfo-bold">3P%</span>{`${teamStats[0].stats.Fg3PtPct['#text']}%`}</p>
						</div>
					</div>
				</div>
				<div className='teamTable'>
					<table>
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
									const playerID = this.state.selectedTeam[i].player.ID;
									const playerFormat = `${this.state.selectedTeam[i].player.FirstName}-${this.state.selectedTeam[i].player.LastName}-${this.state.selectedTeam[i].player.ID}`;
									const teamAbbr = this.state.selectedTeam[i].team.Abbreviation
									return (
										<tr key={`player${i}`}>
											<th scope="row"><a href="#" className="addbutton" onClick={() => this.addPlayer(player)}><i className="fa fa-plus-square-o" aria-hidden="true"></i></a> <a className="addbutton ad2" onClick={() => this.showPlayerModal(playerID, playerFormat, teamAbbr)}><i className="fa fa-user-circle-o" aria-hidden="true"></i></a>{`${this.state.selectedTeam[i].player.FirstName} ${this.state.selectedTeam[i].player.LastName}`}</th>
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
					<h2>Watchlist</h2>
				</div>
				<table className="myTeam">
					<caption><Link className="linkFull" onClick={this.expandMyTeam}>Expand</Link></caption>
					<thead>
						<tr>
							<th scope="col" className="playerName">Player</th>
							<th scope="col" className="smallTable gp">GP</th>
							<th scope="col" className="smallTable min">MIN</th>
							<th scope="col" className="largeTable fgm">FG</th>
							<th scope="col" className="smallTable fgp">FG%</th>
							<th scope="col" className="largeTable ftm">FT</th>
							<th scope="col" className="smallTable ftp">FT%</th>
							<th scope="col" className="largeTable pp3">3P%</th>
							<th scope="col" className="smallTable reb">RPG</th>
							<th scope="col" className="smallTable ast">APG</th>
							<th scope="col" className="smallTable blk">BPG</th>
							<th scope="col" className="smallTable stl">SPG</th>
							<th scope="col" className="smallTable pts">PPG</th>
						</tr>
					</thead>
					<tbody>
						{this.state.userTeam.map((player, i) => {
							const playerID = this.state.userTeam[i].player.ID;
							const playerFormat = `${this.state.userTeam[i].player.FirstName}-${this.state.userTeam[i].player.LastName}-${this.state.userTeam[i].player.ID}`;
							const teamAbbr = this.state.userTeam[i].team.Abbreviation
							return (
								<tr key={`userTeam${i}`}>
									<th scope="row" className="playerName"><a className="addbutton" onClick={() => this.removePlayer(player, i)}><i className="fa fa-minus-square-o" aria-hidden="true"></i></a> <a className="addbutton ad2" onClick={() => this.showPlayerModal(playerID, playerFormat, teamAbbr)}><i className="fa fa-user-circle-o" aria-hidden="true"></i></a>{`${this.state.userTeam[i].player.FirstName} ${this.state.userTeam[i].player.LastName}, (${this.state.userTeam[i].player.Position})`}</th>
									<td className="smallTable gp">{`${this.state.userTeam[i].stats.GamesPlayed['#text']}`}</td>
									<td className="smallTable min">{`${(this.state.userTeam[i].stats.MinSecondsPerGame['#text'] / 60).toFixed(1)}`}</td>
									<td className="largeTable fgm">{`${this.state.userTeam[i].stats.FgMadePerGame['#text']}-${this.state.userTeam[i].stats.FgAttPerGame['#text']}`}</td>
									<td className="smallTable fgp">{`${this.state.userTeam[i].stats.FgPct['#text']}`}</td>
									<td className="largeTable ftm">{`${this.state.userTeam[i].stats.FtMadePerGame['#text']}-${this.state.userTeam[i].stats.FtAttPerGame['#text']}`}</td>
									<td className="smallTable ftp">{`${this.state.userTeam[i].stats.FtPct['#text']}`}</td>
									<td className="smallTable pp3">{`${this.state.userTeam[i].stats.Fg3PtPct['#text']}`}</td>
									<td className="smallTable reb">{`${this.state.userTeam[i].stats.RebPerGame['#text']}`}</td>
									<td className="smallTable ast">{`${this.state.userTeam[i].stats.AstPerGame['#text']}`}</td>
									<td className="smallTable blk">{`${this.state.userTeam[i].stats.BlkPerGame['#text']}`}</td>
									<td className="smallTable stl">{`${this.state.userTeam[i].stats.StlPerGame['#text']}`}</td>
									<td className="smallTable pts">{`${this.state.userTeam[i].stats.PtsPerGame['#text']}`}</td>
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
	const sortedTeams = this.state.teamsArray.sort(function(a,b) {
		var alc = a.name.toLowerCase();
		var blc = b.name.toLowerCase();
		return alc > blc ? 1 : alc < blc ? -1 : 0;
	})
	console.log('sssteam', sortedTeams)
	return (
		<div>
			{loadingScreen}
			{playerModal}
			{updater}
			<section className="teamContainer" ref={ref => this.teamDetails = ref}>
				<div className="wrapper">
					<select value={this.state.value} id="teamSelector" onChange={this.selectTeam}>
						<option>Select a team...</option>
						{sortedTeams.map((each,i) => {
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