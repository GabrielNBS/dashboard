const config = {
  plugins: {
    '@tailwindcss/postcss': {},

    // Converte funções modernas de cor (oklch, oklab etc.) para rgb()
    'postcss-preset-env': {
      stage: 1,
      features: {
        'oklab-function': { preserve: false },
        'oklch-function': { preserve: false },
      },
    },
  },
};

export default config;
