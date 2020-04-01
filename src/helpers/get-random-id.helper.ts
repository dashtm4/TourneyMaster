import shortid from 'shortid';

const getVarcharEight = () => {
  shortid.characters(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
  );
  return shortid.generate();
};

export { getVarcharEight };
