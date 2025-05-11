import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../api/userApi";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../services/firebaseConfig";
import { uploadFile } from "../services/uploadFileService";
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
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  Logout as LogoutIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  LocationOn,
  Email,
  Phone,
  Cake,
  Person,
  CalendarToday,
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

// Styled Components
const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
  padding: theme.spacing(3),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const CoverSection = styled(Box)(({ theme }) => ({
  height: 300,
  width: "100%",
  position: "relative",
  overflow: "hidden",
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(15),
  [theme.breakpoints.down("md")]: {
    height: 200,
    marginBottom: theme.spacing(12),
  },
}));

const ProfileSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  marginTop: -theme.spacing(15),
  position: 'relative',
  zIndex: 2,
  [theme.breakpoints.down("md")]: {
    marginTop: -theme.spacing(12),
  },
}));

const ProfileCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 400,
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  backgroundColor: theme.palette.background.paper,
}));

const ProfileImage = styled(Box)(({ theme }) => ({
  width: 150,
  height: 150,
  borderRadius: '50%',
  overflow: 'hidden',
  border: '6px solid white',
  boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
  marginTop: -100,
  marginBottom: theme.spacing(2),
  position: 'relative',
  backgroundColor: 'white',
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1.5),
  color: theme.palette.text.secondary,
}));

