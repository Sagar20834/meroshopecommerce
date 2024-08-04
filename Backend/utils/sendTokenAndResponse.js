const sendTokenAndResponse = (user, statusCode, res) => {
  const token = user.getJWTtoken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message: "token successfully added,",
    token,
    user,
  });
};

module.exports = sendTokenAndResponse;
