import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layout/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'hover:shadow-md',
    'hover:shadow-lg',
    'hover:shadow-xl',
    {
      pattern: /bg-(blue|red|green|orange|violet)-(50|100|200|300|400|500|600)/, // Các lớp động cần giữ
    },
    {
      pattern: /text-(blue|red|green|orange|violet)-(50|100|200|300|400|500|600)/,
    },
    {
      pattern: /shadow-(blue|red|green|orange|violet)-(100|200|300|400|500|600)/,
      variants: ['hover'],

    }
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
