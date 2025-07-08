const asyncHandler = require("express-async-handler");
const Category = require("../model/Category");
const Transactions = require("../model/Transactions");

const transactionController = {
  //add
  create: asyncHandler(async (req, res) => {
    const { type, category, amount, date, description } = req.body;
    if (!amount || !type || !date) {
      throw new Error(" Type, amount & date are required ");
    }
    const transaction = await Transactions.create({
      user: req.user,
      type,
      category,
      amount,
      date,
      description,
    });
    res.status(201).json(transaction);
  }),

  //lists
  getFilteredTransactions: asyncHandler(async (req, res) => {
    const { startDate, endDate, type, category } = req.query;
    let filters = { user: req.user };

    if (startDate) {
      filters.date = { ...filters.date, $gte: new Date(startDate) };
    }
    if (endDate) {
      filters.date = { ...filters.date, $lte: new Date(endDate) };
    }
    if (type) {
      filters.type = type;
    }
    if (category) {
      if (category === "All") {
        //No Category filter needed when filtering for all
      } else if (category === "Uncategorized") {
        filters.category = "Uncategorized";
      } else {
        filters.category = category;
      }
    }
    const transaction = await Transactions.find(filters).sort({ date: -1 });
    res.json(transaction);
  }),

  //update
  update: asyncHandler(async (req, res) => {
    //Find The transaction
    const transaction = await Transactions.findById(req.params.id);
    if (transaction && transaction.user.toString() === req.user.toString()) {
      transaction.type = req.body.type || transaction.type;
      transaction.category = req.body.category || transaction.category;
      transaction.amount = req.body.amount || transaction.amount;
      transaction.date = req.body.date || transaction.date;
      transaction.description = req.body.description || transaction.description;

      //update
      const updatedTransaction = await transaction.save();
      res.json(updatedTransaction);
    }
  }),
  //delete
  delete: asyncHandler(async (req, res) => {
    //Find The transaction
    const transaction = await Transactions.findById(req.params.id);
    if (transaction && transaction.user.toString() === req.user.toString()) {
      await Transactions.findByIdAndDelete(req.params.id);
      res.json({ message: "Transaction removed" });
    }
  }),
};

module.exports = transactionController;
