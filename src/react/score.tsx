import * as React from "react";
import { Fire } from "./icons";
import { Text } from "./text";

export const Score = () => {
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
				____
			</Text>
			<Fire />
			<Text size="18px" mono>
				_136
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
