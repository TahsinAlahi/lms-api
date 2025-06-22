import { RequestHandler } from "express";
import booksModel, { Genre } from "../models/books.model";
import mongoose from "mongoose";
import createHttpError from "http-errors";

const postBooks: RequestHandler = async (req, res, next) => {
  try {
    const { title, author, genre, isbn, description, copies } = req.body;

    const newBook = await booksModel.create({
      title,
      author,
      genre,
      isbn,
      description,
      copies,
    });

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: newBook,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(
        createHttpError(400, {
          message: "Validation failed",
          errorDetails: {
            name: "ValidationError",
            errors: error,
          },
        })
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).code === 11000) {
      return next(
        createHttpError(409, {
          message: "Duplicate value error",
          errorDetails: `A book with the same ISBN already exists.`,
        })
      );
    }

    next({
      status: 500,
      message: "Failed to create book",
      errorDetails: (error as Error).message,
    });
  }
};

const getAllBooks: RequestHandler = async (req, res, _next) => {
  try {
    const {
      filter,
      sort = "desc",
      sortBy = "createdAt",
      limit = "10",
    } = req.query;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (filter && Object.values(Genre).includes(filter as Genre)) {
      query.genre = filter;
    }

    const books = await booksModel
      .find(query)
      .sort({ [sortBy as string]: sort === "asc" ? 1 : -1 })
      .limit(parseInt(limit as string));

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve books",
      errorDetails: (error as Error).message,
    });
  }
};

const getBookById: RequestHandler = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    if (!mongoose.isValidObjectId(bookId)) {
      throw createHttpError({
        message: "Invalid book ID",
        errorDetails: "Invalid book ID provided",
      });
    }

    const book = await booksModel.findById(bookId);
    if (!book) {
      throw createHttpError(404, {
        message: "Book not found",
        errorDetails: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

const updateBookById: RequestHandler = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    if (!mongoose.isValidObjectId(bookId)) {
      throw createHttpError({
        message: "Invalid book ID",
        errorDetails: "Invalid book ID provided",
      });
    }

    const { title, author, genre, isbn, description, copies } = req.body;
    const updatedBook = await booksModel.findByIdAndUpdate(
      bookId,
      {
        title,
        author,
        genre,
        isbn,
        description,
        copies,
      },
      { new: true }
    );

    if (!updatedBook) {
      throw createHttpError(404, {
        message: "Book not found",
        errorDetails: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBookById: RequestHandler = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    if (!mongoose.isValidObjectId(bookId)) {
      throw createHttpError({
        message: "Invalid book ID",
        errorDetails: "Invalid book ID provided",
      });
    }
    const deletedBook = await booksModel.findByIdAndDelete(bookId);
    if (!deletedBook) {
      throw createHttpError(404, {
        message: "Book not found",
        errorDetails: "Book not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  postBooks,
  getAllBooks,
  getBookById,
  updateBookById,
  deleteBookById,
};
