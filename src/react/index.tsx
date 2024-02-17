
import * as React from "react";
import { createRoot } from 'react-dom/client';
import { Bridge } from "../utils/bridge";

const App = () => {
	return (
		<>
			<SvgLineLeft />
			<LegendBoxLeft>
				<Text>Use <Key label="←" /><Key label="↑" /><Key label="→" /><Key label="↓" /> keys to move block and <Key label="r" /> to rotate.<br/> Hit <Key label="space" /> to drop it.</Text>
			</LegendBoxLeft>
			<SvgLineRight />
			<LegendBoxRight>
				<Text>Press <Key label="shift" /> + <Key label="←" /> or <Key label="shift" /> + <Key label="→" /> to rotate camera around the stage.</Text>
			</LegendBoxRight>
			<Action />
			<Score />
		</>
	);
}

createRoot(document.getElementById("react-root") as HTMLElement).render(
	<App />,
);

interface KeyProps {
	type?: 'default' | 'space' | 'shift';
	label: string;
}

const Key = (props: KeyProps) => {
	return (
		<div
			style={{
				background: '#CB325A',
				overflow: 'hidden',
				width: 14 * props.label.length,
				height: 14,
				borderRadius: 2,
				display: 'inline-flex',
				justifyContent: 'center',
				alignItems: 'center',
				margin: '0 2px',
				padding: 2,
			}}
		>
			<Text tiny>{props.label}</Text>
		</div>
	);
}

interface LegendBoxProps {
	dots: number;
}

const LBStyles = {
	outsideContainer: {
		position: 'absolute',
		background: '#292B3D80',
		borderRadius: 12,
		width: 210,
		height: 140,
		padding: 6,
	},
	insideContainer: {
		background: '#292B3D',
		borderRadius: 12,
		width: 210,
		height: 140,
		padding: 8,
		boxSizing: 'border-box',
		paddingTop: 24,
	},
};

const SvgLineLeft = (props) => {
	const divRef = React.useRef(null);
	const cr2Ref = React.useRef(null);
	const frameId = React.useRef(null);

  const animate = () => {
    if (divRef.current && cr2Ref.current) {
      divRef.current.setAttribute('x1', Bridge.get('legend_lx') + 222 );
      divRef.current.setAttribute('y1', Bridge.get('legend_ly') + 76 );
      divRef.current.setAttribute('x2', Bridge.get('active_box_x'));
      divRef.current.setAttribute('y2', Bridge.get('active_box_y'));
			cr2Ref.current.setAttribute('cx', Bridge.get('active_box_x'));
      cr2Ref.current.setAttribute('cy', Bridge.get('active_box_y'));
    }
    frameId.current = requestAnimationFrame(animate);
  };

 	React.useEffect(() => {
    frameId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId.current);
  }, []);

	return (
		<svg 
			style={{ position: 'absolute', pointerEvents: 'none' }}
			width="100vw" height="100vh"
		>
		  <line ref={divRef} x1="0" y1="0" x2="0" y2="0" stroke="#F16883" strokeWidth="2" strokeDasharray="5, 5" >
				<animate
					attributeName="stroke-dashoffset"
					values="100;0"
					dur="3s"
					calcMode="linear"
					repeatCount="indefinite"
				/>
			</line>
		  <circle ref={cr2Ref} cx="0" cy="0" r="12" fill="#F16883" />
		</svg>
	);

}

const SvgLineRight = (props) => {
	const divRef = React.useRef(null);
	const cr2Ref = React.useRef(null);
	const frameId = React.useRef(null);

  const animate = () => {
    if (divRef.current && cr2Ref.current) {
      divRef.current.setAttribute('x1', Bridge.get('legend_rx') );
      divRef.current.setAttribute('y1', Bridge.get('legend_ry') + 76 );
      divRef.current.setAttribute('x2', Bridge.get('stage_x'));
      divRef.current.setAttribute('y2', Bridge.get('stage_y'));
			cr2Ref.current.setAttribute('cx', Bridge.get('stage_x'));
      cr2Ref.current.setAttribute('cy', Bridge.get('stage_y'));
    }
    frameId.current = requestAnimationFrame(animate);
  };

 	React.useEffect(() => {
    frameId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId.current);
  }, []);

	return (
		<svg 
			style={{ position: 'absolute', pointerEvents: 'none' }}
			width="100vw" height="100vh"
		>
		  <line ref={divRef} x1="0" y1="0" x2="0" y2="0" stroke="#F16883" strokeWidth="2" strokeDasharray="5, 5" >
				<animate
					attributeName="stroke-dashoffset"
					values="100;0"
					dur="3s"
					calcMode="linear"
					repeatCount="indefinite"
				/>
			</line>
		  <circle ref={cr2Ref} cx="0" cy="0" r="12" fill="#F16883" />
		</svg>
	);
}

