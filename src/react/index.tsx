import * as React from "react";
import { createRoot } from "react-dom/client";
import { Key, LegendBox } from "./legend_box";
import { Text } from "./text";
import { SvgLine } from "./svg_line";
import { ActionButton } from "./action_button";
import { Score } from "./score";
import { appState } from "../state";

import './styles.css';

const App = () => {
	const [showLegend, setShowLegend] = React.useState(true);

	const onClick = () => {
    if (["inDemo", "gameOver"].includes(appState.state.status)) {
			setShowLegend(false);
			setTimeout(() => {
				appState.changeStatus("playing");
			}, 200);
    }
  };

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
						header="Block Controls"
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
							<Key label="↓" /> keys to move block and <Key label="r" /> to rotate.
							<br />Hit <Key label="space" w={5} /> to drop it.
						</Text>
					</LegendBox>
					<SvgLine
						subPositionStart="legend2"
						subPositionEnd="stage"
					/>
					<LegendBox
						header="Camera Rotation"
						hook="left"
						dots={2}
						publishPosition="legend2"
						w={220}
						h={148}
						x={0.7}
						y={0.4}
					>
						<Text>
							Press <Key label="shift" w={3} />
							<Text color="#F16883" size={12}> + </Text>
							<Key label="→" /><br />or <Key label="shift" w={3} />
							<Text color="#F16883" size={12}> + </Text>
							<Key label="←" /> to rotate camera <br />around the stage.
						</Text>
					</LegendBox>
				</div>
			}
			<ActionButton onAction={onClick} />
			<Score />
		</>
	);
};

createRoot(document.getElementById("react-root") as HTMLElement).render(
	<App />,
);
