require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const Client = require('../src/models/Client');
const Produit = require('../src/models/Produit');
const Commande = require('../src/models/Commande');
const Avis = require('../src/models/Avis');
const Abonnement = require('../src/models/Abonnement');

const categoryImages = {
  'Électronique': [
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80'
  ],
  'Vêtements': [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80',
    'https://images.unsplash.com/photo-1550639525-c97d455acf70?w=800&q=80'
  ],
  'Alimentation': [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
    'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=800&q=80',
    'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=800&q=80',
    'https://images.unsplash.com/photo-1588825838485-64537dc2eb70?w=800&q=80'
  ],
  'Équipement agricole': [
    'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&q=80',
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80',
    'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80',
    'https://images.unsplash.com/photo-1599839619722-39751411ea63?w=800&q=80'
  ]
};

const categoryImageIndex = {
  'Électronique': 0,
  'Vêtements': 0,
  'Alimentation': 0,
  'Équipement agricole': 0
};

const getNextImage = (categorie) => {
  const imgs = categoryImages[categorie] || [];
  if (imgs.length === 0) return '';
  const idx = categoryImageIndex[categorie] % imgs.length;
  categoryImageIndex[categorie]++;
  return imgs[idx];
};

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
      note_moyenne: 0,
      images: [getNextImage(categorie)]
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

  // ─── Abonnements vendeurs ─────────────────────────────────────────────────
  await Abonnement.deleteMany();
  const abonnements = [];
  
  // Vendeurs : 10 au total
  // 0-4 : Actifs (5 vendeurs)
  // 5-6 : Bloqués (2 vendeurs)
  // 7-9 : Sans abonnement (3 vendeurs)
  
  for (let i = 0; i < vendeurs.length; i++) {
    const v = vendeurs[i];
    
    if (i >= 7) {
      // Sans abonnement
      await Client.findOneAndUpdate({ uid: v.uid }, {
        statut_abonnement: 'aucun',
        compte_bloque: false,
        date_fin_abonnement: null
      });
      continue; // Ne pas créer d'abonnement
    }

    const isExpire = i >= 5; // index 5 et 6
    const type = Math.random() < 0.5 ? 'mensuel' : 'annuel';
    const montant = type === 'mensuel' ? 50000 : 500000;
    
    let date_debut, date_fin, statut;
    if (isExpire) {
      // Abonnement expiré il y a 10 jours
      date_debut = new Date();
      date_debut.setMonth(date_debut.getMonth() - 1);
      date_fin = new Date();
      date_fin.setDate(date_fin.getDate() - 10);
      statut = 'bloqué';
    } else {
      // Abonnement actif
      date_debut = new Date();
      date_fin = new Date();
      if (type === 'mensuel') {
        date_fin.setMonth(date_fin.getMonth() + 1);
      } else {
        date_fin.setFullYear(date_fin.getFullYear() + 1);
      }
      statut = 'actif';
    }

    abonnements.push({
      vendeur_uid: v.uid,
      type,
      montant,
      statut,
      date_debut,
      date_fin,
      date_paiement: date_debut,
    });

    // Mettre à jour le statut abonnement du vendeur
    await Client.findOneAndUpdate({ uid: v.uid }, {
      statut_abonnement: statut === 'bloqué' ? 'bloqué' : 'actif',
      compte_bloque: statut === 'bloqué',
      date_fin_abonnement: date_fin
    });

    // Si bloqué, masquer ses produits
    if (isExpire) {
      await Produit.updateMany({ vendeur_uid: v.uid }, { actif: false });
    }
  }
  await Abonnement.create(abonnements);
  console.log(`${abonnements.length} abonnements créés (${abonnements.filter(a => a.statut === 'actif').length} actifs, ${abonnements.filter(a => a.statut === 'bloqué').length} bloqués)`);

  console.log('Seed completed successfully.');
  process.exit();
};

runSeed();
