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
## static file
There is no need to mention how important `file-loader` and `url=loader` are. The other thing I wanna address is that the `meta` tap in `html template`, I seperate `meta.html` that stores all the `meta`, then use `raw-loader` to insert them to the `html template`. The reason I am doing that is to make the file constructre easiler to read.
```
//meta.html
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

/// index.html
 <%=require('raw-loader!./meta.html')%>
```
## speed up compilation
### splitChunks
`splitChunks` is very power. I create a common `Button` components that needs to be extracted as a common module
```
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
```
### webpack.DllPlugin()
`React` and `React-dom` has a big size that I don't wannt webpack has to parse them everytime. I used `webpack.DllPlugin()` and `webpack.DllReferencePlugin()` to helps me store these large size but won't change very often in some places. Every compilation, webpack will not parse these library but use them directly
```
// webpack.config.dll.js

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
```
```
//webpack.config.prod.js
 plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require("./dll/manifest.json"),
    }),
  ],
```
### cache
`cache` can increase compilation speed significantly
#### Babel cache
Set up `Babel cache` to increase compilation speed.
```
///webpack.config.base.js
 {
loader: "babel-loader",
options: {
  cacheDirectory: true,
},
},
```
#### TerserPlugin
Compilation can be easily speeded up by `TerserPlugin`. Also I realised that every compliation, it will generate `LICENSE` that I don't need it. It can be stoped by setting `extractComments' to `false`.
```
///webpack.config.base.js
optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        extractComments: false,
      }),
    ],
},
```
