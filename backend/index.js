const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/mainRouter.js");
const app = express();
app.use(express.json());
app.use(cors());

const { PORT, MONGO_URI } = require("./config.js");

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/v1", mainRouter);

app.listen(PORT, () => {
  console.log("Server is running on the port ", PORT);
});
