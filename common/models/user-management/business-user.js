var loopback = require('loopback');
var assert = require('assert');
var g = require('strong-globalize')();
var debug = require('debug')('Business-User');
//var log = require('../../common-modules/logger')('business-user');

module.exports = function BusinessUser(BusinessUser) {
    BusinessUser.validatesLengthOf('mobileNo', { is: 10, message: { min: 'Phone No is Incorrect' } });
    BusinessUser.validatesUniquenessOf('mobileNo', { message: 'Phone No already exists' });

    BusinessUser.observe('before save', function (ctx, next) {
        var data = ctx.data || ctx.instance;

        if (ctx.isNewInstance) {
            console.log('data ', data);
            if (data.otpVerified)
                delete data[otpVerified];
            if (data.emailVerified)
                delete data[emailVerified];

        }

        next();

    });



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

    BusinessUser.login = function (credentials, include, fn) {
        var self = this;
        if (typeof include === 'function') {
            fn = include;
            include = undefined;
        }

        fn = fn || utils.createPromiseCallback();

        include = (include || '');
        if (Array.isArray(include)) {
            include = include.map(function (val) {
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
            var err1 = new Error(g.f('{{realm}} is required'));
            err1.statusCode = 400;
            err1.code = 'REALM_REQUIRED';
            fn(err1);
            return fn.promise;
        }
        if (!query.email && !query.mobileNo) {
            var err2 = new Error(g.f('{{mobileNo}} or {{email}} is required'));
            err2.statusCode = 400;
            err2.code = 'MOBILENO_EMAIL_REQUIRED';
            fn(err2);
            return fn.promise;
        }

        self.findOne({ where: query }, function (err, user) {
            var defaultError = new Error(g.f('login failed'));
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
                user.hasPassword(credentials.password, function (err, isMatch) {
                    if (err) {
                        debug('An error is reported from User.hasPassword: %j', err);
                        fn(defaultError);
                    } else if (isMatch) {
                        if (self.settings.emailVerificationRequired && !user.emailVerified && credentials.email) {
                            // Fail to log in if email verification is not done yet
                            debug('User email has not been verified');
                            err = new Error(g.f('login failed as the email has not been verified'));
                            err.statusCode = 401;
                            err.code = 'LOGIN_FAILED_EMAIL_NOT_VERIFIED';
                            fn(err);
                        } else if (self.settings.optVerficationRequired && !user.otpVerified && credentials.mobileNo) {
                            // Fail to log in if otp verification is not done yet
                            debug('User otp has not been verified');
                            err = new Error(g.f('login failed as the otp has not been verified'));
                            err.statusCode = 401;
                            err.code = 'LOGIN_FAILED_OTP_NOT_VERIFIED';
                            fn(err);
                        }
                        else {
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


    /**
       * Normalize the credentials
       * @param {Object} credentials The credential object
       * @param {Boolean} realmRequired
       * @param {String} realmDelimiter The realm delimiter, if not set, no realm is needed
       * @returns {Object} The normalized credential object
       */
    BusinessUser.normalizeCredentials = function (credentials, realmRequired, realmDelimiter) {
        var query = {};
        credentials = credentials || {};
        if (!realmRequired) {
            if (credentials.email) {
                query.email = credentials.email;
            } else if (credentials.mobileNo) {
                query.mobileNo = credentials.mobileNo;
            }
        } else {
            if (credentials.realm) {
                query.realm = credentials.realm;
            }
            var parts;
            if (credentials.email) {
                parts = splitPrincipal(credentials.email, realmDelimiter);
                query.email = parts[1];
                if (parts[0]) {
                    query.realm = parts[0];
                }
            } else if (credentials.username) {
                parts = splitPrincipal(credentials.username, realmDelimiter);
                query.username = parts[1];
                if (parts[0]) {
                    query.realm = parts[0];
                }
            }
        }
        return query;
    };

    function splitPrincipal(name, realmDelimiter) {
        var parts = [null, name];
        if (!realmDelimiter) {
            return parts;
        }
        var index = name.indexOf(realmDelimiter);
        if (index !== -1) {
            parts[0] = name.substring(0, index);
            parts[1] = name.substring(index + realmDelimiter.length);
        }
        return parts;
    }

}