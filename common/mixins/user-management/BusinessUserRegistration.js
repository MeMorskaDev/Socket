var path = require('path');

module.exports = function(Model){




Model.afterRemote('create', function(context, userInstance, next) {
    console.log('> user.afterRemote triggered');

    console.log('User Instance ',userInstance);
 
    var options = {
      type: 'email',
      to: userInstance.email,
      from: 'info@memorska.com',
      subject: 'Thanks for registering.',
      template: path.resolve(__dirname, '../../../client/views/verify.ejs'),
      redirect: '/verified',
      user: userInstance
    };
 
    userInstance.verify(options, function(err, response) {
      if (err){
          console.log(err);
      } else{
           console.log('> verification email sent:', response);
          
      }
      
 
     
 
    //   context.res.render('response', {
    //     title: 'Signed up successfully',
    //     content: 'Please check your email and click on the verification link ' +
    //         'before logging in.',
    //     redirectTo: '/',
    //     redirectToLinkText: 'Log in'
    //   });
    });

    next();
  });

}