import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  Close as CloseIcon,
  Add as AddIcon,
  Image as ImageIcon
} from "@mui/icons-material";
import PostCard from "./PostCard";
import postApi from "../api/postApi";
import CreatePostContainer from "./CreatePostContainer";

const UserPostsContainer = ({ userId, isOwnProfile }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('Fetching posts for user:', userId);
        setLoading(true);
        setError(null);
        const userPosts = await postApi.getPostsByUser(userId);
        console.log('Fetched posts:', userPosts);
        setPosts(userPosts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.message || "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPosts();
    } else {
      console.warn('No userId provided to UserPostsContainer');
      setError('User ID is required');
      setLoading(false);
    }
  }, [userId]);

  const handleCreatePost = () => {
    setCreatePostOpen(true);
  };

  const handleCloseCreatePost = () => {
    setCreatePostOpen(false);
  };

  const handlePostCreated = () => {
    // Refresh posts after creating a new one
    postApi.getPostsByUser(userId).then(setPosts);
    setCreatePostOpen(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  console.log('Rendering posts:', posts);

  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      {/* Header with Create Post button */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h6">
          Posts
        </Typography>
        {isOwnProfile && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreatePost}
          >
            Create Post
          </Button>
        )}
      </Box>

      {/* Posts Grid */}
      {posts && posts.length > 0 ? (
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} key={post.id}>
              <PostCard initialPost={post} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
            bgcolor: theme.palette.grey[50],
            borderRadius: 2
          }}
        >
          <ImageIcon sx={{ fontSize: 60, color: theme.palette.grey[400], mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No Posts Yet
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center">
            {isOwnProfile 
              ? "Share your first post with your friends!"
              : "This user hasn't posted anything yet."}
          </Typography>
          {isOwnProfile && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreatePost}
              sx={{ mt: 2 }}
            >
              Create Your First Post
            </Button>
          )}
        </Box>
      )}

      {/* Create Post Dialog */}
      <Dialog
        open={createPostOpen}
        onClose={handleCloseCreatePost}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          Create New Post
          <IconButton
            aria-label="close"
            onClick={handleCloseCreatePost}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <CreatePostContainer onPostCreated={handlePostCreated} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreatePost}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserPostsContainer; 