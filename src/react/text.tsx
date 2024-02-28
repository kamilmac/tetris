import * as React from "react";

interface TextProps {
	mono?: boolean;
	size?: number;
	color?: string;
	children: React.ReactNode;
}

export const Text = (props: TextProps) => {
	return (
		<span
			style={{
				fontFamily: props.mono ? "monospace, monospace" : '"Lato", sans-serif',
				fontWeight: 400,
				letterSpacing: 1.03,
				lineHeight: 1.65,
				fontSize: props.size || 14,
				fontStyle: "normal",
				color: props.color || "#FFFFFF",
			}}
		>
			{props.children}
		</span>
	);
};
