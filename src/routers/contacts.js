import { Router } from 'express';
import {
  createContactsController,
  deleteContactsByIdController,
  getContactsByIdController,
  getContactsController,
  patchContactsControllers,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(getContactsController));

contactsRouter.get('/:contactId', ctrlWrapper(getContactsByIdController));

contactsRouter.post('/', ctrlWrapper(createContactsController));

contactsRouter.patch('/:contactId', ctrlWrapper(patchContactsControllers));

contactsRouter.delete('/:contactId', ctrlWrapper(deleteContactsByIdController));

export default contactsRouter;
