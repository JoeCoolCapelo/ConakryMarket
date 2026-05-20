import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';
import { createAvis } from '../services/avis';
import { getProduit } from '../services/produits';
import toast from 'react-hot-toast';

const NewReview = () => {
  const { pid } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [note, setNote] = useState(0);
  const [hoverNote, setHoverNote] = useState(0);
  const [commentaire, setCommentaire] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduit(pid);
        setProduct(data);
      } catch (error) {
        toast.error("Erreur de chargement du produit");
      }
    };
    fetchProduct();
  }, [pid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (note === 0) {
      toast.error('Veuillez sélectionner une note');
      return;
    }
    if (!commentaire.trim()) {
      toast.error('Veuillez écrire un commentaire');
      return;
    }

    setLoading(true);
    try {
      await createAvis(pid, { note, commentaire });
      toast.success('Votre avis a été publié !');
      navigate(`/produit/${pid}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de la publication de l'avis");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <div className="p-10 text-center">Chargement...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link to={`/produit/${pid}`} className="text-gray-500 hover:text-primary mb-6 inline-block font-medium">
        ← Retour au produit
      </Link>
      
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
        <h1 className="text-3xl font-black text-accent-dark mb-6">Écrire un avis</h1>
        
        <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
          <img 
            src={product.images?.[0] || 'https://via.placeholder.com/100'} 
            alt={product.nom} 
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div>
            <h2 className="font-bold text-gray-800 line-clamp-1">{product.nom}</h2>
            <p className="text-sm text-gray-500">{product.categorie}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 text-center">
              Quelle note donnez-vous à ce produit ?
            </label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverNote(star)}
                  onMouseLeave={() => setHoverNote(0)}
                  onClick={() => setNote(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <FiStar
                    size={48}
                    className={`${
                      star <= (hoverNote || note)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-200"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">
              {note === 1 && 'Très mauvais'}
              {note === 2 && 'Mauvais'}
              {note === 3 && 'Moyen'}
              {note === 4 && 'Bon'}
              {note === 5 && 'Excellent !'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Votre commentaire
            </label>
            <textarea
              required
              rows={5}
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              placeholder="Partagez votre expérience avec ce produit... Qu'avez-vous aimé ? Que pourrait-on améliorer ?"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/30 disabled:opacity-70"
          >
            {loading ? 'Publication...' : 'Publier mon avis'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewReview;
