import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17202a",
        muted: "#62717d",
        line: "#d9e0e6",
        panel: "#ffffff",
        app: "#f5f7f8",
        teal: "#0f766e",
        amber: "#b7791f",
        danger: "#b42318"
      },
      boxShadow: {
        soft: "0 10px 24px rgba(23, 32, 42, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
