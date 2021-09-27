# webpack-create-react-app
I used Create-React-App a lot, until one day I am wondering why I can't make a similar one that fits me. `webpack` as the most popular bundler, it not only helps me to understand more about 'create-react-app', but also helps me to do more like responsvie website design.

## webpack enviornment
By using 'webpack-merge`, I devided the webpack.config file to 4 parts: 
```
webpack.config.base.js
webpack.config.dev.js
webpack.config.prod.js
webpack.config.dll.js
```
And use `cross-env`, the change the `package.json`
```
"scripts": {
    "start": "cross-env NODE_ENV=development webpack-dev-server --config build/webpack.config.dev.js --open",
    "build": "cross-env NODE_ENV=production webpack --config build/webpack.config.prod.js",
    "dll": "cross-env NODE_ENV=production webpack --config build/webpack.config.dll.js"
  },
```

## Babel
`@babel/polyfill` and `@babel/runtime` can `polyfill` code depends on different browsers, but they are not smart enough, so I config `useBuildIn` in `@babel/preset-env` to achieve polyfill which is easier and simplier.  
I realised `Babel` will insect some `helpers` when comliping codes, and these `helpers` are duplicate in mutiple files. `@babel/plugin-transfrom-runtime` can extract these `helpers`.
The following code shows how I config `Babel`.
```
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
```
## CSS & Responsive Design
Depends on `mode`, css file will be parsed in different loader. I am big fan of `sass` so I only parse `scss`. Under `production` enviornment, css file will be extract as a single file that `mini-css-extract-plugin` will help. And `css-minimizer-webpack-plugin` to compress the code.  
In addition, I used `px2rem-loader` that will transform `px` to `rem`. In my config, I set `1 rem = 75px`. After that, I used `lib-flexible npm` to calculate the screen size and `font-size` that allows the website to adjust rem accordingly.

```
mode: "production',
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
        ]
       }
    ],
},
plugins: [
    new MiniCssExtractPlugin({
      filename: "[name]_[contenthash:8].css",
    }),
],
optimization: {
    minimizer: [new CssMinimizerPlugin()],
}
```
```
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
```
## 
