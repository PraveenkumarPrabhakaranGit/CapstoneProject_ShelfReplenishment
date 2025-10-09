import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const isAuth = localStorage.getItem('shelfmind_auth');
    const userData = localStorage.getItem('shelfmind_user');
    
    if (isAuth && userData) {
      const user = JSON.parse(userData);
      // Navigate based on user role
      if (user.role === 'associate') {
        navigate('/associate');
      } else if (user.role === 'manager') {
        navigate('/manager');
      } else {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading ShelfMind...</p>
      </div>
    </div>
  );
};

export default Index;