import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../api/userApi";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../services/firebaseConfig";
import {
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
  Select,
  InputLabel,
  FormControl,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  Logout as LogoutIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import UserPostsContainer from "../components/UserPostsContainer";


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

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 1,
      }}
    >
      {bubbles.map((bubble) => (
        <Box
          key={bubble.id}
          sx={{
            position: "absolute",
            borderRadius: "50%",
            background: "linear-gradient(to bottom right, #4ade80, #16a34a)",
            left: `${bubble.x}px`,
            top: `${bubble.y}px`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            opacity: bubble.opacity,
            transform: `scale(${1 + Math.sin(bubble.y * 0.01) * 0.1})`,
          }}
        />
      ))}
    </Box>
  );
};



// Custom styled components
const ProfilePaper = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  transition: "all 0.3s ease",
  backgroundColor: theme.palette.background.paper,
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(14),
  height: theme.spacing(14),
  border: `4px solid ${theme.palette.common.white}`,
  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  transition: "all 0.3s ease",
  backgroundColor: theme.palette.primary.main,
}));

const ButtonsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  marginTop: theme.spacing(4),
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
}));

const CoverBox = styled(Box)(({ theme }) => ({
  position: "relative",
  height: 300,
  width: "100%",
  overflow: "hidden",
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down("md")]: {
    height: 200,
  },
}));

const Overlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)",
}));

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    contactNumber: "",
    gender: "",
    birthday: "",
    address: "",
    bio: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [previewCoverImage, setPreviewCoverImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const profileImageInputRef = useRef(null);
  const coverImageInputRef = useRef(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId");
        if (!userId) {
          navigate("/login");
          return;
        }
        const userData = await userApi.getUserById(userId);
        if (!userData) {
          throw new Error("User data not found");
        }
        setUser(userData);
        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          username: userData.username || "",
          email: userData.email || "",
          contactNumber: userData.contactNumber || "",
          gender: userData.gender || "",
          birthday: userData.birthday || "",
          address: userData.address || "",
          bio: userData.bio || "",
        });
        if (userData.profileImageUrl) {
          setPreviewImage(userData.profileImageUrl);
        }
        if (userData.coverImageUrl) {
          setPreviewCoverImage(userData.coverImageUrl);
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load profile");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewCoverImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfileImage = async (file) => {
    const storageRef = ref(
      storage,
      `profile-images/${Date.now()}-${file.name}`
    );
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const uploadCoverImage = async (file) => {
    const storageRef = ref(
      storage,
      `cover-images/${Date.now()}-${file.name}`
    );
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let updateData = { ...formData };

      if (profileImage) {
        const profileImageUrl = await uploadProfileImage(profileImage);
        updateData.profileImageUrl = profileImageUrl;
      }
      if (coverImage) {
        const coverImageUrl = await uploadCoverImage(coverImage);
        updateData.coverImageUrl = coverImageUrl;
      }

      const updatedUser = await userApi.updateUser(user.id, updateData);
      setUser(updatedUser);
      setSuccess("Profile updated successfully!");
      setSnackbarOpen(true);
      setEditing(false);

      // Reset temporary images after update
      setProfileImage(null);
      setCoverImage(null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update profile");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      await userApi.deleteUser(user.id);
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete account");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setError("");
    setSuccess("");
  };

  if (loading && !user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Alert severity="error">Failed to load profile</Alert>
      </Box>
    );
  }

  // For the user profile page, assume this is the user's own profile.
  const isOwnProfile = true;

  return (
    <Box sx={{ bgcolor: "transparent", minHeight: "100vh", background: "linear-gradient(to bottom right, #a7f3d0, #f3e8ff)" }}>
      <BubbleBackground />
      {/* Cover Photo Section */}
      <CoverBox>
        {previewCoverImage ? (
          <Box
            component="img"
            src={previewCoverImage}
            alt="Cover"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "all 0.3s ease",
            }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              bgcolor: "grey.200",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ImageIcon sx={{ fontSize: 60, color: "grey.400" }} />
          </Box>
        )}

        <Overlay />

        {isOwnProfile && (
          <>
            <IconButton
              onClick={() => coverImageInputRef.current?.click()}
              sx={{
                position: "absolute",
                bottom: 16,
                right: 16,
                bgcolor: "rgba(0, 0, 0, 0.5)",
                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.7)" },
                color: "white",
              }}
              aria-label="upload cover image"
            >
              <PhotoCameraIcon />
            </IconButton>
            <input
              type="file"
              accept="image/*"
              ref={coverImageInputRef}
              style={{ display: "none" }}
              onChange={handleCoverImageChange}
            />
          </>
        )}
      </CoverBox>


      <Container maxWidth="lg" sx={{ mb: 4, px: 0 }}>
        <Grid container spacing={0} justifyContent="center">
          {/* Left Column - Profile Details */}
          <Grid item xs={12} md={5}> {/* Profile section with increased width */}
            <ProfilePaper
              sx={{
                p: 3,
                mx: "auto",         // Centers the card horizontally
                width: "100%",

              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
                <Box sx={{ position: "relative", mb: 2 }}>
                  <StyledAvatar src={previewImage}>
                    {!previewImage &&
                      (user.firstName?.charAt(0) || user.username?.charAt(0))}
                  </StyledAvatar>
                  {isOwnProfile && (
                    <>
                      <IconButton
                        onClick={() => profileImageInputRef.current?.click()}
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          bgcolor: "primary.main",
                          "&:hover": { bgcolor: "primary.dark" },
                        }}
                        size="small"
                        aria-label="upload profile image"
                      >
                        <PhotoCameraIcon sx={{ fontSize: 20, color: "white" }} />
                      </IconButton>
                      <input
                        type="file"
                        accept="image/*"
                        ref={profileImageInputRef}
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                      />
                    </>
                  )}
                </Box>
                <Typography variant="h5" gutterBottom>
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  @{user.username}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3, textAlign: "center" }}>
                <Typography variant="h6" gutterBottom>
                  About Me
                </Typography>
                <Typography variant="body2" paragraph>
                  {user.bio || "No bio provided"}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </Typography>
              </Box>


            </ProfilePaper>
            {/* Action Buttons */}
            {isOwnProfile && (
              <ButtonsContainer>
                <Button
                  variant="contained"
                  startIcon={<EditIcon sx={{ fontSize: 18 }} />}
                  onClick={() => setEditing(true)}
                  fullWidth
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<LogoutIcon sx={{ fontSize: 18 }} />}
                  onClick={handleLogout}
                  fullWidth
                >
                  Logout
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon sx={{ fontSize: 18 }} />}
                  onClick={() => setDeleteDialog(true)}
                  fullWidth
                >
                  Delete Account
                </Button>
              </ButtonsContainer>
            )}
          </Grid>


          {/* Right Column - User Posts */}
          <Grid item xs={12} md={7}> {/* Increased md to 7 for the posts section */}
            <UserPostsContainer userId={user.id} isOwnProfile={isOwnProfile} />
          </Grid>

        </Grid>
      </Container>





      {/* Edit Profile Dialog */}
      <Dialog
        open={editing}
        onClose={() => setEditing(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                id="gender-select"
                name="gender"
                value={formData.gender}
                label="Gender"
                onChange={handleInputChange}
              >
                <MenuItem value="">Select Gender</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Date of Birth"
              name="birthday"
              type="date"
              value={formData.birthday}
              onChange={handleInputChange}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={4}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button onClick={() => setEditing(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialog(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
            disabled={loading}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? "error" : "success"}
          variant="filled"
          elevation={6}
          sx={{ width: "100%" }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage;