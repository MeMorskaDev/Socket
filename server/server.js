var loopback = require('loopback');
var boot = require('loopback-boot');
var vertebrae = require('vertebrae');
var path = require('path');
var options = vertebrae.options;
var app = loopback();
var bodyParser = require('body-parser');

module.exports={
  app :app,
  vertebrae :vertebrae,
  options :options
}

app.locals.apphome = __dirname;

// configure view handler
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client/views'));

app.use(bodyParser.urlencoded({extended: true}));

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.

options.bootDirs.push(path.join(__dirname,'boot'));
options.clientAppRootDir = __dirname;
vertebrae.boot(app, options , function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  //if (require.main === module)
    app.start();
});
