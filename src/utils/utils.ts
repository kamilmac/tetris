export const isTweakPaneActive = () => {
	return window.location.search === "?tp";
};

export const isTestMode = () => window.location.search === "?testmode";

export const isRunningInProduction = () => window.location.hostname.includes('tetris.zweibel-cocaine.com');

