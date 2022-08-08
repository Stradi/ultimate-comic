import mongoose from 'mongoose';
import { IComicDocument } from './Comic';

//TODO: Don't use mongoose types for fields.
interface IIssueDocument extends mongoose.Document {
  name: string;
  slug: string;
  comic: IComicDocument;
  viewCount: number;
  images?: string[];

  createdAt: Date;
  updatedAt: Date;
}

const IssueSchema = new mongoose.Schema<IIssueDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    comic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comic',
    },
    viewCount: {
      type: Number,
      required: true,
      default: 0,
    },
    images: {
      type: [String],
      required: false,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export { type IIssueDocument, IssueSchema };
