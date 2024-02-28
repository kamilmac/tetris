import * as React from "react";
import { createRoot } from "react-dom/client";
import { appState } from "../state";
import { ActionButton } from "./action_button";
import { Key, LegendBox } from "./legend_box";
import { Score } from "./score";
import { SvgLine } from "./svg_line";
import { Text } from "./text";

import { initAI } from "./ai";
import "./styles.css";

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
				<div className={showLegend ? "" : "hidden"}>
					<SvgLine subPositionStart="legend1" subPositionEnd="active_box" />
					<LegendBox
						header="Movement Controls"
						hook="right"
						dots={1}
						publishPosition="legend1"
						w={220}
						h={156}
						x={0.18}
						y={0.15}
					>
						<Text size={15}>
							Use <Key label="←" />
							<Key label="↑" />
							<Key label="→" />
							<Key label="↓" /> keys to move piece and <Key label="r" /> to
							rotate.
							<br />
							Hit <Key label="space" w={5} /> to drop it.
						</Text>
					</LegendBox>
					<SvgLine subPositionStart="legend2" subPositionEnd="stage" />
					<LegendBox
						header="Stage Rotation"
						hook="left"
						dots={2}
						publishPosition="legend2"
						w={174}
						h={128}
						x={0.7}
						y={0.5}
					>
						<Text size={15}>
							Press <Key label="shift" w={3} />
							<Text color="#F16883" size={13}>
								{" "}
								+{" "}
							</Text>
							<Key label="→" />
							<br />
							or <Key label="shift" w={3} />
							<Text color="#F16883" size={13}>
								{" "}
								+{" "}
							</Text>
							<Key label="←" /> <br />
							to rotate stage.
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
