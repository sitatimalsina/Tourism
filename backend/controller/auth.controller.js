const User = require('../model/User');
const bcrypt = require("bcryptjs");
const generateTokenAndSetCookie = require("../utils/generateToken");

const signup = async (req, res) => {
    try {
        const { name, email, password, role  } = req.body;

     
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'email already exist' })
        }
        let hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name, 
            email,
            password: hashedPassword,
            role : role || "user",
        })


        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save()

            res.status(200).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role ,
                interests : newUser.preferences.interests,
            })
        }
        else {
			res.status(400).json({ error: "Invalid user data" });
        }

    } catch (err) {
        console.error("error in signup controller :", err.message)
        res.status(500).json({ error: "validaiton error" })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })


        if (user) {
            let matched = await bcrypt.compare(password, user?.password || "")
            if (matched) {
                 generateTokenAndSetCookie(user._id, res);
                return res.status(200).json({
                    name: user.name,
                    email : user.email,
                    _id: user._id,
                    role : user.role,
                    interests : user.preferences.interests,
                })
            }
        }
        return res.status(400).json({ error: 'invalid credential' })

    } catch (err) {
        console.log("Error in login controller", err.message);
        res.status(500).json({ error: "Internal server error" })
    }
}
const logout = async (req, res) => {
    try {
        res.cookie("jwt", '', { maxAge: 0 })
        res.status(200).json("user logged out successfully")
    } catch (err) {
        console.error("error in logout controller :", err.message)
    }
}

const savePreference = async (req, res) => {
    try {
      const { interests } = req.body;
  
      if (!interests || !Array.isArray(interests)) {
        return res.status(400).json({ error: "Invalid preferences data" });
      }
  
      if (!req.user) {
        return res.status(401).json({ error: "User not authenticated" });
      }
  
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { "preferences.interests": interests },
        { new: true } 
      );
  
      if (!user) return res.status(404).json({ error: "User not found" });
  
      res.json({ success: "Preferences saved successfully!", preferences: user.preferences });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  };


module.exports = {
    signup, login, logout,savePreference
} 