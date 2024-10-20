import { contactsModel } from '../db/models/contacts.js';
import { createPaginationData } from '../utils/validation/createPagination.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = 'asc',
  sortBy = '_id',
  filter = {},
}) => {
  const skip = (page - 1) * perPage;
  const contactsQuery = contactsModel.find();

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [count, contacts] = await Promise.all([
    contactsModel.find().merge(contactsQuery).countDocuments(),
    contactsModel
      .find()
      .skip(skip)
      .limit(perPage)
      .sort({
        [sortBy]: sortOrder,
      }),
  ]);

  return {
    contacts,
    ...createPaginationData(count, page, perPage),
  };
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
