module.exports = {
  staticFileGlobs: [
    '_site/assets/**.css',
    '_site/**.html',
    '_site/**/**.html',
    '_site/assets/images/**.*',
    '_site/assets/**.js',
  ],
  stripPrefix: '_site/',
  runtimeCaching: [
    {
      urlPattern: '/',
      handler: 'networkFirst',
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com/,
      handler: 'cacheFirst',
      options: {
        cache: {
          name: 'google-fonts-webfonts',
          maxAgeSeconds: 60 * 60 * 24 * 365,
          maxEntries: 10,
        },
      },
    },
  ],
  root: '_site',
};
