const generateAbbrName = (title: string) =>
  title.replace(/(\w)\w*\W*/g, (_, i) => i.toUpperCase());

export { generateAbbrName };
