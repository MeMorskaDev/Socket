module.exports = {
    "DEFAULT_ERROR": {
        "status": 500,
        "message": "Default Error",
        "applicationCode": "DF001"
    },
    "USER_NOT_FOUND": {
        "status": 400,
        "message": "User Not Found",
        "applicationCode": "UM001"
    },
    "OTP_NOT_VERIFIED": {
        "status": 400,
        "message": "Otp Not Verified",
        "applicationCode": "UM002"
    },
    "SUB_MENU_EXIST": {
        "status": 400,
        "message": "Error in creating MenuStructure as Sub Menu Exists",
        "applicationCode": "ME001"
    },
    "PARENT_DOES_NOT_EXIST": {
        "status": 400,
        "message": "Error in creating MenuStructure as parentId does not Exist",
        "applicationCode": "ME002"
    }
}