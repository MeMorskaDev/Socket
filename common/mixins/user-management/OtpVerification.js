// Twilio Credentials 
var accountSid = 'AC41dcdf4ddcbcf491e3017cb88fe8a057';
var authToken = '890d071b4b9f4a117e3de25c152dea08';

//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken);

var utils = require('../../Utils/utils');
var loopback = require('loopback');


module.exports = function (Model) {

    Model.sendOtp = function sendOtp(userId, options, cb) {

        Model.findById(userId, function (err, user) {
            if (err) {
                return cb(utils.getError('DEFAULT_ERROR',err));
            } else if (user) {
                var Otp = loopback.getModel('OTP');
                var query = {};
                query.businessUserId = userId;
                query.state = 'UNUSED';

                Otp.updateAll(query, { 'state': 'EXPIRED' }, function (err, response) {
                    if (err) {
                        return cb(utils.getError('DEFAULT_ERROR',err));
                    } else {
                        user.otps.create(generateOTP(), function (err, otp) {
                            if (err) {
                                return cb(utils.getError('DEFAULT_ERROR',err));
                            } else {
                                sendOTP(user.mobileNo, otp.pin, function (err, message) {
                                    if (err) {
                                        return cb(err);
                                    } else {
                                        var response = {};
                                        response.businessUserId = user.businessUserId;
                                        response.mobileNo = user.mobileNo;
                                        response.pin = otp.pin;

                                        return cb(null, response);
                                    }
                                });

                            }
                        })
                    }
                })
            } else {
                var err = utils.getError('USER_NOT_FOUND');
                cb(err);
            }
        })



    }


    Model.verifyOtp = function (userId, pin, options, cb) {
        var OTP = loopback.getModel('OTP');
        OTP.findOne({
            where: {
                businessUserId: userId,
                state: 'UNUSED',
                pin: pin
            }
        }, function (err, otp) {
            if (err) {
                 return cb(utils.getError('DEFAULT_ERROR',err));
            } else if (otp) {
                otp.updateAttributes({ 'state': 'USED' },
                    function (err, opt) {
                        if (err) {
                           return cb(utils.getError('DEFAULT_ERROR',err));
                        } else {
                            return cb(null, 'otp verified');
                        }
                    })

            } else {
                var error = utils.getError('OTP_NOT_VERIFIED');
                cb(error);
            }
        })
    }

    Model.remoteMethod(
        'sendOtp',
        {
            description: 'Send OPT to a Mobile Number',
            accepts: [
                { arg: 'userId', type: 'string' }
            ],
            returns: { arg: 'message', type: 'Object' }
        }
    );

    Model.remoteMethod(
        'verifyOtp',
        {
            description: 'Verify Mobile Number',
            accepts: [
                { arg: 'userId', type: 'string' },
                { arg: 'pin', type: 'number' }
            ],
            returns: { arg: 'message', type: 'Object' }
        }
    );
}



function generateOTP() {
    var otp = {};
    otp.pin = Math.floor(1000 + Math.random() * 9000);
    otp.state = 'UNUSED';

    return otp;
}

function sendOTP(mobileNo, pin, cb) {
    console.log('mobileNo ', mobileNo, ' pin  ', pin);
    client.messages.create({
        to: "+91" + mobileNo,
        from: "+18727136600",
        body: pin,
    }, function (err, message) {
        if (err) {
            return cb(err);
        }
        else {
            cb(null, message);
        }

    });
}