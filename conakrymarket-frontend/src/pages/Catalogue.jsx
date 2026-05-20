import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiFilter, FiSearch } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { getProduits } from '../services/produits';

const Catalogue = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Parse query params to initial state
  const getInitialFilters = useCallback(() => {
    const searchParams = new URLSearchParams(location.search);
    const initial = {};
    if (searchParams.has('categorie')) initial.categorie = searchParams.get('categorie').split(',');
    if (searchParams.has('minPrix')) initial.minPrix = searchParams.get('minPrix');
    if (searchParams.has('maxPrix')) initial.maxPrix = searchParams.get('maxPrix');
    if (searchParams.has('ville')) initial.ville = searchParams.get('ville');
    if (searchParams.has('search')) initial.search = searchParams.get('search');
    initial.page = searchParams.get('page') || 1;
    initial.sort = searchParams.get('sort') || '-createdAt';
    return initial;
  }, [location.search]);

  const [filters, setFilters] = useState(getInitialFilters());

  useEffect(() => {
    // Sync filters with URL
    const searchParams = new URLSearchParams();
    if (filters.categorie?.length) searchParams.set('categorie', filters.categorie.join(','));
    if (filters.minPrix) searchParams.set('minPrix', filters.minPrix);
    if (filters.maxPrix) searchParams.set('maxPrix', filters.maxPrix);
    if (filters.ville) searchParams.set('ville', filters.ville);
    if (filters.search) searchParams.set('search', filters.search);
    if (filters.page > 1) searchParams.set('page', filters.page);
    if (filters.sort !== '-createdAt') searchParams.set('sort', filters.sort);
    
    navigate({ search: searchParams.toString() }, { replace: true });
    
    // Fetch data
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getProduits(filters);
        setProducts(data.data || []);
        setTotalPages(data.pages || 1);
        setTotalProducts(data.total || 0);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [filters, navigate]);

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (e) => {
    setFilters({ ...filters, sort: e.target.value, page: 1 });
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-accent-dark">Catalogue</h1>
          <p className="text-gray-500 mt-1">{totalProducts} produits trouvés</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher un produit..." 
              value={filters.search || ''}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50"
            />
          </div>
          
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-gray-100 rounded-full text-accent-dark hover:bg-gray-200 transition-colors"
          >
            <FiFilter /> Filtres
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-72 shrink-0">
          <FilterSidebar 
            filters={filters} 
            setFilters={(f) => setFilters({...f, page: 1})} 
            isOpen={isFilterOpen} 
            setIsOpen={setIsFilterOpen} 
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Controls Bar */}
          <div className="flex justify-end items-center mb-6 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Trier par:</span>
              <select 
                value={filters.sort || '-createdAt'}
                onChange={handleSortChange}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
              >
                <option value="-createdAt">Plus récents</option>
                <option value="prix">Prix: Croissant</option>
                <option value="-prix">Prix: Décroissant</option>
                <option value="-note_moyenne">Meilleures notes</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white border border-gray-100 rounded-2xl h-96 shadow-sm">
                  <div className="h-60 bg-gray-200 rounded-t-2xl"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded w-full mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button 
                    onClick={() => handlePageChange(Number(filters.page) - 1)}
                    disabled={Number(filters.page) <= 1}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    Précédent
                  </button>
                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          Number(filters.page) === i + 1 
                          ? 'bg-primary text-white shadow-md shadow-primary/20' 
                          : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => handlePageChange(Number(filters.page) + 1)}
                    disabled={Number(filters.page) >= totalPages}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
              <div className="text-gray-300 mb-4 flex justify-center">
                <FiSearch size={64} />
              </div>
              <h3 className="text-2xl font-bold text-accent-dark mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Essayez de modifier vos filtres ou d'effectuer une nouvelle recherche.
              </p>
              <button 
                onClick={() => setFilters({ page: 1, sort: '-createdAt' })}
                className="mt-6 text-primary font-medium hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalogue;
