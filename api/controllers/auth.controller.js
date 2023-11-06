import User from "./../models/user.model.js";
import bcrypsjs from "bcryptjs";
import { errorHandler } from "./../utils/error.util.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, password, email } = req.body;

  console.log(`Username : ${username}`);
  console.log(`Password : ${password}`);
  console.log(`Email : ${email}`);

  try {
    const hashedPassword = await bcrypsjs.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();

    res.status(201).json("User Created succesfully");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User Not Found!"));
    }

    const validPassword = await bcrypsjs.compare(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(404, "Invalid Credential!"));
    }

    console.log(validUser._doc);

    const { password: pass, ...rest } = await validUser._doc;

    const token = jwt.sign(
      validUser._id.toString(),
      process.env.JWT_SECRET_KEY
    );

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    // udah sign up
    if (user) {
      const token = jwt.sign(user._id.toString(), process.env.JWT_SECRET_KEY);

      const { password: pass, ...rest } = user._doc;
      console.log(rest);
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }

    // belum sign up
    else {
      const { username, email, photo } = req.body;

      const password =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = await bcrypsjs.hash(password, 10);

      const finalUsername =
        username.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4);
      console.log(password);

      console.log(`username : ${finalUsername}`);
      console.log(`password : ${hashedPassword}`);

      const newUser = new User({
        username: finalUsername,
        password: hashedPassword,
        email,
        avatar: photo,
      });

      await newUser.save();

      const { password: pass, ...rest } = await newUser._doc;

      const token = jwt.sign(
        newUser._id.toString(),
        process.env.JWT_SECRET_KEY
      );

      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out!")
  } catch (error) {
    next(error)
  }
}
