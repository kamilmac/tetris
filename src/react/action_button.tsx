import * as React from "react";
import { Control } from "./icons";
import { Text } from "./text";
import { appState } from "../state";


let scale = 1;
let dir = +1;

export const ActionButton = (props) => {
  const [buttonState, setButtonState] = React.useState('maximized');
	const ref = React.useRef<React.LegacyRef<HTMLDivElement>>(null);
	const frameId = React.useRef<number | null>(null);

	const animate = () => {
		if (ref.current) {
			scale += dir * 0.001;
			if (scale > 1.02) {
				dir = -1;
			} else if (scale < 0.98) {
				dir = 1;
			}

			ref.current.style.transform = `scale(${scale})`;
		}
		frameId.current = requestAnimationFrame(animate);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
    appState.subscribe(["status"], (state) => {
      if (state.status === "playing") {
        setButtonState('minimized');
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
				bottom: 30,
				left: window.innerWidth * 0.5 - 130,
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
			<div
        className={ buttonState === 'minimized' ? "scaledDown" : "" }
				style={{
					width: 60,
					height: 60,
					borderRadius: "50%",
					background: "#CB325A",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					cursor: "pointer",
				}}
				ref={ref}
        onPointerUp={props.onAction}
			>
        {
          buttonState !== 'minimized' &&
            <Control />
        }
			</div>
			<div>
				<Text color="#F16883" size={18}>[ </Text>
				<Text color="#FFFFFF80">
					Press
				</Text>
				<Text> </Text>
				<Text color="#FFFFFFCC" size={16}>
					<b>ENTER</b>
				</Text>
				<Text> </Text>
				<Text color="#FFFFFF80">
					to
				</Text>
				<Text> </Text>
				<Text color="#FFFFFFCC">
					<b>take control</b>
				</Text>
				<Text color="#F16883" size={18}> ]</Text>
			</div>
		</div>
	);
};