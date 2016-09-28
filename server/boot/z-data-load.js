var meta = require('../../data/meta');
var async = require('async');
var path = require('path');
var loopback = require('loopback');
var upload = ["-u", "-U", "-upload", "-Upload"];
var _ = require('lodash');
module.exports = function uploadData(app, next) {
    console.log('process.argv ',process.argv);
    if (upload.indexOf(process.argv[2]) !== -1) {
        async.eachSeries(meta, function (entry, callback) {

            var data = require(path.join("../../", "data", entry.path));
            var model = loopback.findModel(entry.model);
            model.create(data, function (err, data) {
                if (err) {
                    
                    err = _.filter(err, function (er) {
                        return er.code !== 11000 && er.statusCode !== 422;
                    })
                    if (err.length > 0) {
                        console.log('err ', err);
                        callback(err);
                    } else {
                        callback();
                    }

                } else {
                    callback();
                }
            })
        }, function (err) {
            if (err) {
                console.log('Error in uploading data');
                return next(err);
            } else {
                console.log('Data Upload Successful');
                next();
            }
        })
    }else{
        next();
    }


}