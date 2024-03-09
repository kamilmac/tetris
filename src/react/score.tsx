import * as React from "react";
import { AppState } from "../state";
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
		AppState.subscribe(["score", "bestScore"], (state) => {
			setBestScore(state.bestScore);
			setScore(state.score);
		});
		AppState.subscribe(["status"], (state) => {
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
				<Text size={24} mono>
					{scoreString}
				</Text>
			)}
			<Fire />
			<Text size={24} mono>
				{bestScoreString}
			</Text>
			<div
				style={{
					position: "absolute",
					right: -5,
					bottom: 10,
				}}
			>
				<Text size={10} color="#FFFFFFDD">
					BEST SCORE
				</Text>
			</div>
		</div>
	);
};
