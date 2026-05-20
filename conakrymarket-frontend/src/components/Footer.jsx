import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiFacebook, FiTwitter, FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-lg text-white">
                <FiShoppingBag size={24} />
              </div>
              <span className="font-bold text-xl text-accent-dark">
                ConakryMarket
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              La première marketplace de Guinée. Achetez et vendez des produits locaux et internationaux en toute sécurité.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-all"><FiFacebook size={20} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-all"><FiTwitter size={20} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-all"><FiInstagram size={20} /></a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="font-bold text-lg text-accent-dark mb-4">Liens rapides</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-500 hover:text-primary transition-colors">Accueil</Link></li>
              <li><Link to="/catalogue" className="text-gray-500 hover:text-primary transition-colors">Catalogue</Link></li>
              <li><Link to="/connexion" className="text-gray-500 hover:text-primary transition-colors">Connexion</Link></li>
              <li><Link to="/inscription" className="text-gray-500 hover:text-primary transition-colors">Devenir vendeur</Link></li>
            </ul>
          </div>

          {/* Catégories */}
          <div>
            <h3 className="font-bold text-lg text-accent-dark mb-4">Catégories</h3>
            <ul className="space-y-3">
              <li><Link to="/catalogue?categorie=Électronique" className="text-gray-500 hover:text-primary transition-colors">Électronique</Link></li>
              <li><Link to="/catalogue?categorie=Vêtements" className="text-gray-500 hover:text-primary transition-colors">Mode & Vêtements</Link></li>
              <li><Link to="/catalogue?categorie=Alimentation" className="text-gray-500 hover:text-primary transition-colors">Alimentation</Link></li>
              <li><Link to="/catalogue?categorie=Équipement agricole" className="text-gray-500 hover:text-primary transition-colors">Agriculture</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg text-accent-dark mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-primary mt-1 shrink-0" size={18} />
                <span className="text-gray-500">Kaloum, Conakry, République de Guinée</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-primary shrink-0" size={18} />
                <span className="text-gray-500">+224 620 00 00 00</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-primary shrink-0" size={18} />
                <span className="text-gray-500">contact@conakrymarket.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} ConakryMarket. Tous droits réservés.
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <a href="#" className="hover:text-primary transition-colors">Conditions générales</a>
            <a href="#" className="hover:text-primary transition-colors">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