const LegendBoxLeft = (props) => {
	const ref = React.useRef(null);
	const frameId = React.useRef(null);

  const animate = () => {
    if (ref.current) {
    	const n = performance.now() / 1600;
			const cx = window.innerWidth * 0.5;
			const cy = window.innerHeight * 0.5;
    	const tx = Math.cos(n)*15 + cx * 0.25;
    	const ty = Math.sin(n)*15 + cy * 0.25;
    	ref.current.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    	Bridge.set('legend_lx', tx);
    	Bridge.set('legend_ly', ty);
    }
    frameId.current = requestAnimationFrame(animate);
  };

 	React.useEffect(() => {
    frameId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId.current);
  }, []);

	return (
		<div
			ref={ref}
			style={{
				position: 'absolute',
			}}
		>
			<div style={LBStyles.outsideContainer}>
				<div
					style={LBStyles.insideContainer}	
				> { props.children } </div>
			</div>
		</div>
	);
}

const LegendBoxRight = (props) => {
	const ref = React.useRef(null);
	const frameId = React.useRef(null);

  const animate = () => {
    if (ref.current) {
    	const n = performance.now() / 1600;
    	const cx = window.innerWidth * 0.5;
			const cy = window.innerHeight * 0.5;
    	const tx = Math.sin(n)*15 + cx * 1.5;
    	const ty = Math.cos(n)*15 + cy * 0.8;
    	ref.current.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    	Bridge.set('legend_rx', tx);
    	Bridge.set('legend_ry', ty);
    }
    frameId.current = requestAnimationFrame(animate);
  };

 	React.useEffect(() => {
    frameId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId.current);
  }, []);

	return (
		<div
			ref={ref}
			style={{
				position: 'absolute',
			}}
		>
			<div style={LBStyles.outsideContainer}>
				<div
					style={LBStyles.insideContainer}	
				> { props.children } </div>
			</div>
		</div>
	);
}

const Text = (props) => {
	return <span
		style={{
			fontFamily: props.mono ? 'monospace, monospace' : '"Lato", sans-serif',
		  fontWeight: 400,
		  letterSpacing: 1.03,
		  lineHeight: 1.65,
		  fontSize: props.size || 14,
		  fontStyle: 'normal',
		  color: props.color || '#FFFFFF',
		}}
	>{props.children}</span>
}

const Action = () => {
	return (
		<div
			style={{
				position: 'absolute',
				bottom: 40,
				left: window.innerWidth * 0.5 - 130,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				width: 260,
				overflow: 'hidden',
				gap: 20,
			}}
		>
			<div
				style={{
					width: 52,
					height: 52,
					borderRadius: '50%',
					background: '#CB325A',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<RunningMen />
			</div>
			<div>
				<Text color="#F16883">[ </Text>
				<Text color="#FFFFFFCC">Press <b>ENTER</b> to take control.</Text>
				<Text color="#F16883"> ]</Text>
			</div>
		</div>
	)
}

const Score = () => {
	return (
		<div
			style={{
				position: 'absolute',
				top: 32,
				right: 32,
				height: 60,
				display: 'flex',
				gap: 12,
				overflow: 'hidden',
			}}
		>
			<Text size="18px" mono>____</Text>
			<Fire />
			<Text size="18px" mono>_136</Text>
			<div
				style={{
					position: 'absolute',
					right: 0,
					bottom: 20,
				}}
			>
				<Text size="7px" color="#FFFFFFDD">BEST SCORE</Text>
			</div>
		</div>
	);
}

const RunningMen = () => {
	return (
		<svg width="23" height="30" viewBox="0 0 23 30" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M14.9867 5.535C16.4533 5.535 17.6533 4.2975 17.6533 2.785C17.6533 1.2725 16.4533 0.0350037 14.9867 0.0350037C13.52 0.0350037 12.32 1.2725 12.32 2.785C12.32 4.2975 13.52 5.535 14.9867 5.535ZM10.1867 24.6475L11.52 18.5975L14.32 21.3475V29.5975H16.9867V19.285L14.1867 16.535L14.9867 12.41C16.72 14.4725 19.3867 15.8475 22.32 15.8475V13.0975C19.7867 13.0975 17.6533 11.7225 16.5867 9.7975L15.2533 7.5975C14.72 6.7725 13.92 6.2225 12.9867 6.2225C12.5867 6.2225 12.32 6.36 11.92 6.36L4.98667 9.385V15.8475H7.65333V11.1725L10.0533 10.21L7.92 21.3475L1.38667 19.9725L0.853333 22.7225L10.1867 24.6475Z" fill="white"/>
		</svg>
	);
}

const Fire = () => {
	return (
		<svg width="28" height="28" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M11.8801 21.1467C15.6955 21.1467 18.8299 18.1231 18.8299 14.2423C18.8299 13.2895 18.7815 12.2682 18.2534 10.6809C17.7253 9.09364 17.6189 8.88875 17.0605 7.90849C16.822 9.90891 15.5455 10.7426 15.2212 10.9918C15.2212 10.7326 14.449 7.86587 13.2783 6.15063C12.1289 4.46695 10.5659 3.36235 9.64936 2.61365C9.64936 4.03595 9.24932 6.15063 8.67642 7.2281C8.10351 8.30557 7.99593 8.34481 7.28032 9.14664C6.56476 9.94847 6.23631 10.1961 5.63792 11.169C5.03956 12.142 4.93024 13.4378 4.93024 14.3905C4.93024 18.2714 8.06478 21.1467 11.8801 21.1467Z" fill="#D97205" stroke="#C81B51" stroke-width="2" stroke-linejoin="round"/>
		</svg>
	);
}
