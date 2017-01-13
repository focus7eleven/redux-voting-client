var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
NODE_ENV: JSON.stringify("production")

module.exports = {
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:8081',
    'webpack/hot/only-dev-server',
    './src/index.jsx'
  ],
  debug: true,
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'react-hot!babel'
    }, {
      test: /\.css$/,
      loader: 'style!css!postcss'
    }, {
      test: /\.scss$/,
      loaders: [
        'style',
        'css?modules&importLoaders=1' +
        '&localIdentName=[name]__[local]___[hash:base64:5]!postcss',
        'sass'
      ]
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './dist',
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      }
    }),
  ],
  postcss: function() {
    return [autoprefixer];
  },
  devtool: 'source-map'
};