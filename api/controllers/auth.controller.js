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

    const {password: pass, ...rest} = await validUser._doc;

    const token = jwt.sign(
      validUser._id.toString(),
      process.env.JWT_SECRET_KEY
    );

    res
      .cookie("access-token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
