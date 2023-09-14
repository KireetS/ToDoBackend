const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("./../models/User");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser");
const { body, validationResult } = require("express-validator");

router.post(
  "/create",
  [
    body("email").isEmail(),
    body("name").isLength({ min: 3 }),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      // const user = User(req.body)
      // await user.save()
      const existingUser = await User.findOne({ email: req.body.email });

      if (existingUser) {
        return res.status(400).json({ error: "user already created" });
      } else {
        try {
          const salt = await bcrypt.genSalt(10);

          let secPass = await bcrypt.hash(req.body.password, salt);
          const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
          });
          await user.save();
          const data = {
            user: {
              id: user.id,
            },
          };
          let token = jwt.sign(data, process.env.SECRET);
          return res.json({ token });
        } catch (err) {
          res.status(500);
          return console.error("error fetching from mongoDb ", err);
        }
      }
    }

    res.send({ errors: result.array() });
  }
);

//login endpoint

router.post(
  "/login",
  [body("email").isEmail(), body("password").exists()],
  async (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const { email, password } = req.body;
      try {
        let user = await User.findOne({ email });
        if (!user) {
          return res.json({ error: "please enter correct creds" });
        }

        const passCompare = await bcrypt.compare(password, user.password);
        if (!passCompare) {
          return res.json({ error: "please enter correct creds" });
        }

        const data = {
          user: {
            id: user.id,
          },
        };
        let token = jwt.sign(data, process.env.SECRET);
        return res.json({ token });
      } catch (err) {
        res.status(500);
        console.error("error caused in login", err);
      }
    }

    res.send({ error: result.array() });
  }
);

//fetchUser

router.get("/getuser", fetchUser, async (req, res) => {
  try {
    let user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500);
    console.error("error getting users  ", err);
  }
});
module.exports = router;
