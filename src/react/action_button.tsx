import * as React from "react";
import { appState } from "../state";
import { Control } from "./icons";
import { Text } from "./text";

let scale = 1;
let dir = +1;

const Variants = {
	inDemo: {
		icon: Control,
		label: () => (
			<div>
				<Text color="#FFFFFF80">Press</Text>
				<Text> </Text>
				<Text color="#FFFFFFCC" size={16}>
					<b>ENTER</b>
				</Text>
				<Text> </Text>
				<Text color="#FFFFFF80">to</Text>
				<Text> </Text>
				<Text color="#FFFFFFCC">
					<b>take control</b>
				</Text>
			</div>
		),
	},
	gameOver: {
		icon: Control,
		label: () => (
			<div>
				<Text color="#FFFFFF80">Press</Text>
				<Text> </Text>
				<Text color="#FFFFFFCC" size={16}>
					<b>ENTER</b>
				</Text>
				<Text> </Text>
				<Text color="#FFFFFF80">to</Text>
				<Text> </Text>
				<Text color="#FFFFFFCC">
					<b>Go Again!</b>
				</Text>
			</div>
		),
	},
	mini: {
		icon: null,
		label: null,
		minimized: true,
	},
};

interface Props {
	onAction: () => void;
}

export const ActionButton = (props: Props) => {
	const [buttonState, setButtonState] = React.useState("inDemo");
	const ref = React.useRef<React.LegacyRef<HTMLDivElement>>(null);
	const frameId = React.useRef<number | null>(null);

	const animate = () => {
		if (ref.current) {
			scale += dir * 0.002;
			if (scale > 1.03) {
				dir = -1;
			} else if (scale < 0.97) {
				dir = 1;
			}
			// @ts-ignore
			// ref.current.style.transform = `scale(${scale})`;
		}
		frameId.current = requestAnimationFrame(animate);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		// listen on enter keypress on document
		document.addEventListener("keydown", (event) => {
			if (event.key === "Enter") {
				props.onAction();
			}
		});
		appState.subscribe(["status"], (state) => {
			if (state.status === "playing") {
				setButtonState("mini");
			} else if (state.status === "gameOver") {
				setButtonState("gameOver");
			}
		});
		frameId.current = requestAnimationFrame(animate);
		return () => {
			typeof frameId.current === "number" &&
				cancelAnimationFrame(frameId.current);
		};
	}, []);

	return (
		<div
			style={{
				position: "absolute",
				bottom: 48,
				left: "calc(50% - 130px)",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				width: 260,
				height: 120,
				overflow: "hidden",
				gap: 20,
			}}
		>
			{ buttonState !== 'mini' && (
				<div
					style={{
						animation: 'rotate 1.2s linear infinite',
						width: 66,
					  height: 66,
					  background: `conic-gradient(
					    from 90deg,
					    rgb(26 27 38), rgb(26 27 38), rgb(41 43 61), rgb(203 50 90), rgb(242 104 131), rgb(249 147 78), rgb(57 112 192), #22345e)`,
					  margin: 10,
					  borderRadius: '50%',
					  position: 'absolute',
					  bottom: 40,
					}}
				/>
			)}
			<div
				style={{
					width: 60,
					height: 60,
					borderRadius: "50%",
					background: "#1A1B26",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					cursor: "pointer",
					zIndex: 1,
				}}
				// @ts-ignore
				ref={ref}
				onPointerUp={props.onAction}
			>
				{buttonState !== "mini" &&
					// @ts-ignore
					Variants[buttonState]?.icon()}
			</div>
			{buttonState !== "mini" &&
				// @ts-ignore
				Variants[buttonState]?.label()}
		</div>
	);
};
