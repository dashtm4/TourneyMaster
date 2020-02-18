export const getTournamentStatusColor = (status: string) => {
  switch (status) {
    case 'Draft':
      return { backgroundColor: '#ffcb00' };
    case 'Published':
      return { backgroundColor: '#00cc47' };
    default:
      return null;
  }
};
