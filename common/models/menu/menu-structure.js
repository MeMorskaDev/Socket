var loopback = require('loopback');
module.exports = function MenuStructure(MenuStructure) {
    MenuStructure.observe('before save', function (ctx, next) {
        var inputMenuStructure = ctx.data || ctx.instance;
        if (inputMenuStructure.__data.parentId != 'null') {
            var MenuStructure = loopback.getModel('MenuStructure');
            MenuStructure.findById(inputMenuStructure.__data.parentId, function (err, menuStructure) {
                if (err) {
                    console.log("Error in creating MenuStructure" + err);
                    return next(err);
                } else {
                    if (menuStructure) {
                        MenuStructure.find({ where: { 'parentId': inputMenuStructure.__data.parentId } }, function (err, subMenus) {
                            subMenus.forEach(function (subMenu) {
                                //console.log("Sub Catagoery " + subMenu.categoryName + " " + inputMenuStructure.__data.parentId);
                                if (subMenu.categoryName === inputMenuStructure.__data.categoryName) {
                                    //console.log("Error here");
                                    next(new Error('Error in creating MenuStructure as Sub Menu Exists'));
                                }
                            });
                            console.log("MenuStructure verified");
                            next();
                        });

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