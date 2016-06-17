
/* eslint-disable global-require */
module.exports = {
  server: require('./dist/server').default,
  build: require('./dist/build').default,
  version: require('./dist/version').default,
  publish: require('./dist/publish').default,
};
