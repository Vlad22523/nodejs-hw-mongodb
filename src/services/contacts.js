import { contactsModel } from '../db/models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await contactsModel.find();
  return contacts;
};

export const getContactsById = async (contactId) => {
  const contact = await contactsModel.findById(contactId);
  return contact;
};

export const deleleteConatactsById = async (contactId) => {
  return await contactsModel.findOneAndDelete({ _id: contactId });
};

export const createContacts = async (payload) => {
  return await contactsModel.create(payload);
};

export const updateContact = async (id, payload, options = {}) => {
  const rawResult = await contactsModel.findOneAndUpdate({ _id: id }, payload, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
