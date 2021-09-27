const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    react: ["react", "react-dom"],
  },
  output: {
    path: path.join(__dirname, "./dll"),
    filename: "[name].dll.js",
    library: "react_dll",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      path: path.join(__dirname, "./dll/manifest.json"),
      context: __dirname,
      name: "react_dll",
    }),
  ],
};
