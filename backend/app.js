require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRouter");
const errorHandler = require("./middlewares/errorHandlerMiddleware");
const categoryRouter = require("./routes/categoryRouter");
const transactionRouter = require("./routes/transactionRouter");
const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',  // Frontend URL
  credentials: true                 // Only if you're using cookies or auth headers
}));


//Connect to mongodb
mongoose
  .connect(
    "mongodb+srv://shifasayyad20:shifasayyad20@expenses.amv7fkf.mongodb.net/Expense?retryWrites=true&w=majority&appName=Expenses"
  )
  .then(() => console.log("DB Connected"))
  .catch((e) => console.log(e));

//Middlewares
app.use(express.json());

//Routes
app.use("/", userRouter);
app.use("/", categoryRouter);
app.use("/", transactionRouter);
//Error
app.use(errorHandler);

//Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
