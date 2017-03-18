import React from 'react';

export default function UserTeam(props) {
	return (
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
				{props.data.map((player, i) => {
					return (
						<tr onClick={() => props.remove(player, i)}>
							<th scope="row">{`${props.data[i].player.FirstName} ${props.data[i].player.LastName}`}</th>
							<td>{`${props.data[i].player.Position}`}</td>
							<td>{`${props.data[i].stats.PtsPerGame['#text']}`}</td>
							<td>{`${props.data[i].stats.RebPerGame['#text']}`}</td>
							<td>{`${props.data[i].stats.AstPerGame['#text']}`}</td>
							<td>{`${props.data[i].stats.FgPct['#text']}`}</td>
							<td>{`${props.data[i].stats.Fg3PtPct['#text']}`}</td>
						</tr>
					)
				})}
			</tbody>
		</table>
	)
}
