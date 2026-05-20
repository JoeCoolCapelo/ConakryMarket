import React from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('Erreur interceptée par ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-red-100">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiAlertTriangle size={40} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">Oups ! Une erreur est survenue.</h1>
            <p className="text-gray-500 mb-8">
              Nous sommes désolés, une erreur inattendue s'est produite lors de l'affichage de cette page.
            </p>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
            >
              <FiRefreshCw size={18} />
              Recharger la page
            </button>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-8 text-left bg-gray-100 p-4 rounded-xl overflow-auto text-xs text-red-600 max-h-48">
                <p className="font-bold mb-1">{this.state.error.toString()}</p>
                <p className="whitespace-pre-wrap">{this.state.errorInfo?.componentStack}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
