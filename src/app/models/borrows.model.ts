import { InferSchemaType, model, Schema } from "mongoose";
import booksModel from "./books.model";

const borrowSchema = new Schema(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
    dueDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

borrowSchema.pre("save", async function (next) {
  const bookDoc = await booksModel.findById(this.book);

  if (!bookDoc) {
    return next(new Error("Book not found"));
  }

  if (bookDoc.copies < this.quantity) {
    return next(new Error("Not enough copies available"));
  }

  bookDoc.copies -= this.quantity;
  bookDoc.updateAvailability();
  await bookDoc.save();

  next();
});

export type IBorrow = InferSchemaType<typeof borrowSchema>;
export default model<IBorrow>("Borrow", borrowSchema);
