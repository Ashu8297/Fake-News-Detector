import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from './LoadingScreen';

export default function ProtectedRoute({ children, requiredRole, setActivePage }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user && setActivePage) {
      setActivePage('login');
    }
  }, [loading, user, setActivePage]);

  if (loading) {
    return <LoadingScreen message="Verifying authentication session..." />;
  }

  if (!user) {
    return null;
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-rose-600">Access Denied</h2>
        <p className="text-xs text-slate-500">You need {requiredRole.toUpperCase()} permissions to view this panel.</p>
      </div>
    );
  }

  return children;
}
