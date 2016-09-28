module.exports = function OTP(OTP){
    OTP.validatesInclusionOf('state',{'in':['EXPIRED','USED','UNUSED']});

}