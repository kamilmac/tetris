import * as React from "react";
import { AppState } from "../state";
import { Control } from "./icons";
import { Text } from "./text";

let scale = 1;
let dir = +1;

const Variants = {
	inDemo: {
		icon: Control,
		label: () => (
			<div>
				<Text color="#FFFFFFFF">Press</Text>
				<Text> </Text>
				<Text color="#FFFFFFFF" size={16}>
					<b>ENTER</b>
				</Text>
				<Text> </Text>
				<Text color="#FFFFFFFF">to</Text>
				<Text> </Text>
				<Text color="#FFFFFFFF">
					<b>PLAY!</b>
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
		AppState.subscribe(["status"], (state) => {
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
		<>
			<div
				className={AppState.state.status !== 'gameOver' ? 'hidden' : 'visible'}
				style={{
			    height: '50%',
			    bottom: 0,
			    position: 'absolute',
			    animation: 'opacity 2s linear',
			    background: 'linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5))',
					width: '100%',
				}}	
			/>
			<div
				style={{
					position: "absolute",
					bottom: 96,
					left: "calc(50% - 130px)",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					width: 260,
					height: 120,
					overflow: "hidden",
					gap: 20,
					transform: 'scale(1.25)',
				}}
			>
				{ buttonState !== 'mini' && (
					<div
						style={{
							animation: 'rotate 1.2s linear infinite',
							width: 66,
						  height: 66,
							background: "conic-gradient(from 90deg, rgb(249 146 76), rgb(203 50 90), rgb(57 112 193), rgb(249 146 76))",
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
					data-test="cta-button"
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
		</>
	);
};
