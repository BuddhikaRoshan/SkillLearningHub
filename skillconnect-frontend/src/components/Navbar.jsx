import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import NotificationAvatar from "./Common/NotificationAvatar";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
  Avatar,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

const Navbar = () => {
  const [userId, setUserId] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Function to update user image
  const updateUserImage = () => {
    const image = localStorage.getItem("userImage");
    setUserImage(image || "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg");
  };

  useEffect(() => {
    const id = localStorage.getItem("userId");
    setUserId(id);
    updateUserImage();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === "userImage") {
        updateUserImage();
      } else if (e.key === "userId") {
        setUserId(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userImage");
    localStorage.removeItem("token");
    setUserId(null);
    setUserImage(null);
    navigate("/login");
  };

  const LogoIcon = styled("svg")(({ theme }) => ({
    width: 32,
    height: 32,
    color: theme.palette.success.main,
  }));

  return (
    <AppBar position="sticky" color="default" sx={{ backgroundColor: "#0f172a", boxShadow: 3 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo */}
        <Box display="flex" alignItems="center" component={Link} to="/" sx={{ textDecoration: "none" }}>
          <LogoIcon
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </LogoIcon>
          <Typography variant="h6" sx={{ ml: 1, color: "#fff", fontWeight: "bold" }}>
            Skill Connect Learning Hub
          </Typography>
        </Box>

        {/* Right Side */}
        <Box display="flex" alignItems="center" gap={2}>
          {/* Search */}
          <Button
  component={Link}
  to="/search"
  startIcon={<BiSearch />}
  sx={{
    color: "#94a3b8",
    "&:hover": { color: "#34d399" },
    display: { xs: "none", sm: "flex" },
    fontSize: "0.875rem",
    px: 30, // Increase padding left/right
  }}
>
  Search
</Button>


          {userId ? (
            <>
              <Tooltip title="Profile">
                <IconButton
                  component={Link}
                  to="/profile"
                  sx={{
                    bgcolor: "#1e293b",
                    width: 36,
                    height: 36,
                    p: 0,
                    "&:hover": {
                      bgcolor: "#2d3a4f",
                    },
                  }}
                >
                  <Avatar
                    alt="Profile"
                    src={userImage}
                    sx={{ 
                      width: 36, 
                      height: 36,
                      border: "2px solid #1e293b",
                      "&:hover": {
                        border: "2px solid #34d399",
                      },
                    }}
                  />
                </IconButton>
              </Tooltip>

              <NotificationAvatar />

              <Button
                onClick={handleLogout}
                sx={{
                  color: "#94a3b8",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  "&:hover": { color: "#fff" },
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                size="small"
                sx={{
                  color: "#e2e8f0",
                  borderColor: "#334155",
                  "&:hover": {
                    color: "#34d399",
                    borderColor: "#34d399",
                  },
                }}
              >
                Log in
              </Button>

              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: "#10b981",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#059669",
                  },
                }}
              >
                Sign up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>

      {/* Mobile search & profile */}
      {isMobile && (
        <Toolbar sx={{ justifyContent: "space-between", pt: 1 }}>
          <Button
            component={Link}
            to="/search"
            startIcon={<BiSearch />}
            sx={{ color: "#94a3b8", fontSize: "0.875rem", "&:hover": { color: "#34d399" } }}
          >
            Search
          </Button>
          {userId && (
            <Button
              component={Link}
              to="/profile"
              sx={{ color: "#94a3b8", fontSize: "0.875rem", "&:hover": { color: "#fff" } }}
            >
              Profile
            </Button>
          )}
        </Toolbar>
      )}
    </AppBar>
  );
};

export default Navbar;
