const toHumanReadable = (date: Date) => {
  const d = new Date(date.toString());
  return d.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export { toHumanReadable };
