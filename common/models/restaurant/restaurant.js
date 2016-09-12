var loopback = require('loopback');

module.exports = function Restaurant(Restaurant) {
    Restaurant.validatesLengthOf('phoneNumber', { min: 10, message: { min: 'Restaurant Phone Number is too short' } });
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    Restaurant.validatesFormatOf('emailId', { with: re, message: ('Must provide a valid email') });
}