/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			colors: {
				"royal-blue": {
					50: "#edf1ff",
					100: "#dfe4ff",
					200: "#c5cdff",
					300: "#a1abff",
					400: "#7c80fd",
					500: "#5f58f7",
					600: "#543fec",
					700: "#4832d0",
					800: "#3b2ba8",
					900: "#342a85",
					950: "#1f194d",
				},
				"casablanca": {
					50: "#fff8eb",
					100: "#fdebc8",
					200: "#fcd58b",
					300: "#fab440",
					400: "#f9a026",
					500: "#f37c0d",
					600: "#d75a08",
					700: "#b23b0b",
					800: "#912e0f",
					900: "#772610",
					950: "#441104",
				},
			},
		},
	},
	plugins: [],
}
