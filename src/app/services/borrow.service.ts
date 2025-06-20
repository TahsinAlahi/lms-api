import { RequestHandler } from "express";
import createHttpError from "http-errors";
import booksModel from "../models/books.model";
import mongoose from "mongoose";
import borrowsModel from "../models/borrows.model";

const createBorrow: RequestHandler = async (req, res, next) => {
  try {
    const { book, quantity, dueDate } = req.body;

    if (!mongoose.isValidObjectId(book)) {
      throw next(
        createHttpError(400, {
          message: "Invalid book ID",
          errorDetails: "Invalid book ID provided",
        })
      );
    }
    if (!quantity || quantity < 1) {
      throw next(
        createHttpError(400, {
          message: "Quantity must be at least 1",
          errorDetails: "Quantity must be at least 1",
        })
      );
    }
    if (!dueDate) {
      throw next(
        createHttpError(400, {
          message: "Due date is required",
          errorDetails: "Due date is required",
        })
      );
    }

    const bookDoc = await booksModel.findById(book);
    if (!bookDoc) {
      throw next(
        createHttpError(404, {
          message: "Book not found",
          errorDetails: "Book not found",
        })
      );
    }

    if (bookDoc.copies < quantity) {
      throw next(
        createHttpError(400, {
          message: "Not enough copies available",
          errorDetails: "Not enough copies available",
        })
      );
    }

    const borrowRecord = await borrowsModel.create({
      book,
      quantity,
      dueDate,
    });

    bookDoc.copies -= quantity;
    await bookDoc.save();

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: borrowRecord,
    });
  } catch (error) {
    next(error);
  }
};

const borrowedBookSummery: RequestHandler = async (req, res, next) => {
  try {
    const summary = await borrowsModel.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      {
        $unwind: "$bookDetails",
      },
      {
        $project: {
          _id: 0,
          totalQuantity: 1,
          book: {
            title: "$bookDetails.title",
            isbn: "$bookDetails.isbn",
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createBorrow,
  borrowedBookSummery,
};
