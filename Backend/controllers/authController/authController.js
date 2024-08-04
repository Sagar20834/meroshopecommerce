const User = require("../../models/user/user");
const appError = require("../../utils/appError");
const getJWTToken = require("../../utils/getJWTToken.js");
const sendToken = require("../../utils/jwtToken");
const sendEmail = require("../../utils/sendEmail.js");
const sendTokenandResponse = require("../../utils/sendToken.js");
const sendTokenAndResponse = require("../../utils/sendTokenAndResponse.js");

const crypto = require("crypto");

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

    // sendToken(user, 200, res);
    // sendTokenandResponse(user, 200, res);
    res.status(200).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    return next(appError(error.message, 400));
  }
};

// const registerNewUser = async (req, res, next) => {
//   try {
//     const { name, email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (user) {
//       return next(appError("User already exists", 400));
//     }
//     const newUser = await User.create({
//       name,
//       email,
//       password,
//       avatar: {
//         public_id: `avatar/useravatar_maswya`,
//         url: `https://res.cloudinary.com/sagar20834/image/upload/f_auto,q_auto/v1/avatar/useravatar_maswya`,
//       },
//     });
//     const token = newUser.getJWTtoken();

//     res.status(200).json({
//       success: true,
//       message: "User created successfully",
//       newUser,
//       token: getJWTToken(newUser._id),
//     });
//   } catch (error) {
//     return next(appError(error.message, 500));
//   }
// };

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
    // sendToken(user, 200, res); //function in jwttoken.js to gettoken and scave to cookie

    // sendTokenandResponse(user, 200, res);
    sendTokenAndResponse(user, 200, res);
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

//reset password  /api/v1/password/reset/:token

const resetPasswod = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswodExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(appError("Invalid or expired token", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
      return next(appError("Passwords do not match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswodExpire = undefined;

    await user.save({
      validateBeforeSave: false,
    });

    sendTokenAndResponse(user, 200, res);
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//get current logged in user => /api/v1/me

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return next(appError("User not found", 404));
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//update/change password api/v1/password/update

const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return next(appError("User not found", 404));
    }

    const isMatchedPassword = await user.comparePassword(req.body.oldPassword);
    if (!isMatchedPassword) {
      return next(appError("Incorrect current password", 401));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(appError("Passwords do not match", 400));
    }

    user.password = req.body.newPassword;

    await user.save({
      validateBeforeSave: false,
    });

    sendTokenAndResponse(user, 200, res);
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//update/change profile api/v1/me/update

const updateUserProfile = async (req, res, next) => {
  const { name, email } = req.body;
  try {
    if (email) {
      const emailFound = await User.findOne({ email });
      if (emailFound) {
        return next(appError("Email is already in use or already taken", 400));
      }
    }
    //avatar todo
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      success: true,
      status: "successfully updated",
      user,
    });
  } catch (error) {
    return next(appError(error.message));
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

//admin routes api/v1/admin/users

const allusers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//get user details => /api/v1/admin/user:id

const getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return next(appError("User not found", 404));
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//update/change profile /api/v1/admin/user:id

const updateUser = async (req, res, next) => {
  const { name, email, role } = req.body;
  try {
    const userFound = await User.findById(req.params.id);
    if (!userFound) {
      return next(appError("User not found", 404));
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      success: true,
      status: "successfully updated",
      user,
    });
  } catch (error) {
    return next(appError(error.message));
  }
};

//delete /api/v1/admin/user:id

const deleteUser = async (req, res, next) => {
  try {
    const userFound = await User.findById(req.params.id);
    if (!userFound) {
      return next(appError("User not found", 404));
    }
    const user = await User.findByIdAndDelete(userFound.id);

    //remov etht avaatar from cloudinary

    res.status(200).json({
      success: true,
      status: "successfully Deleted",
      user,
    });
  } catch (error) {
    return next(appError(error.message));
  }
};

module.exports = {
  registerUser,
  // registerNewUser,
  loginUser,
  logout,
  forgotPassword,
  resetPasswod,
  getUserProfile,
  updatePassword,
  updateUserProfile,
  allusers,
  getUserDetails,
  updateUser,
  deleteUser,
};
