var loopback =require('loopback');
var debug = require('debug')('base-user');

module.exports = function RestaurantUser(RestaurantUser) {
    
    /**
   * Create access token for the logged in user. This method can be overridden to
   * customize how access tokens are generated
   *
   * @param {Number} ttl The requested ttl
   * @param {Object} [options] The options for access token, such as scope, appId
   * @callback {Function} cb The callback function
   * @param {String|Error} err The error string or object
   * @param {AccessToken} token The generated access token object
   */
  RestaurantUser.prototype.createAccessToken = function(ttl, options, cb) {
    if (cb === undefined && typeof options === 'function') {
      // createAccessToken(ttl, cb)
      cb = options;
      options = undefined;
    }

    cb = cb || utils.createPromiseCallback();

    if (typeof ttl === 'object' && !options) {
      // createAccessToken(options, cb)
      options = ttl;
      ttl = options.ttl;
    }
    options = options || {};
    var userModel = this.constructor;
   //ttl = Math.min(ttl || userModel.settings.ttl, userModel.settings.maxTTL);

    var accessToken ={};

    var BaseRoleMapping = loopback.getModelByType('BaseRoleMapping');
    var BaseRole = loopback.getModelByType('BaseRole');
    var roleIdArr=[];
    var self=this;
        (function findBaseRole (callback){
            
            BaseRoleMapping.find({
                where :{
                    principalId: self.id,
                    principalType: BaseRoleMapping.USER 
                }
            },function baseRollingMappingFindcb(err,baseRoleMap){
                if(err){
                    return callback(err);
                }else{
                    baseRoleMap.forEach(function(roleMap) {
                        roleIdArr.push(roleMap.roleId);
                    });
                    BaseRole.find({
                        where:{
                            id:{
                                inq : roleIdArr
                            }
                            
                        }
                    },function baseRoleFindcb(err,baseRoles){
                        if(err){
                            return callback(err);
                        }else{

                            var roleArr = baseRoles.map(function(r){
                                return r.name;
                            });

                            accessToken.roles= roleArr;
                            accessToken.username = self.username;
                            accessToken.ttl = Math.min(ttl || userModel.settings.ttl, userModel.settings.maxTTL);
                            self.accessTokens.create(accessToken, cb);
                        }
                    })
                }
            })
        })();

    
    return cb.promise;
  };

    /**
   * Login a user by with the given `credentials`.
   *
   * ```js
   *    User.login({username: 'foo', password: 'bar'}, function (err, token) {
  *      console.log(token.id);
  *    });
   * ```
   *
   * @param {Object} credentials username/password or email/password
   * @param {String[]|String} [include] Optionally set it to "user" to include
   * the user info
   * @callback {Function} callback Callback function
   * @param {Error} err Error object
   * @param {AccessToken} token Access token if login is successful
   */

  RestaurantUser.login = function(credentials, include,options, fn) {
    var self = this;
   if (options === undefined && fn === undefined) {
            if (typeof include === 'function') {
                fn = include;
                include = undefined;
                options = {};
            }
        } else if (fn === undefined) {
            if (typeof options === 'function') {
                fn = options;
                options = include;
                include = undefined;
            }
        }

    fn = fn || utils.createPromiseCallback();

    include = (include || '');
    if (Array.isArray(include)) {
      include = include.map(function(val) {
        return val.toLowerCase();
      });
    } else {
      include = include.toLowerCase();
    }

    var realmDelimiter;
    // Check if realm is required
    var realmRequired = !!(self.settings.realmRequired ||
      self.settings.realmDelimiter);
    if (realmRequired) {
      realmDelimiter = self.settings.realmDelimiter;
    }
    var query = self.normalizeCredentials(credentials, realmRequired,
      realmDelimiter);

    if (realmRequired && !query.realm) {
      var err1 = new Error('realm is required');
      err1.statusCode = 400;
      err1.code = 'REALM_REQUIRED';
      fn(err1);
      return fn.promise;
    }
    if (!query.email && !query.username) {
      var err2 = new Error('username or email is required');
      err2.statusCode = 400;
      err2.code = 'USERNAME_EMAIL_REQUIRED';
      fn(err2);
      return fn.promise;
    }

    self.findOne({where: query}, function(err, user) {
      var defaultError = new Error('login failed');
      defaultError.statusCode = 401;
      defaultError.code = 'LOGIN_FAILED';

      function tokenHandler(err, token) {
        if (err) return fn(err);
        if (Array.isArray(include) ? include.indexOf('user') !== -1 : include === 'user') {
          // NOTE(bajtos) We can't set token.user here:
          //  1. token.user already exists, it's a function injected by
          //     "AccessToken belongsTo User" relation
          //  2. ModelBaseClass.toJSON() ignores own properties, thus
          //     the value won't be included in the HTTP response
          // See also loopback#161 and loopback#162
          token.__data.user = user;
        }
        fn(err, token);
      }

      if (err) {
        debug('An error is reported from User.findOne: %j', err);
        fn(defaultError);
      } else if (user) {
        user.hasPassword(credentials.password, function(err, isMatch) {
          if (err) {
            debug('An error is reported from User.hasPassword: %j', err);
            fn(defaultError);
          } else if (isMatch) {
            if (self.settings.emailVerificationRequired && !user.emailVerified) {
              // Fail to log in if email verification is not done yet
              debug('User email has not been verified');
              err = new Error('login failed as the email has not been verified');
              err.statusCode = 401;
              err.code = 'LOGIN_FAILED_EMAIL_NOT_VERIFIED';
              fn(err);
            } else {
              if (user.createAccessToken.length === 2) {
                user.createAccessToken(credentials.ttl, tokenHandler);
              } else {
                user.createAccessToken(credentials.ttl, credentials, tokenHandler);
              }
            }
          } else {
            debug('The password is invalid for user %s', query.email || query.username);
            fn(defaultError);
          }
        });
      } else {
        debug('No matching record is found for user %s', query.email || query.username);
        fn(defaultError);
      }
    });
    return fn.promise;
  };

}