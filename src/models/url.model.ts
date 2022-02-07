import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUrl  {
    _id?: string;
    original: string;
    shortened?: string;
    url_shortened?: string;
}

const UrlSchema = new mongoose.Schema (
    {
      url_original: { type: String, required: true },
      shortened: { type: String, required: true },
      createdAt: { type: Date, default: Date.now, required: true}
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
