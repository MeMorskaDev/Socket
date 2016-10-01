var loopback = require('loopback');
var bootstrap = require('../bootstrap');
var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var chalk = require('chalk');
var config = require('../../server/config');
var app = loopback();

var request = supertest('http://'+'localhost'+':'+config.port+'/');

describe(chalk.blue('UserManagement Sign up Test'),function(){
    

    it('User should able to sign up using mobile Number and password',function(done){
        var url = 'api/BusinessUsers';
        var sendData = {
            mobileNo : '9535546600',
            password : 'saswat'
        }  

        request.post(url).set('Content-Type','application/json').set('Accept','application/json')
            .send(sendData)
            .expect(200)
            .end(function(err,response){
                if(err){
                    return done(err);
                }else{

                    expect(response.body.businessUserId);
                    done();
                }
            })
    })

    it('User should able to sign up using  duplicate mobile Number ',function(done){
        var url = 'api/BusinessUsers';
        var sendData = {
            mobileNo : '9535546600',
            password : 'saswat'
        }  

        request.post(url).set('Content-Type','application/json').set('Accept','application/json')
            .send(sendData)
            .end(function(err,response){
                if(err){
                    return done(err);
                }else{
                    
                    expect(response.status).to.be.equal(422);
                    expect(response.body.error.name).to.be.equal("ValidationError");
                    done();
                }
            })
    });

    it('User should able to login as  mobile number is not verified ',function(done){
        var url = 'api/BusinessUsers/login';
        var sendData = {
            mobileNo : '9535546600',
            password : 'saswat'
        }  

        request.post(url).set('Content-Type','application/json').set('Accept','application/json')
            .send(sendData)
            .end(function(err,response){
                if(err){
                    return done(err);
                }else{
                    
                    expect(response.status).to.be.equal(401);
                    expect(response.body.error.message).to.be.equal("login failed as the otp has not been verified");
                    expect(response.body.error.code).to.be.equal("LOGIN_FAILED_OTP_NOT_VERIFIED");
                    done();
                }
            })
    })
})