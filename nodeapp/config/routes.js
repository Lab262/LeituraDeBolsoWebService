
exports.setupRoutesAndVersions = function(app) {
  var ROUTES = {
  'Readings':'/readings',
  'Users':'/users',
  'User-Readings':'/user-readings',
  'Authentications':'/authentications'};

  var VERSIONS = {'Pre-Production': '/v0'};

  for (var versionIndex in VERSIONS) {
    for (var currentRouteIndex in ROUTES) {
      app.use('/api' + VERSIONS[versionIndex], require('../routes' + VERSIONS[versionIndex] + ROUTES[currentRouteIndex]));
    }
  }
};
//Router setup
