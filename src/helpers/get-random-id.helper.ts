const getVarcharEight = () =>
  Array.apply(0, Array(8))
    .map(() =>
      (charset => charset.charAt(Math.floor(Math.random() * charset.length)))(
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      )
    )
    .join('');

export { getVarcharEight };
