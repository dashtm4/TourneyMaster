export const loadAll = async (endpoint, params = {}, requestParams = null) => {
  const objects = [];
  for await (const object of endpoint.list(
    {
      ...params,
      limit: 100,
    },
    requestParams
  )) {
    objects.push(object);
  }
  return objects;
};
