const express = require("express");
const router = express.Router();

const {signup,login,logout, savePreference} = require('../controller/auth.controller');
const { protectRoute } = require("../middleware/protectRoute");


router.post('/auth/signup',signup);
router.post('/auth/login',login);
router.post('/auth/logout',logout);
router.post("/auth/save-preferences",protectRoute,savePreference)

module.exports = router;