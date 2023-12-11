/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {},
	},
	plugins: [require("daisyui")],
	daisyui: {
		themes: [
		  {
			myTheme: {
			  "primary": "#79a1f6",
			  "secondary": "#760085",
			  "accent": "#f015a3",
			  "neutral": "#041948",
			  "base-100": "#1E1E1E",
			},
		  },
		],
	  },
}
