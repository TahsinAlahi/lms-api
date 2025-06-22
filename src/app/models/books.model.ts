import { InferSchemaType, model, Schema } from "mongoose";

export enum Genre {
  FICTION = "FICTION",
  NON_FICTION = "NON_FICTION",
  SCIENCE = "SCIENCE",
  HISTORY = "HISTORY",
  BIOGRAPHY = "BIOGRAPHY",
  FANTASY = "FANTASY",
}

type IBookDocument = InferSchemaType<typeof bookSchema>;

interface IBook extends IBookDocument, Document {
  updateAvailability: () => void;
}

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
    },
    genre: {
      type: String,
      enum: {
        values: Object.values(Genre),
        message: "Genre must be one of the allowed values",
      },
      required: [true, "Genre is required"],
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      unique: true,
    },
    description: {
      type: String,
    },
    copies: {
      type: Number,
      required: [true, "Copies field is required"],
      min: [0, "Copies must be a non-negative number"],
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    methods: {
      updateAvailability: function (): void {
        this.available = this.copies > 0;
      },
    },
  }
);

export default model<IBook>("Book", bookSchema);
