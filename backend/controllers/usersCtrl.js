const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

//User Registration

const usersController = {
  //Register
  register: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    //Validate
    if (!username || !email || !password) {
      throw new Error("Please all fields are required");
    }
    //Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User Already Exists");
    }
    //Hash the user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create the user and save into db
    const userCreated = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    // Send the response
    res.json({
      username: userCreated.username,
      email: userCreated.email,
      id: userCreated._id,
    });
  }),
  //Login
  login: asyncHandler(async (req, res) => {
    //Get the user data
    const { email, password } = req.body;
    //Check if email is valid
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid login credentials");
    }
    //Compare the user password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid login credentials");
    }
    // Generate a token
    const token = jwt.sign({ id: user._id }, "shifa", {
      expiresIn: "30d",
    });
    //Send the response
    res.json({
      message: "Login Success",
      token,
      id: user._id,
      email: user.email,
      username: user.username,
    });
  }),
  //profile
  profile: asyncHandler(async (req, res) => {
    //Find the user
    console.log(req.user);
    const user = await User.findById(req.user);
    if (!user) {
      throw new Error("User not Found");
    }
    //Send the response
    res.json({ username: user.username, email: user.email });
  }),
  //Change Password
  changeUserPassword: asyncHandler(async (req, res) => {
    const { newPassword } = req.body;
    //Find the user
    const user = await User.findById(req.user);
    if (!user) {
      throw new Error("User not Found");
    }
    //Hash the new Password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    //Resave
    await user.save();
    //Send the response
    res.json({ message: "Password Changed Successfully" });
  }),
  //Update User Profile
  updateUserProfile: asyncHandler(async (req, res) => {
    const { email, username } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      {
        username,
        email,
      },
      {
        new: true,
      }
    );
    res.json({ message: "User Profile Successfully" , updatedUser });
  }),
};

module.exports = usersController;
