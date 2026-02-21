import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EventsProvider } from './context/EventsContext';
import { ChoresProvider } from './context/ChoresContext';
import { ShopProvider } from './context/ShopContext';
import { BottomNav } from './components/BottomNav';
import { Home } from './pages/Home';
import { Events } from './pages/Events';
import { Shop } from './pages/Shop';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { AddChore } from './pages/AddChore';
import { Hub } from './pages/Hub';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  const { currentUser } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/" replace />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/add" element={<ProtectedRoute><AddChore /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
        <Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
        <Route path="/hub" element={<ProtectedRoute><Hub /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>

      {/* Pokaż nawigację tylko, gdy zarejestrowany */}
      {currentUser && <BottomNav />}
    </>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ChoresProvider>
        <EventsProvider>
          <ShopProvider>
            <Router>
              <div className="app-layout">
                <AppRoutes />
              </div>
            </Router>
          </ShopProvider>
        </EventsProvider>
      </ChoresProvider>
    </AuthProvider>
  );
};

export default App;
