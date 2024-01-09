const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const menuRoutes = require("./routes/menu");
const profileRoutes = require("./routes/profile");
const authMiddleware = require("./middleware/auth");
// const { getMenu } = require("./routes/menu");
// const { registerUser } = require("./routes/auth");

const app = express();

mongoose
  .connect(
    "mongodb+srv://jayakrish10s10:xuSMtr4Qwxq4iGzV@cluster0.vfoiaan.mongodb.net/"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/auth", authRoutes);

// app.get("/api/menu", getMenu);
app.use("/api/menu", menuRoutes);
app.use("/api/profile", profileRoutes);

// app.use(require("./middleware/auth"));  {* or use this code instead of declaring first!*}
app.use(authMiddleware);

// app.post("/api/auth/reg", registerUser);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
