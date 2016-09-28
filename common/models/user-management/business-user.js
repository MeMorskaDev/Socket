var loopback = require('loopback');
//var log = require('../../common-modules/logger')('business-user');

module.exports = function BusinessUser(BusinessUser) {
    BusinessUser.validatesLengthOf('mobileNo', { is: 10, message: { min: 'Phone No is Incorrect' } });
    BusinessUser.validatesUniquenessOf('mobileNo', { message: 'Phone No already exists' });

    BusinessUser.observe('before save', function (ctx, next) {
        var data = ctx.data || ctx.instance;
        console.log('data ', data);
        if (data.otpVerified)
            delete data[otpVerified];
        if (data.emailVerified)
            delete data[emailVerified];

        next();

    });
    BusinessUser.observe('after save', function (ctx, next) {
        var businessUser = ctx.data || ctx.instance;

        //function createRsaRole(cb) {
        var BaseRoleMapping = loopback.getModel('BaseRoleMapping');
        roleIds = [];
        if (businessUser.roleId) {
            roleIds = businessUser.roleId
        } else {
            roleIds = ["rsaRoleId", "managerRoleId"];
        }
        BaseRoleMapping.create({
            "principalType": "USER",
            "principalId": businessUser.businessUserId,
            "_type": "BaseRoleMapping",
            "roleId": roleIds
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