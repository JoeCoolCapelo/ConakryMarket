require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const Client = require('../src/models/Client');
const Produit = require('../src/models/Produit');
const Commande = require('../src/models/Commande');
const Avis = require('../src/models/Avis');

const runSeed = async () => {
  await connectDB();
  
  await Client.deleteMany();
  await Produit.deleteMany();
  await Commande.deleteMany();
  await Avis.deleteMany();

  console.log('Old data dropped.');

  const villes = ['Conakry', 'Kindia', 'Kankan', 'Labé', 'Mamou', 'Nzérékoré'];
  const noms = ['Diallo', 'Bah', 'Barry', 'Sow', 'Camara', 'Touré', 'Sylla', 'Keita', 'Condé', 'Diaby'];
  
  const clients = [];
  for (let i = 1; i <= 50; i++) {
    clients.push({
      uid: `C${1000 + i}`,
      nom: `${noms[i % noms.length]} ${i}`,
      telephone: `+22462${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
      email: `user${i}@test.com`,
      mot_de_passe: 'password123',
      ville: villes[Math.floor(Math.random() * villes.length)],
      age: 18 + Math.floor(Math.random() * 40),
      role: i <= 10 ? 'vendeur' : 'client'
    });
  }
  const createdClients = await Client.create(clients);
  const vendeurs = createdClients.filter(c => c.role === 'vendeur');
  
  const categories = ['Électronique', 'Vêtements', 'Alimentation', 'Équipement agricole'];
  const produits = [];
  for (let i = 1; i <= 200; i++) {
    const categorie = categories[Math.floor(Math.random() * categories.length)];
    const prix = Math.floor(Math.random() * 500) * 10000 + 10000;
    const p = {
      pid: `P${1000 + i}`,
      nom: `Produit ${i}`,
      vendeur_uid: vendeurs[Math.floor(Math.random() * vendeurs.length)].uid,
      categorie,
      prix,
      stock: Math.floor(Math.random() * 100) + 5,
      ville_vendeur: villes[Math.floor(Math.random() * villes.length)],
      description: 'Description du produit',
      note_moyenne: 0
    };
    if (categorie === 'Électronique') { p.marque = 'MarqueX'; }
    if (categorie === 'Vêtements') { p.taille = ['M', 'L']; }
    if (categorie === 'Alimentation') { p.poids_kg = 1; }
    if (categorie === 'Équipement agricole') { p.puissance_w = 1000; }
    produits.push(p);
  }
  const createdProduits = await Produit.create(produits);

  const commandes = [];
  for (let i = 1; i <= 500; i++) {
    const isLivre = Math.random() < 0.6;
    const isAnnule = !isLivre && Math.random() < 0.25;
    const statut = isLivre ? 'livré' : (isAnnule ? 'annulé' : 'en_attente');
    
    const d = new Date();
    d.setMonth(d.getMonth() - Math.floor(Math.random() * 12));
    
    const articles = [];
    let montant_total = 0;
    const nbArt = 1 + Math.floor(Math.random() * 5);
    for (let j = 0; j < nbArt; j++) {
      const p = createdProduits[Math.floor(Math.random() * createdProduits.length)];
      const quantite = 1 + Math.floor(Math.random() * 3);
      const sous_total = p.prix * quantite;
      montant_total += sous_total;
      articles.push({
        pid: p.pid,
        nom: p.nom,
        categorie: p.categorie,
        quantite,
        prix_unit: p.prix,
        sous_total
      });
    }

    commandes.push({
      oid: `O${10000 + i}`,
      client_uid: createdClients[Math.floor(Math.random() * createdClients.length)].uid,
      date_commande: d,
      statut,
      articles,
      montant_total,
      mode_paiement: 'Espèces',
      adresse_livraison: { ville: villes[Math.floor(Math.random() * villes.length)], quartier: 'Centre', details: '' },
      date_livraison: isLivre ? d : null
    });
  }
  await Commande.create(commandes);

  const avisList = [];
  for (let i = 1; i <= 100; i++) {
    avisList.push({
      pid: createdProduits[Math.floor(Math.random() * createdProduits.length)].pid,
      client_uid: createdClients[Math.floor(Math.random() * createdClients.length)].uid,
      note: 1 + Math.floor(Math.random() * 5),
      commentaire: 'Super !',
      utile: Math.floor(Math.random() * 10)
    });
  }
  await Avis.create(avisList);

  console.log('Seed completed successfully.');
  process.exit();
};

runSeed();
