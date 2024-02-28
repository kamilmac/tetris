import * as React from "react";
import { createRoot } from "react-dom/client";
import { Key, LegendBox } from "./legend_box";
import { Text } from "./text";
import { SvgLine } from "./svg_line";
import { ActionButton } from "./action_button";
import { Score } from "./score";
import { appState } from "../state";

import './styles.css';
import { CFG } from "../config";

const RANDOM_ACTIONS: (keyof typeof CFG.controls)[] = [
	"left",
	"right",
	"up",
	"down",
	"left",
	"right",
	"up",
	"down",
	"fall",
	"fall",
	"rotate",
	"rotate",
	"rotate",
	"rotate",
	"camera_rotate_right",
	"camera_rotate_left",
];

const initAI = () => {
	setInterval(() => {
		if (appState.state.status !== "inDemo") {
			return;
		}
		const chance = 0.1;
		if (Math.random() < chance) {
			const randomAction =
				RANDOM_ACTIONS[Math.floor(Math.random() * RANDOM_ACTIONS.length)];
			const event = CFG.controls[randomAction];
			if (!event) {
				return;
			}
			document.dispatchEvent(event);
		}
	}, 40);
};

const App = () => {
	const [showLegend, setShowLegend] = React.useState(true);

	const onAction = () => {
    if (["inDemo", "gameOver"].includes(appState.state.status)) {
			setShowLegend(false);
			setTimeout(() => {
				appState.changeStatus("playing");
			}, 200);
    }
  };

  React.useEffect(() => {
  	initAI();
  }, []);

	return (
		<>
			{
				<div
					className={ showLegend ? "" : "hidden" }
				>
					<SvgLine
						subPositionStart="legend1"
						subPositionEnd="active_box"
					/>
					<LegendBox
						header="Movement Controls"
						hook="right"
						dots={1}
						publishPosition="legend1"
						w={220}
						h={148}
						x={0.15}
						y={0.15}
					>
						<Text>
							Use <Key label="←" />
							<Key label="↑" />
							<Key label="→" />
							<Key label="↓" /> keys to move piece and <Key label="r" /> to rotate.
							<br />Hit <Key label="space" w={5} /> to drop it.
						</Text>
					</LegendBox>
					<SvgLine
						subPositionStart="legend2"
						subPositionEnd="stage"
					/>
					<LegendBox
						header="Stage Rotation"
						hook="left"
						dots={2}
						publishPosition="legend2"
						w={220}
						h={124}
						x={0.7}
						y={0.4}
					>
						<Text>
							Press <Key label="shift" w={3} />
							<Text color="#F16883" size={12}> + </Text>
							<Key label="→" /><br />or <Key label="shift" w={3} />
							<Text color="#F16883" size={12}> + </Text>
							<Key label="←" /> <br />to rotate stage.
						</Text>
					</LegendBox>
				</div>
			}
			<ActionButton onAction={onAction} />
			<Score />
		</>
	);
};

createRoot(document.getElementById("react-root") as HTMLElement).render(
	<App />,
);
