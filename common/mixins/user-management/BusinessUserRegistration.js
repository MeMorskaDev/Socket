var path = require('path');
var loopback = require('loopback');

module.exports = function (Model) {

  Model.afterRemote('create', function (context, userInstance, next) {

    if (userInstance.email) {
      var options = {
        type: 'email',
        to: userInstance.email,
        from: 'info@memorska.com',
        subject: 'Thanks for registering.',
        template: path.resolve(__dirname, '../../../client/views/verify.ejs'),
        redirect: '/verified',
        user: userInstance
      };

      userInstance.verify(options, function (err, response) {
        if (err) {
          console.log(err);
        } else {
          console.log('> verification email sent:', response);
        }

      });
    }

    var BaseRoleMapping = loopback.getModel('BaseRoleMapping');

    BaseRoleMapping.create({
      "principalType": "USER",
      "principalId": userInstance.businessUserId,
      "roleId": 'rsaRoleId'
    }, function (err, baseRole) {
      if (err) {
         return cb(utils.getError('DEFAULT_ERROR',err));
      } else {
        next();
      }
    });

  });
}
