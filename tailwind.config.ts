import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
    "./src/hooks/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Poppins", "sans-serif"]
      },
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca"
        }
      },
      boxShadow: {
        soft: "0 20px 45px rgba(15, 23, 42, 0.08)",
        glow: "0 0 0 1px rgba(99, 102, 241, 0.22), 0 18px 50px rgba(99, 102, 241, 0.18)"
      },
      borderRadius: {
        xl2: "1.25rem"
      },
      backgroundImage: {
        "mesh-light":
          "radial-gradient(circle at top left, rgba(79, 70, 229, 0.14), transparent 35%), radial-gradient(circle at top right, rgba(59, 130, 246, 0.16), transparent 32%), linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)",
        "mesh-dark":
          "radial-gradient(circle at top left, rgba(99, 102, 241, 0.22), transparent 30%), radial-gradient(circle at top right, rgba(56, 189, 248, 0.18), transparent 30%), linear-gradient(180deg, #0f0f0f 0%, #131313 100%)"
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-600px 0" },
          "100%": { backgroundPosition: "600px 0" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        }
      },
      animation: {
        shimmer: "shimmer 1.8s linear infinite",
        float: "float 6s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
