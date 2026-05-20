import React, { useState } from 'react';
import { FiStar, FiThumbsUp } from 'react-icons/fi';
import { formatDate } from '../utils/formatDate';
import { incrementUtile } from '../services/avis';
import toast from 'react-hot-toast';

const ReviewCard = ({ avis, productId }) => {
  const [utileCount, setUtileCount] = useState(avis.utile || 0);
  const [hasVoted, setHasVoted] = useState(false);

  const handleUtile = async () => {
    if (hasVoted) return;
    try {
      await incrementUtile(productId, avis._id);
      setUtileCount(prev => prev + 1);
      setHasVoted(true);
    } catch (error) {
      toast.error('Erreur lors du vote');
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white font-bold text-lg">
            {avis.client?.nom?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-semibold text-accent-dark">{avis.client?.nom || 'Utilisateur anonyme'}</p>
            <p className="text-xs text-gray-500">{formatDate(avis.createdAt)}</p>
          </div>
        </div>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <FiStar 
              key={i} 
              className={i < avis.note ? "text-yellow-400 fill-current" : "text-gray-200"} 
              size={18}
            />
          ))}
        </div>
      </div>
      
      <p className="text-gray-700 mt-3 leading-relaxed">
        {avis.commentaire}
      </p>
      
      <div className="mt-4 flex items-center gap-2">
        <button 
          onClick={handleUtile}
          disabled={hasVoted}
          className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border transition-colors ${
            hasVoted 
            ? 'bg-secondary/10 text-secondary border-secondary/20' 
            : 'text-gray-500 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <FiThumbsUp size={14} className={hasVoted ? "fill-current" : ""} />
          <span>Utile ({utileCount})</span>
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
