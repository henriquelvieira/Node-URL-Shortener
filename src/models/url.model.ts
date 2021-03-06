import mongoose, { Document, Model } from 'mongoose';

export interface IUrl {
  _id?: string;
  original: string;
  shortened?: string;
  urlShortened?: string;
  createdAt?: Date;
  lastAccessAt?: Date;
  counter?: number;
}

// export interface Url {
//   _id?: string;
//   original: string;
//   shortened: string;
//   createdAt?: Date;
//   lastAccessAt?: Date;
//   counter?: number;
// }

const UrlSchema = new mongoose.Schema(
  {
    original: { type: String, required: true },
    shortened: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, required: true },
    lastAccessAt: { type: Date, required: false },
    counter: { type: Number, required: false },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

interface UrlModel extends Omit<IUrl, '_id'>, Document {}

export const Url: Model<UrlModel> = mongoose.model('URL', UrlSchema);
