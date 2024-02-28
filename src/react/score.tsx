import * as React from "react";
import { appState } from "../state";
import { Fire } from "./icons";
import { Text } from "./text";

const getScoreString = (score: number) => {
	const scoreString = String(score);
	const scoreStringLength = 4;
	const reminderString = new Array(scoreStringLength - scoreString.length).fill(
		"_",
	);
	return [...reminderString, ...scoreString].join("");
};

export const Score = () => {
	const [score, setScore] = React.useState(0);
	const [bestScore, setBestScore] = React.useState(
		Number(localStorage.getItem("bestScore")) || 0,
	);
	const [isDemo, setIsdemo] = React.useState(true);

	React.useEffect(() => {
		appState.subscribe(["score", "bestScore"], (state) => {
			setBestScore(state.bestScore);
			setScore(state.score);
		});
		appState.subscribe(["status"], (state) => {
			if (state.status !== "inDemo") {
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
			}}
		>
			{!isDemo && (
				<Text size={22} mono>
					{scoreString}
				</Text>
			)}
			<Fire />
			<Text size={22} mono>
				{bestScoreString}
			</Text>
			<div
				style={{
					position: "absolute",
					right: -4,
					bottom: 12,
				}}
			>
				<Text size={9} color="#FFFFFFDD">
					BEST SCORE
				</Text>
			</div>
		</div>
	);
};
