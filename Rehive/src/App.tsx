import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './store/useApp';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Login, Register } from './pages/Auth';
import { Home } from './pages/Home';
import { Rent } from './pages/Rent';
import { Donate } from './pages/Donate';
import { Repair } from './pages/Repair';
import { Reuse } from './pages/Reuse';
import { AddItem } from './pages/AddItem';
import { Profile } from './pages/Profile';
import { Impact } from './pages/Impact';
// 1. Naye page ko import kiya
import { MyItems } from './pages/MyItems'; 

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4" />
          <p className="text-gray-600">Loading ReHive...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4" />
          <p className="text-gray-600">Loading ReHive...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/rent" element={<ProtectedRoute><Rent /></ProtectedRoute>} />
        <Route path="/donate" element={<ProtectedRoute><Donate /></ProtectedRoute>} />
        <Route path="/repair" element={<ProtectedRoute><Repair /></ProtectedRoute>} />
        <Route path="/reuse" element={<ProtectedRoute><Reuse /></ProtectedRoute>} />
        <Route path="/add-item" element={<ProtectedRoute><AddItem /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/impact" element={<ProtectedRoute><Impact /></ProtectedRoute>} />
        <Route path="/saved" element={<ProtectedRoute><div className="pt-24 text-center"><h1 className="text-2xl font-bold">Saved Items</h1><p className="text-gray-600 mt-4">Coming soon!</p></div></ProtectedRoute>} />
        
        {/* 2. Route update kar diya */}
        <Route path="/my-items" element={<ProtectedRoute><MyItems /></ProtectedRoute>} />
        
        <Route path="/settings" element={<ProtectedRoute><div className="pt-24 text-center"><h1 className="text-2xl font-bold">Settings</h1><p className="text-gray-600 mt-4">Coming soon!</p></div></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App; 
