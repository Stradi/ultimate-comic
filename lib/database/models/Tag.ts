import mongoose from 'mongoose';
import { IComicDocument } from './Comic';

interface ITagDocument extends mongoose.Document {
  name: string;
  slug: string;
  comics?: mongoose.Types.DocumentArray<IComicDocument>;
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema = new mongoose.Schema<ITagDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    comics: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: 'Comic',
        },
      ],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export { type ITagDocument, TagSchema };
