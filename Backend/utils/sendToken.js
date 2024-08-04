const sendTokenandResponse = (user, StatusCode, res) => {
  const token = user.getJWTtoken();

  //option for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(StatusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};
module.exports = sendTokenandResponse;
