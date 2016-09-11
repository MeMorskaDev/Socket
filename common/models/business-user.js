var loopback = require('loopback');

module.exports = function BusinessUser(BusinessUser) {
    BusinessUser.validatesLengthOf('mobileNo', { min: 10, message: { min: 'Phone No is too short' } });
}