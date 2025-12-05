import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { AIAssistant } from './pages/AIAssistant';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './pages/AdminLogin';
import { db } from './services/storage';

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = db.getUser();
  if (!user.isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/series" element={<Search />} />
          <Route path="/movies" element={<Search />} />
          <Route path="/latest" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/ai" element={<AIAssistant />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;