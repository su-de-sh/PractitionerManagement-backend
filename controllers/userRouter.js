const User = require("../models/user");
const bcrypt = require("bcryptjs");
const userRouter = require("express").Router();

userRouter.get("/", async (req, res, next) => {
  try {
    const data = await User.find({})
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

userRouter.post("/", async (req, res, next) => {
  try {
    const { email, password } = req.body;
  


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({"error":"Email already exists!!"});
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

module.exports = userRouter;
