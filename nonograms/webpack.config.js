const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

// const devServer = (isDev) => !isDev ? {} : {
//   devServer: {
//     open: true,
//     port: 8080,
//   },
// };

module.exports = ({ development }) => ({
  mode: development ? 'development' : 'production',
  devtool: development ? 'evil' : false,
  // watch: !development,

  entry: [path.resolve(__dirname, './src/js/index.js'), path.resolve(__dirname, './src/sass/style.scss')],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader',
        ],
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Nonograms',
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
    new ESLintPlugin(),
  ],
  // ...devServer(development)
});
