const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");

const userRouter = require("express").Router();

userRouter.get("/signup", async (req, res, next) => {
  try {
    const data = await User.find({});
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

userRouter.post("/signup", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "Email already exists!!" });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      email,
      passwordHash,
    });

    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

userRouter.post("/signin", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!email) {
      return res.status(400).json({ error: "Email doesnot exists" });
    }
    const isCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!isCorrect) {
      return res.status(400).json({ error: "Password wrong" });
    }
    const userForToken = {
      email: user.email,
      id: user.id,
    };
    const token = jwt.sign(userForToken, config.SECRET, { expiresIn: 60 * 60 });
    res.status(200).json({ token, email: user.email, id: user.id });
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
