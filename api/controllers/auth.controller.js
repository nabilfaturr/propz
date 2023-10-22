import User from "./../models/user.model.js";
import bcrypsjs from "bcryptjs";

export const signup = async (req, res) => {
  const { username, password, email } = req.body;

  console.log(`Username : ${username}`);
  console.log(`Password : ${password}`);
  console.log(`Email : ${email}`);

  try {
    const hashedPassword = await bcrypsjs.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();

    res.status(201).json("User Created succesfully")
    
  } catch (error) {
    res.status(500).json(error.message)
  }
};
