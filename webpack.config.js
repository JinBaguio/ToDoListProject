const path = require('path');
const slsw = require('serverless-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: slsw.lib.entries,
  devtool: 'source-map',
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.json',
      '.ts',
      '.tsx'
    ]
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },  
  target: 'node',
  plugins: [
    new CopyWebpackPlugin([
        { from: './config/config.json', to: './' }
    ],
        { 'copyUnmodified': true }
    )
  ],
  module: {
    loaders: [
      { test: /\.json$/, loader: "json-loader"},
      { test: /\.ts(x?)$/, loader: 'ts-loader', options: { transpileOnly: true }},
      { test: /\.pem$/, loader: 'raw-loader'}
        ],
    },
    externals: ["aws-sdk"]
};
