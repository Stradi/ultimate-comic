import mongoose from 'mongoose';
import { IAuthorDocument } from './Author';
import { IIssueDocument } from './Issue';
import { ITagDocument } from './Tag';

interface IComicDocument extends mongoose.Document {
  name: string;
  slug: string;
  viewCount: number;
  isCompleted: boolean;
  releaseDate: Date;
  coverImage?: string;
  summary?: string;
  authors?: IAuthorDocument[];
  tags?: ITagDocument[];
  issues?: IIssueDocument[];
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
    viewCount: {
      type: Number,
      required: true,
      default: 0,
    },
    releaseDate: {
      type: Date,
      required: true,
      default: new Date(Date.now()),
    },
    coverImage: {
      type: String,
      required: false,
      default: null,
    },
    summary: {
      type: String,
      required: false,
      default: null,
    },
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
