exports.calculerSousTotal = (prix, quantite) => prix * quantite;

exports.calculerMontantTotal = (articles) => {
  return articles.reduce((total, article) => total + (article.prix_unit * article.quantite), 0);
};
