const { merge } = require("webpack-merge");
const baseWebpackConfig = require("./webpack.config.base");
const webpack = require("webpack");
const path = require("path");

const webpackConfig = merge(baseWebpackConfig, {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
          {
            loader: "px2rem-loader",
            options: {
              remUnit: 75,
              remPrecision: 8,
            },
          },
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    static: {
      directory: path.join(__dirname, "../dist"),
    },
    hot: true,
    compress: true,
    port: 3000,
  },
});

module.exports = webpackConfig;
