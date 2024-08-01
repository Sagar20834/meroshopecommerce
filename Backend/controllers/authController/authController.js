const User = require("../../models/user/user");
const appError = require("../../utils/appError");
const sendToken = require("../../utils/jwtToken");
const sendEmail = require("../../utils/sendEmail.js");

//register a user ==> /api/v1/register

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: `avatar/useravatar_maswya`,
        url: `https://res.cloudinary.com/sagar20834/image/upload/f_auto,q_auto/v1/avatar/useravatar_maswya`,
      },
    });

    sendToken(user, 200, res);
  } catch (error) {
    return next(appError(error.message, 400));
  }
};

//login a user ==> /api/v1/login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //check if presenet or not
    if (!email || !password) {
      return next(appError("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(appError("Invalid Credentials", 401));
    }

    const isMatchPassword = await user.comparePassword(password);
    if (!isMatchPassword) {
      return next(appError("Invalid Credentials", 401));
    }
    sendToken(user, 200, res); //function in jwttoken.js to gettoken and scave to cookie
  } catch (error) {
    return next(appError(error.message, 400));
  }
};

//forgot password  /api/v1/password/forgot

const forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(appError("User not found", 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({
    validateBeforeSave: false,
  });

  //create reset password url

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = ` Your password reset token is as follows: \n\n ${resetUrl}\n\n  if you have not requested it please ignore this`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Mero Shop Password Reset",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} for password reset`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswodExpire = undefined;
    await user.save({
      validateBeforeSave: false,
    });

    return next(appError(error.message, 500));
  }
};

//logout user /api/v1/logout
const logout = async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      message: "Logged out",
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

module.exports = {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
};
