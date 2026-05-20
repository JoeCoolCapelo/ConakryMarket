import React, { useState } from 'react';
import { FiFilter, FiChevronDown, FiChevronUp, FiX, FiRefreshCw } from 'react-icons/fi';

const CATEGORIES = ['Électronique', 'Vêtements', 'Alimentation', 'Équipement agricole'];
const CITIES = ['Conakry', 'Kindia', 'Labé', 'Kankan', 'Nzérékoré', 'Boké'];

const FilterSidebar = ({ filters, setFilters, isOpen, setIsOpen }) => {
  const [isCatOpen, setIsCatOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isCityOpen, setIsCityOpen] = useState(true);

  const handleCategoryChange = (cat) => {
    const updatedCats = filters.categorie?.includes(cat)
      ? filters.categorie.filter(c => c !== cat)
      : [...(filters.categorie || []), cat];
    setFilters({ ...filters, categorie: updatedCats });
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleCityChange = (e) => {
    setFilters({ ...filters, ville: e.target.value });
  };

  const resetFilters = () => {
    setFilters({});
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:shadow-none lg:w-full lg:bg-transparent lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col overflow-y-auto">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between lg:hidden">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FiFilter className="text-primary" /> Filtres
            </h2>
            <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <FiX size={24} />
            </button>
          </div>

          <div className="p-5 lg:p-0 lg:pr-6 space-y-6">
            <div className="hidden lg:flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <FiFilter className="text-primary" /> Filtres
              </h2>
              {Object.keys(filters).length > 0 && (
                <button 
                  onClick={resetFilters} 
                  className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                  title="Réinitialiser les filtres"
                >
                  <FiRefreshCw size={18} />
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="bg-white lg:rounded-2xl lg:border lg:border-gray-100 lg:p-5 lg:shadow-sm">
              <button 
                className="flex items-center justify-between w-full font-semibold text-gray-800 mb-3"
                onClick={() => setIsCatOpen(!isCatOpen)}
              >
                Catégories
                {isCatOpen ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {isCatOpen && (
                <div className="space-y-2 mt-2">
                  {CATEGORIES.map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox" 
                          className="peer sr-only"
                          checked={filters.categorie?.includes(cat) || false}
                          onChange={() => handleCategoryChange(cat)}
                        />
                        <div className="w-5 h-5 border-2 border-gray-300 rounded group-hover:border-primary peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                        <svg className="absolute w-3 h-3 text-white left-1 pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-600 group-hover:text-gray-900 transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Price */}
            <div className="bg-white lg:rounded-2xl lg:border lg:border-gray-100 lg:p-5 lg:shadow-sm">
              <button 
                className="flex items-center justify-between w-full font-semibold text-gray-800 mb-3"
                onClick={() => setIsPriceOpen(!isPriceOpen)}
              >
                Prix (GNF)
                {isPriceOpen ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {isPriceOpen && (
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Min</label>
                    <input 
                      type="number" 
                      name="minPrix"
                      value={filters.minPrix || ''}
                      onChange={handlePriceChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Max</label>
                    <input 
                      type="number" 
                      name="maxPrix"
                      value={filters.maxPrix || ''}
                      onChange={handlePriceChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Max"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* City */}
            <div className="bg-white lg:rounded-2xl lg:border lg:border-gray-100 lg:p-5 lg:shadow-sm">
              <button 
                className="flex items-center justify-between w-full font-semibold text-gray-800 mb-3"
                onClick={() => setIsCityOpen(!isCityOpen)}
              >
                Ville du vendeur
                {isCityOpen ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {isCityOpen && (
                <div className="mt-2">
                  <select 
                    value={filters.ville || ''}
                    onChange={handleCityChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Toutes les villes</option>
                    {CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="lg:hidden mt-auto pt-6">
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-colors shadow-md shadow-primary/20"
              >
                Appliquer les filtres
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
