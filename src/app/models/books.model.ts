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
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: {
      type: String,
      enum: Object.values(Genre),
      required: true,
    },
    isbn: { type: String, required: true, unique: true },
    description: { type: String },
    copies: {
      type: Number,
      required: true,
      min: [0, "Copies must be a non-negative number"],
    },
    available: { type: Boolean, default: true },
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
