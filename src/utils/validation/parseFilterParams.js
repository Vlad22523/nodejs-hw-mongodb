const parseType = (contactType) => {
  const isString = typeof contactType === 'string';
  if (!isString) return;
  const isType = (contactType) =>
    ['work', 'home', 'personal'].includes(contactType);

  if (isType(contactType)) return contactType;
};

const parseFavourite = (value) => {
  const isString = typeof value === 'string';
  if (!isString) return;
  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;

  return undefined;
};

export const parseFilterParams = (query) => {
  const { contactType, isFavourite } = query;

  const parsedType = parseType(contactType);
  const parsedIsFavourite = parseFavourite(isFavourite);

  return {
    contactType: parsedType,
    isFavourite: parsedIsFavourite,
  };
};

// const BOOLEANS = ['true', 'false'];
// const parseBoolean = (value) => {
//   if (!BOOLEANS.includes(value)) return;
//   return value === 'true' ? true : false;
// };

// const TYPES = ['work', 'home', 'personal'];
// const parseTypes = (value) => {
//   if (TYPES.includes(value)) return value;
// };

// export const parseFilterParams = (query) => {
//   return {
//     contactType: parseTypes(query.contactType),
//     isFavourite: parseBoolean(query.isFavourite),
//   };
// };
