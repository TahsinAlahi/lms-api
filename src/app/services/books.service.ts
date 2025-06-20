import { RequestHandler } from "express";
import booksModel, { Genre } from "../models/books.model";

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
    next(error);
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
      error: (error as Error).message,
    });
  }
};

export default {
  postBooks,
  getAllBooks,
};
