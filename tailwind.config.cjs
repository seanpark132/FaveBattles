/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			spacing: {
				22: "5.5rem",
				30: "7.5rem",
				31: "7.75rem",
				39: "9.75rem",
				110: "27.5rem",
				"45%": "45%",
				"46%": "46%",
				"47%": "47%",
				"vh-nav": "calc(100vh - 2.75rem)",
			},
			screens: {
				xxl: { raw: "(min-width: 1440px)" },
			},
			colors: {
				"input-gray": "#535353",
				"focus-teal": "#99f6e4",
				"dark-mode-text": "#f0f0f0",
			},
		},
	},
	plugins: [],
};
