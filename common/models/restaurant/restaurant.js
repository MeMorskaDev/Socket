module.exports = function Restaurant(Restaurant) {
    Restaurant.observe('after save', function afterSaveOfRestaurant(ctx, next) {
        var restaurant = ctx.data || ctx.instance;
        console.log('After save of Restaurant ');
        next();
        /*if(ctx.isNewInstance){
            restaurant.businessUsers.create({
                mobileNo :"1234567890",
                email: "saswa@cc.com",
                password:"banda"
            },function(err,user){
                if(err){
                    return next(err)
                }else{
                    next();
                }
            })
        }else{
            next();
        }*/
    })
}