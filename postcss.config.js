module.exports = {
  plugins: [
    require("postcss-import"),
    require("tailwindcss")('./tailwind.config.js'),
    require("autoprefixer"),
    require("postcss-nested"),
    ...(process.env.NODE_ENV == "production" ? [require("cssnano")({ preset: "default" })] : []),
  ],
};
