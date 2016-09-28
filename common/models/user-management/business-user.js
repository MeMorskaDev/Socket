var loopback = require('loopback');

module.exports = function BusinessUser(BusinessUser) {
    BusinessUser.validatesLengthOf('mobileNo', { is: 10, message: { min: 'Phone No is Incorrect' } });
    BusinessUser.validatesUniquenessOf('mobileNo', {message: 'Phone No already exists'});


    BusinessUser.observe('before save',function(ctx,next){
        var data = ctx.data || ctx.instance;
        console.log('data ',data);
        if(data.otpVerified)
            delete data[otpVerified];
        if(data.emailVerified)
            delete data[emailVerified];

        next();

    })
   
}