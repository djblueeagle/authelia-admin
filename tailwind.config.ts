import { fontFamily } from 'tailwindcss/defaultTheme';
import type { Config } from 'tailwindcss';

const config: Config = {
	darkMode: ['class'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['light'],
	plugins: [
		require('@tailwindcss/typography')
	],

	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '0.5rem', // Default padding for all screens
				sm: '0.5rem' // Padding for lg and larger screens
			},
			screens: {
				// https://v3.tailwindcss.com/docs/container
				xs: '390px', // the smallest screen size, don't try to go smaller, limited by markdown component
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1280px',
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				primary: {
					DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
					foreground: 'hsl(var(--primary-foreground) / <alpha-value>)'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
					foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
					foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
				},
				oat: {
					50: 'white',
					100: '#f9f8f6',
					200: '#f3f2ed',
					300: '#eee9df',
					400: '#dad4c8',
					500: 'white',
					600: '#9f9b93',
					700: '#85817a',
					800: '#55534e',
					900: '#363430',
					950: '#1b1a18'
				},
				blueberry: {
					300: '#83c4ff',
					200: '#bee0ff',
					700: '#0053b5',
					900: '#002f67',
					400: '#4ca8fd',
					600: '#0667d9',
					100: '#d7ebfe',
					500: '#0382f7',
					800: '#01418d',
					950: '#001e4b',
					50: '#ecf6ff'
				},
				lemon: {
					100: '#fff8d2',
					200: '#fef0a4',
					300: '#fadf7c',
					400: '#f8cc65',
					500: '#fbbd41',
					600: '#fdad15',
					700: '#d08a11',
					800: '#9d6a09',
					900: '#7f500a'
				},
				dragonfruit: {
					100: '#ffe5f7',
					200: '#ffd1f1',
					400: '#ff99df',
					500: '#ff7ad5',
					600: '#ff52c2',
					700: '#f90ba6',
					900: '#8b045c'
				},
				matcha: {
					100: '#dbffe0',
					200: '#bcf4ca',
					300: '#84e7a5',
					400: '#3ece82',
					500: '#0dac65',
					600: '#078a52',
					700: '#02693e',
					900: '#03331d'
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				large: '32px'
			},
			fontFamily: {
				sans: [...fontFamily.sans],
				serif: ['Source Serif Pro', 'source-serif', ...fontFamily.serif]
			}
		}
	}
};

export default config;
