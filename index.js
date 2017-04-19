var _ = require('lodash');
var app = require('./app');
var http = require('http');
var https = require('https');
var fs = require('fs');
var exports = module.exports = {};
var tcpPortUsed = require('tcp-port-used');
var colors = require('colors/safe');

exports.startServer = function (options) {
	var defaultOptions = {
		styleguidePath: 'styleguide',
        https: false
	};

	options = _.assign(defaultOptions, options);

	var config = JSON.parse(fs.readFileSync('./' + options.styleguidePath + '/config.txt', 'utf8'));
	var serverInstance;

    app.set('styleguideConfig', config);
    app.set('port', config.serverPort);

    if(options.https) {
        var sslOptions = {
            key:  fs.readFileSync('tools/ssl/key.pem'),
            cert: fs.readFileSync('tools/ssl/cert.pem')
        };
        serverInstance = https.createServer(sslOptions, app);
    } else {
        serverInstance = http.createServer(app);
    }

    serverInstance.listen(config.serverPort, function () {
        console.log(colors.green('Styleguide server listening on port ' + config.serverPort));
    }).on('error', function (error) {
        if (error.code === 'EADDRINUSE') {
            console.error(colors.red('Something went wrong and server could not start'));
        }
    });
    return serverInstance;
};
