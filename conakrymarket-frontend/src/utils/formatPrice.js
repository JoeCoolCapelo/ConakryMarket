export const formatPrice = (price) => {
  if (price === undefined || price === null) return '';
  return new Intl.NumberFormat('fr-GN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price).replace(/,/g, ' ') + ' GNF';
};
