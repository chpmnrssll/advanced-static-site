/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
  entry: {
    app: './_src/index.js',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          enforce: true,
        },
      },
      // concatenateModules: false,
      chunks: 'all',
      minChunks: 1,
      minSize: 0,
      name: true,
    },
  },
  plugins: [
    new FaviconsWebpackPlugin({
      logo: './original-icon.png',
    }),
    new HtmlWebpackPlugin({
      chunks: ['vendors', 'app'],
      template: './_src/template/default.html',
      filename: '../_layouts/default.html',
    }),
    new MiniCSSExtractPlugin('[name].css'),
    new CopyWebpackPlugin([{
      from: path.resolve('_images'),
      to: 'images/',
    }]),
  ],
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/syntax-dynamic-import'],
          },
        },
      },
      {
        test: /\.(css|scss)$/,
        use: [
          MiniCSSExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: 'config/postcss.config.js',
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader',
        ],
      },
    ],
  },
};
