const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// Check if we're building for GitHub Pages or production
const isProduction = process.env.NODE_ENV === "production";
const isGitHubPages = process.env.GITHUB_PAGES === "true" || isProduction;

module.exports = {
  entry: "./src/index.tsx",
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    // Set public path for GitHub Pages (repository name)
    publicPath: "/DigestiTrack/",
  },
  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 3000,
    // Enable history API fallback for SPA routing
    historyApiFallback: true,
  },
};
