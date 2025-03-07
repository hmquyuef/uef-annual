/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {}, // Sử dụng Tailwind CSS với PostCSS
    autoprefixer: {},
  },
};

export default config;
