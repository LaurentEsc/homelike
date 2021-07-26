const path = require('path');
const nodeBuiltins = require('builtin-modules');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const externals = ['aws-sdk']
  .concat(nodeBuiltins)
  .reduce((externalsMap, moduleName) => {
    externalsMap[moduleName] = moduleName;
    return externalsMap;
  }, {});

const webPackConfig = {
  entry: {
    signUp: './src/functions/signUp/handler.ts',
    signIn: './src/functions/signIn/handler.ts',
    createProperty: './src/functions/createProperty/handler.ts',
    markPropertyAsFavorite: './src/functions/markPropertyAsFavorite/handler.ts',
    searchProperties: './src/functions/searchProperties/handler.ts',
    listMyFavorites: './src/functions/listMyFavorites/handler.ts',
  },
  externals,
  output: {
    path: path.join(__dirname, 'dist/functions'),
    libraryTarget: 'commonjs2',
    filename: '[name]/index.js',
    sourceMapFilename: '[name]/index.js.map',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  optimization: {
    minimize: true,
  },
  target: 'node',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.ts(x?)$/,
        loader: 'ts-loader',
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
      },
    }),
  ],
  devtool: 'source-map',
};

module.exports = webPackConfig;