const PostsSection = styled(Box)(({ theme }) => ({
  width: '300%',
  maxWidth: 1100,
  margin: '0 auto',
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

  const uploadCoverImage = async (file) => {
    try {
      const fileUrl = await uploadFile(file, (progress) => {
        console.log(`Upload progress: ${progress}%`);
      });
      return fileUrl;
    } catch (error) {
      console.error("Error uploading cover image:", error);
      throw new Error("Failed to upload cover image");
    }
  };

  const handleCoverImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setLoading(true);
        // Create a preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewCoverImage(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload the file
        const coverImageUrl = await uploadCoverImage(file);
        setCoverImage(file);
        
        // Update the user's cover image URL in the backend
        const updateData = {
          ...formData,
          coverImageUrl: coverImageUrl
        };
        
        const updatedUser = await userApi.updateUser(user.id, updateData);
        setUser(updatedUser);
        
        // Store the new cover image URL in localStorage with user-specific key
        localStorage.setItem(`userCoverImage_${user.id}`, coverImageUrl);
        
        setSuccess("Cover image updated successfully!");
        setSnackbarOpen(true);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to update cover image");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    }
  };

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
        bio: userData.bio || ""
      });
      
      // Check both userData and localStorage for profile image
      const profileImageUrl = userData.profileImageUrl || localStorage.getItem("userImage");
      if (profileImageUrl) {
        setPreviewImage(profileImageUrl);
        // Update localStorage if it's from userData
        if (userData.profileImageUrl) {
          localStorage.setItem("userImage", userData.profileImageUrl);
        }
      }
      
      // Check both userData and localStorage for cover image with user-specific key
      const coverImageUrl = userData.coverImageUrl || localStorage.getItem(`userCoverImage_${userData.id}`);
      if (coverImageUrl) {
        setPreviewCoverImage(coverImageUrl);
        // Update localStorage if it's from userData
        if (userData.coverImageUrl) {
          localStorage.setItem(`userCoverImage_${userData.id}`, userData.coverImageUrl);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load profile");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const uploadProfileImage = async (file) => {
    try {
      const fileUrl = await uploadFile(file, (progress) => {
        console.log(`Upload progress: ${progress}%`);
      });
      return fileUrl;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      throw new Error("Failed to upload profile image");
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setLoading(true);
        // Create a preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload the file
        const profileImageUrl = await uploadProfileImage(file);
        setProfileImage(file);
        
        // Update the user's profile image URL in the backend
        const updateData = {
          ...formData,
          profileImageUrl: profileImageUrl
        };
        
        const updatedUser = await userApi.updateUser(user.id, updateData);
        setUser(updatedUser);
        
        // Store the new profile image URL in localStorage
        localStorage.setItem("userImage", profileImageUrl);
        
        setSuccess("Profile image updated successfully!");
        setSnackbarOpen(true);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to update profile image");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let updateData = { ...formData };

      if (profileImage) {
        const profileImageUrl = await uploadProfileImage(profileImage);
        updateData.profileImageUrl = profileImageUrl;
        // Store the new profile image URL in localStorage
        localStorage.setItem("userImage", profileImageUrl);
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Alert severity="error">Failed to load profile</Alert>
      </Box>
    );
  }

  // For the user profile page, assume this is the user's own profile.
  const isOwnProfile = true;

  return (
    <PageContainer>
      <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
        {/* Section 1: Cover Image */}
        <Box sx={{ width: '250%', maxWidth: 1100, mb: 4, position: 'relative' }}>
          {previewCoverImage ? (
            <Box
              component="img"
              src={previewCoverImage}
              alt="Cover"
              sx={{
                width: '100%',
                height: 220,
                objectFit: 'cover',
                borderRadius: 4,
              }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                height: 220,
                bgcolor: 'grey.200',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ImageIcon sx={{ fontSize: 60, color: 'grey.400' }} />
            </Box>
          )}
          {isOwnProfile && (
            <IconButton
              onClick={() => coverImageInputRef.current?.click()}
              sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
                color: 'white',
              }}
            >
              <PhotoCameraIcon />
            </IconButton>
          )}
          <input
            type="file"
            accept="image/*"
            ref={coverImageInputRef}
            style={{ display: 'none' }}
            onChange={handleCoverImageChange}
          />
        </Box>

        {/* Section 2: Profile Section */}
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 4 }}>
          <ProfileCard sx={{ maxWidth: 900, width: '100%', minHeight: 320, p: 0, display: 'flex', flexDirection: 'row', alignItems: 'stretch', borderRadius: 4 }}>
            {/* Profile Image on the left */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, minWidth: 200 }}>
              <ProfileImage>
                {previewImage ? (
                  <Box
                    component="img"
                    src={previewImage}
                    alt="Profile"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: "100%",
                      height: "100%",
                      fontSize: "4rem",
                      backgroundColor: "primary.main",
                    }}
                  >
                    {user.firstName?.charAt(0) || user.username?.charAt(0)}
                  </Avatar>
                )}
                {isOwnProfile && (
                  <IconButton
                    onClick={() => profileImageInputRef.current?.click()}
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      bgcolor: "primary.main",
                      "&:hover": { bgcolor: "primary.dark" },
                      color: "white",
                      padding: 1,
                    }}
                  >
                    <PhotoCameraIcon />
                  </IconButton>
                )}
              </ProfileImage>
              <input
                type="file"
                accept="image/*"
                ref={profileImageInputRef}
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </Box>
            {/* Details on the right */}
            <CardContent sx={{ p: 4, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                @{user.username}
              </Typography>
              {/* Contact Information */}
              <Box sx={{ width: "100%", mt: 1 }}>
                <InfoItem>
                  <Email fontSize="small" />
                  <Typography variant="body2">{user.email}</Typography>
                </InfoItem>
                {user.contactNumber && (
                  <InfoItem>
                    <Phone fontSize="small" />
                    <Typography variant="body2">{user.contactNumber}</Typography>
                  </InfoItem>
                )}
                {user.address && (
                  <InfoItem>
                    <LocationOn fontSize="small" />
                    <Typography variant="body2">{user.address}</Typography>
                  </InfoItem>
                )}
                {user.birthday && (
                  <InfoItem>
                    <Cake fontSize="small" />
                    <Typography variant="body2">
                      {new Date(user.birthday).toLocaleDateString()}
                    </Typography>
                  </InfoItem>
                )}
                {user.gender && (
                  <InfoItem>
                    <Person fontSize="small" />
                    <Typography variant="body2">{user.gender}</Typography>
                  </InfoItem>
                )}
                <InfoItem>
                  <CalendarToday fontSize="small" />
                  <Typography variant="body2">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </Typography>
                </InfoItem>
              </Box>
              <Divider sx={{ width: "100%", my: 2 }} />
              {/* About Section */}
              <Box sx={{ width: "100%" }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  About Me
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {user.bio || "No bio provided"}
                </Typography>
              </Box>
              {/* Action Buttons */}
              {isOwnProfile && (
                <Box
                  sx={{
                    width: '100%',
                    mt: 2,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => setEditing(true)}
                    sx={{ minWidth: 120 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    sx={{ minWidth: 120 }}
                  >
                    Logout
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setDeleteDialog(true)}
                    sx={{ minWidth: 120 }}
                  >
                    Delete
                  </Button>
                </Box>
              )}
            </CardContent>
          </ProfileCard>
        </Box>

        {/* Section 3: Posts Section */}
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <PostsSection sx={{ width: '100%', maxWidth: 1100 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: "background.paper",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  textAlign: "center",
                  color: "text.primary",
                }}
              >
                Posts
              </Typography>
              <UserPostsContainer userId={user.id} isOwnProfile={isOwnProfile} />
            </Paper>
          </PostsSection>
        </Box>
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
    </PageContainer>
  );
};

export default ProfilePage;