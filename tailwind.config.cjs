/** @type {import('tailwindcss').Config} */

let plugin = require('tailwindcss/plugin');

module.exports = {
	prefix: "ts-",
  content: ['./**/*.liquid', './frontend/**/*.{js,ts,jsx,tsx}'],
  safelist: [],
  theme: {
		extend: {
			fontFamily: {
				heading_font: ["Space-Grotesk", "serif"],
				body_font: ["Space-Grotesk", "sans-serif"],
				custom_font: ["Agrandir-Grand", "sans-serif"],
			},
			fontSize: {
				clamp_xxl: "clamp(3rem, 8vw, 6.5rem)",
				clamp_xl: "clamp(2.8rem, 5vw, 6rem)",
        clamp_l: "clamp(2.5rem, 4vw, 4.5rem)",
        size_lg: "2rem",
        size_md: "1.5rem",
        size_sm: "1.3rem",
        size_xs: "1.2rem",
			},
			width: {
				clamp_xl: "clamp(3.5rem, 4vw, 7.5rem)"
			},
			height: {
				clamp_xl: "clamp(3.5rem, 4vw, 7.5rem)"
			}
		},
		colors: {
			white: "#FFFFFF",
			black: "#000000",
			transparent: 'transparent',
			gray: '#D9D9D9',
			gray1: '#999999',
			accent: '#EF4949',
		},
		screens: {
			'xs': '0',
			'sm': '576px',
			'sm-mobile': {
				'max': '767px'
			},
			'mobile': {
				'max': '991px'
			},
			'md': '768px',
			'lg': '992px',
			'xl': '1200px',
			'xxl': '1441px',
		}
	},
	plugins: [
		function ({ addVariant }) {
      addVariant('is-active', '&.is-active');
    },
	],
};