const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: {
    main: path.join(__dirname, "../src/index.js"),
  },
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "[name]_[chunkhash:8].js",
  },
  resolve: {
    extensions: [".wasm", ".mjs", ".js", ".json", ".jsx"],
    alias: {
      React: path.join(__dirname, "../node_modules/react/index.js"),
      ReactDOM: path.join(__dirname, "../node_modules/react-dom/index.js"),
    },
  },
  module: {
    // ? jquery doesn't need parse
    noParse: /node_modules\/(jquery\.js)/,
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          "thread-loader",
          {
            loader: "babel-loader",
            options: {
              presets: [
                require.resolve("@babel/preset-react"),
                [
                  require.resolve("@babel/preset-env"),
                  {
                    corejs: 3,
                    modules: false,
                    useBuiltIns: "usage",
                  },
                ],
              ],
              plugins: [
                [
                  "@babel/plugin-transform-runtime",
                  {
                    corejs: false,
                    helpers: true,
                    regenerator: false,
                    useESModules: true,
                  },
                ],
              ],
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name]_[hash:8].[ext]",
            },
          },
        ],
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name]_[hash:8].[ext]",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebPackPlugin({
      template: "public/index.html",
      filename: "index.html",
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        extractComments: false,
      }),
    ],
  },
};
