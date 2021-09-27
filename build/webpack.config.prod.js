const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { merge } = require("webpack-merge");
const baseWebpackConfig = require("./webpack.config.base");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const webpack = require("webpack");

const webpackConfig = merge(baseWebpackConfig, {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
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
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name]_[contenthash:8].css",
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require("./dll/manifest.json"),
    }),
    // new BundleAnalyzerPlugin(),
  ],
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        button: {
          test: /[\\/]Button[\\/]/,
          name: "button",
          chunks: "all",
          priority: 1,
        },
      },
    },
  },
});

module.exports = webpackConfig;
