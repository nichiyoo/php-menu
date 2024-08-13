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
				primary: 'rgb(var(--color-primary) / <alpha-value>)',
				secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
			},
			aspectRatio: {
				thumbnail: '4 / 3',
			},
		},
	},
	plugins: [require('@tailwindcss/forms')],
};
