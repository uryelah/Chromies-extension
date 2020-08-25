const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  entry: {
    'main': './src/index.js',
    'content': './src/content.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  devServer: {
    contentBase: './dist',
  },
};