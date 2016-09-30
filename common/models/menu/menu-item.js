var loopback = require('loopback');
var utils = require('../../Utils/utils');
module.exports = function MenuItem(MenuItem) {
    MenuItem.observe('before save', function (ctx, next) {
        var inputMenuItem = ctx.data || ctx.instance;
        if (inputMenuItem.__data.menuStructureId != null) {
            var MenuStructure = loopback.getModel('MenuStructure');
            var Restaurant = loopback.getModel('Restaurant');
            var MenuItem = loopback.getModel('MenuItem');
            MenuStructure.findById(inputMenuItem.__data.menuStructureId, function (err, menuStructure) {
                if (err) {
                    next(err);
                }
                if (menuStructure === null) {
                    return next(utils.getError('MENU_STRUCTURE_NOT_EXIST'));
                }
                if (inputMenuItem.__data.restaurantId != null) {
                    Restaurant.findById(inputMenuItem.__data.restaurantId, function (err, restaurant) {
                        if (err) {
                            next(err);
                        }
                        if (restaurant === null) {
                            return next(utils.getError('RESTAURANT_NOT_EXIST'));
                        }
                        MenuItem.find({ where: { 'menuStructureId': inputMenuItem.__data.menuStructureId } }, function (err, menuItems) {
                            if (err) {
                                console.log("Error in getting MenuStructure for MenuItems" + err);
                                return next(err);
                            }
                            if (menuItems) {
                                menuItems.forEach(function (menuItem) {
                                    if (menuItem.itemName === inputMenuItem.__data.itemName) {
                                        return next(utils.getError('MENU_ITEM_EXISTS'));
                                    }
                                });
                                next();
                            }
                        });
                    });
                } else {
                    return next(utils.getError('RESTAURANT_NOT_PROVIDED'));
                }
            });
        } else {
            return next(utils.getError('MENU_STRUCTURE_NOT_PROVIDED'));
        }
    });
}