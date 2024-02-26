import * as React from "react";
import { appState } from "../state";
import { Fire } from "./icons";
import { Text } from "./text";

const getScoreString = (score: number) => {
	const scoreString = String(score);
	const scoreStringLength = 4;
	const reminderString = new Array(scoreStringLength - scoreString.length).fill('_');
	return [...reminderString, ...scoreString].join('');
}

export const Score = () => {
	const [score, setScore] = React.useState('_');
	const [bestScore, setBestScore] = React.useState(localStorage.getItem('bestScore') || 0);


	React.useEffect(() => {
		appState.subscribe(['score', 'status', 'bestScore'], (state) => {
			if (state.status !== 'playing') {
				return;
			}
			setBestScore(state.bestScore);
			setScore(state.score);
		});	
	}, []);

	return (
		<div
			style={{
				position: "absolute",
				top: 32,
				right: 32,
				height: 60,
				display: "flex",
				gap: 12,
				overflow: "hidden",
			}}
		>
			<Text size="18px" mono>
				{ getScoreString(score) }
			</Text>
			<Fire />
			<Text size="18px" mono>
				{ getScoreString(bestScore) }
			</Text>
			<div
				style={{
					position: "absolute",
					right: 0,
					bottom: 20,
				}}
			>
				<Text size="7px" color="#FFFFFFDD">
					BEST SCORE
				</Text>
			</div>
		</div>
	);
};
