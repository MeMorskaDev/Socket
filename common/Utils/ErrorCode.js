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
    },
    "MENU_STRUCTURE_NOT_PROVIDED": {
        "status": 400,
        "message": "Error in creating MenuItem as MenuStructureId not provided",
        "applicationCode": "MI001"
    },
    "MENU_STRUCTURE_NOT_EXIST": {
        "status": 400,
        "message": "Error in creating MenuItem as MenuStructureId does not Exist",
        "applicationCode": "MI002"
    },
    "RESTAURANT_NOT_PROVIDED": {
        "status": 400,
        "message": "Error in creating MenuItem as RestaurantId not provided",
        "applicationCode": "MI003"
    },
    "RESTAURANT_NOT_EXIST": {
        "status": 400,
        "message": "Error in creating MenuItem as RestaurantId does not Exist",
        "applicationCode": "MI004"
    },
    "MENU_ITEM_EXISTS": {
        "status": 400,
        "message": "Error in creating MenuItem as MenuItem already exists",
        "applicationCode": "MI005"
    }
}