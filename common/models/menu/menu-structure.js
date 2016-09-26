var loopback = require('loopback');
module.exports = function MenuStructure(MenuStructure) {
    MenuStructure.observe('before save', function (ctx, next) {
        var menuStructure = ctx.data || ctx.instance;
        if (menuStructure.parentId != 'null') {
            var MenuStructure = loopback.getModel('MenuStructure');
            MenuStructure.findById(menuStructure.parentId, function (err, menuStructure) {
                if (err) {
                    console.log("Error in creating MenuStructure" + err);
                    return next(err);
                } else {
                    if (menuStructure) {
                        console.log("MenuStructure verified");
                        next();
                    }
                    else {
                        console.log("Error in creating MenuStructure as parentId does not Exist");
                        next(new Error('Error in creating MenuStructure as parentId does not Exist'));
                    }
                }
            });
        } else {
            next();
        }
    });
}