export const isTweakPaneActive = () => {
	return window.location.search === "?tp";
};

export const isTestMode = () => window.location.search === "?testmode";
