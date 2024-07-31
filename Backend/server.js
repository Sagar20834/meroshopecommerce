const app = require("./app");
const dotenv = require("dotenv");

dotenv.config({
  path: "Backend/config/.env",
});
require("./config/dbConnect");

app.listen(process.env.PORT, () => {
  console.log(
    `server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});
