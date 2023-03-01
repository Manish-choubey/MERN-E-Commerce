const express = require("express");
const router = express.Router();
const  {createUser,loginUser, getUserDetails, updateUser }= require ("../controller/userController");
const { authentication } = require("../middleware/auth");
const {createProduct, getProductByFilter}= require("../controller/ProductConrollers")




router.post("/register",createUser)
router.post("/loginUser", loginUser)
router.get("/user/:userId/profile", authentication, getUserDetails);
router.put("/user/:userId/profile", authentication, updateUser)
//---------------------------------PHASE 2----------------------//
router.post("/products",createProduct)
router.get("/products", getProductByFilter)




module.exports = router