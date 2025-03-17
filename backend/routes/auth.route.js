const express = require("express");
const router = express.Router();

const {signup,login,logout, savePreference, changePassword} = require('../controller/auth.controller');

const { protectRoute } = require("../middleware/protectRoute");


router.post('/auth/signup',signup);
router.post('/auth/login',login);
router.post('/auth/logout',logout);
router.post('/auth/save-preferences',protectRoute,savePreference)

router.patch('/auth/change-password', changePassword);
module.exports = router;
