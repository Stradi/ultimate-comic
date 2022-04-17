import mongoose from 'mongoose';

interface IIssueDocument extends mongoose.Document {
  name: string;
  slug: string;
  comic?: mongoose.Types.ObjectId;
  images?: mongoose.Types.Array<string>;
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
    images: [String],
  },
  {
    timestamps: true,
  }
);

export { type IIssueDocument, IssueSchema };
