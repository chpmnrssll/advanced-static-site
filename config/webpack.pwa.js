/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const Merge = require('webpack-merge');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const ProdConfig = require('./webpack.prod.js');

module.exports = Merge(ProdConfig, {
  plugins: [
    new WebpackPwaManifest({
      name: 'Advanced Static Site',
      short_name: 'Super PWA',
      description: 'Russell Chapmans\' Portfolio',
      orientation: 'portrait',
      display: 'standalone',
      start_url: '/advanced-static-site/', // start_url must match publicPath in webpack.prod.js
      theme_color: '#537895',
      background_color: '#ffffff',
      icons: [
        {
          src: path.resolve('original-icon.png'),
          sizes: [96, 128, 192, 256, 384, 512],
        },
      ],
    }),
  ],
});
