require('dotenv').config();
const mongoose = require('mongoose');
const Produit = require('../src/models/Produit');

const categoryImages = {
  'Électronique': [
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80', // laptop
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80', // phone
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', // headphones
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80' // watch
  ],
  'Vêtements': [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', // t-shirt
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80', // jacket
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80', // sneakers
    'https://images.unsplash.com/photo-1550639525-c97d455acf70?w=800&q=80' // dress
  ],
  'Alimentation': [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80', // groceries
    'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=800&q=80', // fruits/veg
    'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=800&q=80', // fresh market
    'https://images.unsplash.com/photo-1588825838485-64537dc2eb70?w=800&q=80' // coffee/beans
  ],
  'Équipement agricole': [
    'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&q=80', // tractor/farm
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80', // wheat/field
    'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80', // farming tools
    'https://images.unsplash.com/photo-1599839619722-39751411ea63?w=800&q=80' // agriculture machinery
  ]
};

const updateImages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB.');

    const produits = await Produit.find();
    let updatedCount = 0;

    for (const produit of produits) {
      if (produit.images.length === 0 || produit.images[0].includes('placeholder')) {
        const categoryImgArray = categoryImages[produit.categorie];
        if (categoryImgArray) {
          const randomImage = categoryImgArray[Math.floor(Math.random() * categoryImgArray.length)];
          produit.images = [randomImage];
          await produit.save();
          updatedCount++;
        }
      }
    }

    console.log(`${updatedCount} produits ont été mis à jour avec de nouvelles images.`);
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la mise à jour :', error);
    process.exit(1);
  }
};

updateImages();
