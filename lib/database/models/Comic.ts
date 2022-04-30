import mongoose from 'mongoose';
import { IAuthorDocument } from './Author';
import { IIssueDocument } from './Issue';
import { ITagDocument } from './Tag';

interface IComicDocument extends mongoose.Document {
  name: string;
  slug: string;
  isCompleted: boolean;
  releaseDate?: Date;
  coverImage?: string;
  summary?: string;
  totalViews: number;
  issues?: IIssueDocument[];
  authors?: IAuthorDocument[];
  tags?: ITagDocument[];
  createdAt: Date;
  updatedAt: Date;
}

const ComicSchema = new mongoose.Schema<IComicDocument>(
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
    isCompleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    releaseDate: Date,
    coverImage: String,
    summary: String,
    totalViews: Number,
    issues: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Issue',
      },
    ],
    authors: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Author',
      },
    ],
    tags: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Tag',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export { ComicSchema, type IComicDocument };
