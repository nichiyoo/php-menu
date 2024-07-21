/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	content: ['./**/*.{html,js}'],
	theme: {
		extend: {
			fontFamily: {
				display: ['var(--font-display)', ...defaultTheme.fontFamily.serif],
				body: ['var(--font-body)', ...defaultTheme.fontFamily.sans],
			},
			colors: {
				primary: '#00529a',
			},
			aspectRatio: {
				thumbnail: '4 / 3',
			},
		},
	},
	plugins: [require('@tailwindcss/forms')],
};
