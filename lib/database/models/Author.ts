import mongoose from 'mongoose';
import { IComicDocument } from './Comic';

interface IAuthorDocument extends mongoose.Document {
  name: string;
  slug: string;
  comics?: mongoose.Types.DocumentArray<IComicDocument>;
}

const AuthorSchema = new mongoose.Schema<IAuthorDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    comics: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Comic',
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

export { type IAuthorDocument, AuthorSchema };
