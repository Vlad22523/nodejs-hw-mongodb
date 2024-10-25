import Joi from 'joi';

export const requestResetTokenValidationSchema = Joi.object({
  email: Joi.string().email().required(),
});
