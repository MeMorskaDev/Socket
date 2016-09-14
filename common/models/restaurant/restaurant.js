var loopback = require('loopback');

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
            restaurant.restaurantUser.create({ "phoneNumber": businessUser.mobileNo, "password": businessUser.password, "email": businessUser.email }, function (err) {
                if (err)
                    console.log(err);
                else
                    next();
            });
        });
    });
}