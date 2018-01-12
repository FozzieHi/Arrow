const formatter = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});

module.exports = (num) => {
  return formatter.format(num / 100);
};
