export const getDays = (day: number, d: Date) => {
  const month = d.getMonth();
  const days = [];

  d.setDate(1);

  while (d.getDay() !== day) {
    d.setDate(d.getDate() + 1);
  }

  while (d.getMonth() === month) {
    days.push(new Date(d.getTime()).toISOString());
    d.setDate(d.getDate() + 7);
  }

  return days;
};

export const getDay = (date: string) => {
  return new Date(JSON.parse(date)[0]).getDay();
};
