var loopback = require('loopback');
//var log = require('../../common-modules/logger')('business-user');

module.exports = function BusinessUser(BusinessUser) {
    BusinessUser.validatesLengthOf('mobileNo', { min: 10, message: { min: 'Phone No is too short' } });

    BusinessUser.observe('after save', function (ctx, next) {
        var businessUser = ctx.data || ctx.instance;

        //function createRsaRole(cb) {
        var BaseRoleMapping = loopback.getModel('BaseRoleMapping');
        BaseRoleMapping.create({
            "principalType": "USER",
            "principalId": businessUser.businessUserId,
            "_type": "BaseRoleMapping",
            "roleId": "rsaRoleId"

        }, function (err, baseRole) {
            if (err) {
                console.log("Error in creating role mapping for the business user " + err);
                return next(err);
            } else {
                console.log("Base Role Mapping successfully created for business user " + businessUser);
                next();
            }
        });
        //}
    });
}