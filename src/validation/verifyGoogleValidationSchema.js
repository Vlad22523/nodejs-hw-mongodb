import Joi from 'joi';

export const verifyGoogleValidationSchema = Joi.object({
  code: Joi.string().required(),
});
