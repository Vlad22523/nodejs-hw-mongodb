import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUserController,
  logotUserController,
  refreshSessionController,
  registerUserController,
  requestGoogleAuthUrlController,
  requestResetPasswordTokenController,
  resetPasswordController,
  verifyGoogleOauthController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerUserValidationSchema } from '../validation/registerUserValidationSchema.js';
import { loginUserValidationSchema } from '../validation/loginUserValidationSchema.js';
import { requestResetTokenValidationSchema } from '../validation/requestResetPasswordTokenSchema.js';
import { resetPasswordValidationSchema } from '../validation/resetPasswordValidationSchema.js';
import { verifyGoogleValidationSchema } from '../validation/verifyGoogleValidationSchema.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserValidationSchema),
  ctrlWrapper(registerUserController),
);
authRouter.post(
  '/login',
  validateBody(loginUserValidationSchema),
  ctrlWrapper(loginUserController),
);
authRouter.post('/logout', ctrlWrapper(logotUserController));
authRouter.post('/refresh', ctrlWrapper(refreshSessionController));

authRouter.post(
  '/send-reset-email',
  validateBody(requestResetTokenValidationSchema),
  ctrlWrapper(requestResetPasswordTokenController),
);

authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordValidationSchema),
  ctrlWrapper(resetPasswordController),
);

authRouter.post(
  '/request-google-oauth-link',
  ctrlWrapper(requestGoogleAuthUrlController),
);
authRouter.post(
  '/verify-oauth',
  validateBody(verifyGoogleValidationSchema),
  ctrlWrapper(verifyGoogleOauthController),
);

export default authRouter;
