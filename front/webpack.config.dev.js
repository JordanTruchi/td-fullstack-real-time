const path = require('path'),
      fs = require('fs'),
      VueLoaderPlugin = require('vue-loader/lib/plugin'),
      Dotenv = require('dotenv-webpack'),
      HtmlWebpackPlugin = require('html-webpack-plugin');

const {
  hot,
  host
} = JSON.parse(fs.readFileSync('./security/devserver.json'));

module.exports = {
  mode: 'development',
  entry: './index.js',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  // HMR
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    hot,
    host
  },
  // different loaders to handle js, vue, scss and image files
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  plugins: [
    // plugin for Vuejs
    new VueLoaderPlugin(),
    // plugin for variable environnement
    new Dotenv({
      path: '.dev.env',
      safe: true
    }),
    // plugin for HTML template
    new HtmlWebpackPlugin({
      inject: true,
      template: 'template.html'
    })
  ],
  // add aliases to directory
  resolve: {
    alias: {
      Components: path.resolve(__dirname, 'src/components/'),
      Images: path.resolve(__dirname, 'assets/img/'),
      Services: path.resolve(__dirname, 'src/js/services/'),
      Js: path.resolve(__dirname, 'src/js/'),
    }
  }
};