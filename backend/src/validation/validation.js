
const mongoose = require('mongoose');
//const { isValid } = require('../../../../projectBookmanagement/booksManagementGroup65/src/validations/validation');

const isValid = (value) => {
    if (typeof value === "undefined" || typeof value === "null") return false;
   if (typeof value === "string" && value.trim().length === 0) return false;

    return true;
}


   let isValidSpace = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidPincode = (num) => {
    return /^[1-9][0-9]{5}$/.test(num)
}

const isValidBody = (reqBody) => {
    return Object.keys(reqBody).length == 0;
}

const isValidString = (String) => {
    return /\d/.test(String)
}

const isValidPhone = (Mobile) => {
    return /^[6-9]\d{9}$/.test(Mobile)
};

const isValidMobile = function (mobile) {
    var phone = /^[6789][0-9]{9}$/;
    return phone.test(mobile);
}

const isValidEmail = (Email) => {
    return /^([A-Za-z0-9._]{3,}@[A-Za-z]{3,}[.]{1}[A-Za-z.]{2,6})+$/.test(Email)
};

const isValidPwd = (Password) => {
    return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(Password)
};

const isValidObjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId);
}

const isValidPrice = (price) => {
    return /^[1-9]\d{0,7}(?:\.\d{1,2})?$/.test(price)
}

const isValidSize = (sizes) => {
    return ["S", "XS", "M", "X", "L", "XXL", "XL"].includes(sizes);
}

const convertFormat = (sizes) =>{
    return sizes.toUpperCase()
}


const isValidNum = (num) => {
    return /^[0-9]*[1-9]+$|^[1-9]+[0-9]*$/.test(num);
}


const isValidRequest = function(data){
    return Object.keys(data).length > 0
}

const isValidName = function(name){
    return /^[a-zA-Z]{2,20}$/.test(name.trim())
    }

    const isValidStreet = function(street){
        return /\w*\s*|\w|\D/.test(street.trim())
        }

        const isValidNumber = function (value) {
            if (!value || value === undefined) return false
            if (typeof value !== "number") return false
            return true
        }

        const isValidImage = function(profileImage){
            return /([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)/.test(profileImage)
           }


        const isTrimed= (value)=>{
            return value.trim()
        }

           const objectid = /^[0-9a-fA-F]{24}$/
           const nameRegex =  /^[ a-z ]+$/i

module.exports = {  isValidBody, isValidSpace,isValid, isValidString, isValidPhone, isValidEmail, isValidPwd, isValidObjectId, isValidPincode, isValidPrice, isValidSize, isValidNum,isValidRequest,isValidName,isValidMobile,isValidStreet,isValidNumber, isValidImage ,objectid,nameRegex}
