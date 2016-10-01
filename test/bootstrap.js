var loopback = require('loopback');

var boot = require('loopback-boot');
var path = require('path');
var chalk = require('chalk');
process.argv.push('-u');
var server = require('../server/server.js');

var app = server.app;


describe(chalk.blue('Application should start'),function(){
    this.timeout(20000);
    before("Wait application to start",function(done){
        app.on('started',function(){
            done();
        })
        
    });

    it('Wait for bootscript to component',function(done){
      done();
    })


})

