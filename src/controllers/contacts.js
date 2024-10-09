import createHttpError from 'http-errors';
import {
  createContacts,
  deleleteConatactsById,
  getAllContacts,
  getContactsById,
  updateContact,
} from '../services/contacts.js';

export const getContactsController = async (req, res) => {
  const contacts = await getAllContacts();

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactsByIdController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await getContactsById(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  return res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const deleteContactsByIdController = async (req, res) => {
  const { contactId } = req.params;

  await deleleteConatactsById(contactId);

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

  const newContact = await createContacts(newContactData);

  res.status(201).send({
    status: 201,
    message: `Successfully created a contact!`,
    data: newContact,
  });
};

export const patchContactsControllers = async (req, res, next) => {
  const id = req.params.contactId;
  const { body } = req;
  const contact = await updateContact(id, body);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.send({
    status: 200,
    message: `Successfully created a contact!`,
    data: contact,
  });
};
