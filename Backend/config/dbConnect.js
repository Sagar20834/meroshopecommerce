const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log(
      "Database connected successfully." + ` at ${mongoose.connection.host}`
    );
  } catch (error) {
    console.log(error);
  }
};

dbConnect();
