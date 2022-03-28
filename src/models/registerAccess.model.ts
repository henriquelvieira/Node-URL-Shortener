import mongoose, { Document, Model } from 'mongoose';

export interface IRegisterAccess {
  _id?: string;
  url?: string;
  agent?: string;
  createdAt?: Date;
}

const RegisterAccessSchema = new mongoose.Schema(
  {
    url: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'URL',
      required: true,
    },
    agent: { type: String, required: false },
    createdAt: { type: Date, default: Date.now, required: true },
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

interface RegisterAccessModel extends Omit<IRegisterAccess, '_id'>, Document {}

export const RegisterAccess: Model<RegisterAccessModel> = mongoose.model(
  'REGISTER_ACCESS',
  RegisterAccessSchema
);
