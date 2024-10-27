const SORT_ORDERS = ['asc', 'desc'];
const SORT_BY_PROPERTIES = [
  '_id',
  'name',
  'phoneNumber',
  'isFavourite',
  'contactType',
  'createdAt',
  'updatedAt',
];

export const parseSortParams = (query) => {
  const sortOrder = SORT_ORDERS.includes(query.sortOrder)
    ? query.sortOrder
    : 'asc';

  const sortBy = SORT_BY_PROPERTIES.includes(query.sortBy)
    ? query.sortBy
    : '_id';
  return {
    sortOrder,
    sortBy,
  };
};
