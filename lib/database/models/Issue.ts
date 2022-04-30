import mongoose from 'mongoose';
import { IComicDocument } from './Comic';

//TODO: Don't use mongoose types for fields.
interface IIssueDocument extends mongoose.Document {
  name: string;
  slug: string;
  comic?: IComicDocument;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
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
    images: [String],
    viewCount: Number,
  },
  {
    timestamps: true,
  }
);

export { type IIssueDocument, IssueSchema };
