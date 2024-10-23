import createHttpError from 'http-errors';
import {
  createContacts,
  deleleteConatactsById,
  getAllContacts,
  getContactsById,
  updateContact,
} from '../services/contacts.js';
import { validatePaginationParams } from '../utils/validation/parsePaginationParams.js';
import { parseSortParams } from '../utils/validation/parseSortParams.js';
import { parseFilterParams } from '../utils/validation/parseFilterParams.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = validatePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const userId = req.user._id;

  const paginatedContacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: paginatedContacts,
  });
};

export const getContactsByIdController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await getContactsById(contactId, req.user._id);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  return res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const deleteContactsByIdController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await deleleteConatactsById(contactId, req.user._id);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};

export const createContactsController = async (req, res) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  const newContactData = {
    name,
    phoneNumber,
    contactType,
  };

  if (email) {
    newContactData.email = email;
  }

  if (typeof isFavourite !== 'undefined') {
    newContactData.isFavourite = isFavourite;
  }

  const newContact = await createContacts(newContactData, req.user._id);

  res.status(201).send({
    status: 201,
    message: `Successfully created a contact!`,
    data: newContact,
  });
};

export const patchContactsControllers = async (req, res, next) => {
  const id = req.params.contactId;
  const { body } = req;
  const result = await updateContact(id, body, req.user._id);

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.send({
    status: 200,
    message: `Successfully created a contact!`,
    data: result.contact,
  });
};
