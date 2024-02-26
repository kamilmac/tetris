import * as React from "react";
import { Bridge } from "../utils/bridge";

interface LineProps {
	subPositionStart: string;
	subPositionEnd: string;
}

export const SvgLine = (props: LineProps) => {
	const divRef = React.useRef(null);
	const crRef = React.useRef(null);
	const frameId = React.useRef(null);

	const animate = () => {
		if (divRef.current && crRef.current) {
			divRef.current.setAttribute("x1", Bridge.get(`${props.subPositionStart}_x`));
			divRef.current.setAttribute("y1", Bridge.get(`${props.subPositionStart}_y`));
			divRef.current.setAttribute("x2", Bridge.get(`${props.subPositionEnd}_x`));
			divRef.current.setAttribute("y2", Bridge.get(`${props.subPositionEnd}_y`));
			crRef.current.setAttribute("cx", Bridge.get(`${props.subPositionEnd}_x`));
			crRef.current.setAttribute("cy", Bridge.get(`${props.subPositionEnd}_y`));
		}
		frameId.current = requestAnimationFrame(animate);
	};

	React.useEffect(() => {
		frameId.current = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(frameId.current);
	}, []);

	return (
		<svg
			style={{ position: "absolute", pointerEvents: "none" }}
			width="100vw"
			height="100vh"
			role="img"
			aria-label="A line connecting two points"
		>
			<line
				ref={divRef}
				x1="0"
				y1="0"
				x2="0"
				y2="0"
				stroke="#F16883"
				strokeWidth="2"
				strokeDasharray="5, 5"
			>
				<animate
					attributeName="stroke-dashoffset"
					values="100;0"
					dur="3s"
					calcMode="linear"
					repeatCount="indefinite"
				/>
			</line>
			<circle ref={crRef} cx="0" cy="0" r="12" fill="#F16883" />
		</svg>
	);
};
