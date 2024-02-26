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
	const [score, setScore] = React.useState(0);
	const [bestScore, setBestScore] = React.useState(localStorage.getItem('bestScore') || 0);
	const [isDemo, setIsdemo] = React.useState(true);

	React.useEffect(() => {
		appState.subscribe(['score', 'bestScore'], (state) => {
			setBestScore(state.bestScore);
			setScore(state.score);
		});	
		appState.subscribe(['status'], (state) => {
			if (state.status !== 'inDemo') {
				setIsdemo(false);
			}
		});
	}, []);

	const scoreString = getScoreString(score);
	const bestScoreString = getScoreString(bestScore);

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
			{
				!isDemo && (
					<Text size="18px" mono>
						{ scoreString }
					</Text>
				)
			}
			<Fire />
			<Text size="18px" mono>
				{ bestScoreString }
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
