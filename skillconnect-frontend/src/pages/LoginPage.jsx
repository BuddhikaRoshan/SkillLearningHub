import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import userApi from "../api/userApi";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
  Link,
  Divider,
} from "@mui/material";

// BubbleBackground (unchanged, still uses inline styles)
const BubbleBackground = () => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const initialBubbles = Array.from({ length: 15 }, () => createBubble());
    setBubbles(initialBubbles);

    const interval = setInterval(() => {
      setBubbles((prevBubbles) =>
        prevBubbles.map((bubble) => {
          const newY = bubble.y - bubble.speed;
          if (newY < -100) return createBubble(true);
          return {
            ...bubble,
            y: newY,
            x: bubble.x + Math.sin(newY * 0.05) * bubble.wobble,
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const createBubble = (atBottom = false) => {
    const viewportWidth = window.innerWidth;
    return {
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * viewportWidth,
      y: atBottom
        ? window.innerHeight + Math.random() * 100
        : Math.random() * window.innerHeight,
      size: Math.random() * 40 + 10,
      opacity: Math.random() * 0.2 + 0.05,
      speed: Math.random() * 2 + 0.5,
      wobble: Math.random() * 1.5,
    };
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {bubbles.map((bubble) => (
        <Box
          key={bubble.id}
          sx={{
            position: "absolute",
            borderRadius: "50%",
            background: "linear-gradient(to bottom right, #6ee7b7, #34d399)",
            left: bubble.x,
            top: bubble.y,
            width: bubble.size,
            height: bubble.size,
            opacity: bubble.opacity,
            transform: `scale(${1 + Math.sin(bubble.y * 0.01) * 0.1})`,
          }}
        />
      ))}
    </Box>
  );
};

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await userApi.login(credentials);
      window.location.href = "/";
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    userApi.initiateGoogleLogin();
  };

  return (
    <Container maxWidth="lg" sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", px: 2 }}>
      <BubbleBackground />

      <Paper
        elevation={6}
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: 1100,
          borderRadius: 4,
          p: 4,
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255,255,255,0.7)",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Left Greeting */}
        <Box flex={1} display="flex" alignItems="center" justifyContent="center" p={2}>
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <Typography variant="h4" fontWeight="bold" textAlign="center">
              Welcome to SkillConnect Learning Hub! Please sign in to your account.
            </Typography>
          </motion.div>
        </Box>

        {/* Right Login Form */}
        <Box flex={1} display="flex" alignItems="center" justifyContent="center" p={2}>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", maxWidth: 400 }}>
            <Typography variant="h5" fontWeight="bold" textAlign="center">
              Sign in to your account
            </Typography>
            <Typography variant="body2" textAlign="center" mt={1}>
              Or{" "}
              <Link
                component={RouterLink}
                to="/register"
                underline="hover"
                sx={{
                  color: "#1b5e20",
                  fontWeight: "bold",
                  "&:hover": {
                    color: "#1b5e20", // optional hover color
                  },
                }}
              >
                create a new account
              </Link>

            </Typography>

            {error && (
              <Box mt={2} p={2} bgcolor="#fdecea" borderLeft="4px solid #f44336">
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              </Box>
            )}

            <Box mt={4}>
              <TextField
                label="Username"
                name="username"
                fullWidth
                value={credentials.username}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                value={credentials.password}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
              <FormControlLabel
                control={<Checkbox name="remember" />}
                label="Remember me"
              />
<Link
  component={RouterLink}
  to="/forgot-password"
  sx={{
    color: "#1b5e20", // Set the text color
    fontWeight: "semi-bold",
    "&:hover": {
      color: "#1b5e20", // Optional hover color, can be changed if desired
    },
  }}
>
  Forgot your password?
</Link>

            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 2,
                mb: 1,
                backgroundColor: "#328E6E",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#28745A",
                },
              }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} sx={{ color: "#fff", mr: 1 }} />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>


            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" fontWeight="bold">
                Or continue with
              </Typography>
            </Divider>

            <Button
              fullWidth
              variant="contained"
              onClick={handleGoogleLogin}
              sx={{
                backgroundColor: "#328E6E",
                color: "#fff", 
                "&:hover": { backgroundColor: "#28745A" },
              }}
              startIcon={
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
              }
            >
              Sign in with Google
            </Button>

          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
