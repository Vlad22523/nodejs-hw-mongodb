import { contactsModel } from '../db/models/contacts.js';
import { createPaginationData } from '../utils/validation/createPagination.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = 'asc',
  sortBy = '_id',
  filter = {},
  userId,
}) => {
  const skip = (page - 1) * perPage;
  const contactsQuery = contactsModel.find({ userId });

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [count, contacts] = await Promise.all([
    contactsModel.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(perPage)
      .sort({
        [sortBy]: sortOrder,
      }),
  ]);

  return {
    data: contacts,
    ...createPaginationData(count, page, perPage),
  };
};

export const getContactsById = async (contactId, userId) => {
  console.log('Searching contact with conditions:', { _id: contactId, userId });
  const contact = await contactsModel.findOne({ _id: contactId, userId });
  return contact;
};

export const deleleteConatactsById = async (contactId, userId) => {
  return await contactsModel.findOneAndDelete({ _id: contactId, userId });
};

export const createContacts = async (payload, userId) => {
  return await contactsModel.create({ ...payload, userId });
};

export const updateContact = async (id, payload, userId, options = {}) => {
  const rawResult = await contactsModel.findOneAndUpdate(
    { _id: id, userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
