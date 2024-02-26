import * as React from "react";
import { Bridge } from "../utils/bridge";
import { Text } from "./text";

interface LegendBoxProps {
	children: React.ReactNode;
	publishPosition: string;
	hook: "left" | "right";
	dots: number;
	header: string;
	w: number;
	h: number;
	x: number;
	y: number;
}

export const LegendBox = (props: LegendBoxProps) => {
	const ref = React.useRef<React.LegacyRef<HTMLDivElement>>(null);
	const frameId = React.useRef<number | null>(null);

	const animate = () => {
		if (ref.current) {
			const n = performance.now() / 1600;
			const tx = Math.cos(n) * 12 + window.innerWidth * props.x;
			const ty = Math.sin(n) * 12 + window.innerHeight * props.y;
			ref.current.style.transform =
				`translate3d(${tx}px, ${ty}px, 0)`;
			Bridge.set(
				`${props.publishPosition}_x`,
				tx + (props.hook === "right" ? props.w + 12 : 0),
			);
			Bridge.set(`${props.publishPosition}_y`, ty + props.h / 2 + 4);
		}
		frameId.current = requestAnimationFrame(animate);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		frameId.current = requestAnimationFrame(animate);
		return () => {
			typeof frameId.current === "number" &&
				cancelAnimationFrame(frameId.current);
		};
	}, []);

	const Dots = Array.from({ length: props.dots }).map((_, i) => (
		<div
			// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
			key={i}
			style={{
				background: "#FFFFFF90",
				width: 5,
				height: 5,
				borderRadius: "50%",
				margin: "0 2px",
			}}
		/>
	));

	return (
		<div
			ref={ref}
			style={{
				position: "absolute",
			}}
		>
			<div
				style={{
					position: "absolute",
					background: "#292B3D80",
					borderRadius: 12,
					width: props.w,
					height: props.h,
					padding: 6,
				}}
			>
				<div
					style={{
						background: "#292B3D",
						borderRadius: 12,
						width: props.w,
						height: props.h,
						padding: 16,
						boxSizing: "border-box",
						paddingTop: 42,
					}}
				>
					<div
						style={{
							position: "absolute",
							top: 19,
							left: 22,
							width: "100%",
							display: "flex",
						}}
					>
						<Text size={10} color="#FFFFFF99">
							{props.header.toUpperCase() }
						</Text>
					</div>
					{props.children}
				</div>
			</div>
		</div>
	);
};

interface KeyProps {
	label: string;
	w?: number;
}

export const Key = (props: KeyProps) => {
	const w = props.w || 1;
	return (
		<div
			style={{
				background: "#CB325A",
				overflow: "hidden",
				width: 14 * w,
				height: 14,
				borderRadius: 2,
				display: "inline-flex",
				justifyContent: "center",
				alignItems: "center",
				margin: "0 2px",
				padding: 2,
			}}
		>
			<Text size="12px">{props.label}</Text>
		</div>
	);
};
