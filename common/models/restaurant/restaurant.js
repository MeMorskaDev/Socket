var loopback = require('loopback');
var async = require('async');

module.exports = function Restaurant(Restaurant) {
    Restaurant.validatesLengthOf('phoneNumber', { min: 10, message: { min: 'Restaurant Phone Number is too short' } });
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    Restaurant.validatesFormatOf('emailId', { with: re, message: ('Must provide a valid email') });

    Restaurant.observe('access', function logQuery(ctx, next) {
        console.log('Accessing %s matching %s', ctx.Model.modelName, ctx.query.where);
        next();
    });
    Restaurant.observe('after save', function (ctx, next) {
        var restaurant = ctx.data || ctx.instance;

        var BusinessUserModel = loopback.getModel('BusinessUser');
        var RestaurantUserModel = loopback.getModel('RestaurantUser');
        if (ctx.instance) {
            console.log('Saved %s#%s', ctx.Model.modelName, ctx.instance.id);
        }
        var createdById = ctx.options.ctx.userId;
        BusinessUserModel.findById(createdById, function (err, businessUser) {
            restaurant.restaurantUser.create({
                "phoneNumber": businessUser.mobileNo,
                "password": businessUser.password,
                "email": businessUser.email
            }, function (err, restaurant) {
                if (err)
                    console.log(err);
                else {
                    var BaseRoleMapping = loopback.getModel('BaseRoleMapping');

                    async.parallel({
                        one: function (callback) {
                            BaseRoleMapping.create({
                                "principalType": "USER",
                                "principalId": restaurant.restaurantUserId,
                                "_type": "BaseRoleMapping",
                                "roleId": "rsaRoleId"
                            }, function (err, baseRole) {
                                if (err) {
                                    console.log("Error in creating role mapping rsaRoleId for the business user " + err);
                                    return callback(err);
                                } else {
                                    console.log("Base Role Mapping successfully created for restaurant user phone no" + restaurant.phoneNumber);
                                    callback();
                                }
                            });
                            //callback(null, 'abc\n');
                        },
                        two: function (callback) {
                            BaseRoleMapping.create({
                                "principalType": "USER",
                                "principalId": restaurant.restaurantUserId,
                                "_type": "BaseRoleMapping",
                                "roleId": "managerRoleId"
                            }, function (err, baseRole) {
                                if (err) {
                                    console.log("Error in creating role mapping managerRoleId for the business user " + err);
                                    return callback(err);
                                } else {
                                    console.log("Base Role Mapping successfully created for restaurant user phone no" + restaurant.phoneNumber);
                                    callback();
                                }
                            });
                            //callback(null, 'xyz\n');
                        }
                    }, function (err, results) {
                        if (err) {
                            throw err;
                        }
                        console.log("Base Role Mapping successfully created for restaurant user phone no");
                        next();
                    });
                }
            });
        });
    });
}