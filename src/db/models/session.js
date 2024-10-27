import { model, Schema } from 'mongoose';

const sessionsSchema = new Schema(
  {
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    accessTokenValidUntil: {
      type: Date,
      required: true,
    },
    refreshTokenValidUntil: { type: Date, required: true },
    userId: { type: Schema.ObjectId, required: true, ref: 'users' },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const SessionsModel = model('sessions', sessionsSchema);
