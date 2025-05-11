import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OAuth2RedirectHandler from "./pages/OAuth2RedirectHandler";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import UserProfilePage from "./pages/UserProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import SearchPage from "./pages/SearchPage";

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#8FBC8B', // Your existing emerald color
      light: '#20B2AA',
      dark: '#2E8B57',
    },
    secondary: {
      main: '#6B7280', // Gray color
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

const App = () => {
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem("userId");

  useEffect(() => {
    // Optionally, you can set a timeout or check session expiry logic here.
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <div style={{ minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
          {/* Conditionally render Navbar based on authentication */}
          {isAuthenticated && <Navbar />}
          
          <Routes>
            {/* OAuth2 Redirect Handler */}
            <Route path="/login/oauth2/code/google" element={<OAuth2RedirectHandler />} />

            {/* Protected Routes */}
            <Route
              path="/profile"
              element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/notifications"
              element={isAuthenticated ? <NotificationsPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/user-profile/:id"
              element={isAuthenticated ? <UserProfilePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/search"
              element={isAuthenticated ? <SearchPage /> : <Navigate to="/login" />}
            />

            {/* Public Routes (without Navbar) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* HomePage (protected route with Navbar) */}
            <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
