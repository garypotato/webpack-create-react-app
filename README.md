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

## basic loaders
### babel
`babel` allows me 
