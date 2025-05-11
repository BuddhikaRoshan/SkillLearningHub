import React, { useState, useEffect } from "react";
import postApi from "../api/postApi";
import CreatePostContainer from "./CreatePostContainer";
import { FiPlus } from "react-icons/fi";
import PostCard from "./PostCard";
import Modal from "react-modal"; // Using react-modal for better accessibility
import { Button, CircularProgress, Typography, Box } from "@mui/material"; // MUI components
import { useNavigate } from "react-router-dom";

// Initialize Modal for accessibility
Modal.setAppElement("#root"); // Set this to your root element ID

const PostContainer = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await postApi.getAllPosts();
        setPosts(data.reverse());
      } catch (err) {
        setError(err.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [isCreatingPost]);

  const handleCreatePost = async (postData) => {
    try {
      setIsCreatingPost(true);
      await postApi.createPost(postData);
      setShowCreateModal(false);
      // Refresh posts after creating a new one
      const data = await postApi.getAllPosts();
      setPosts(data.reverse());
    } catch (err) {
      setError(err.message || "Failed to create post");
    } finally {
      setIsCreatingPost(false);
    }
  };

  const closeModal = () => {
    setShowCreateModal(false);
  };

  // Custom styles for the modal
  const customModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      maxWidth: "600px",
      width: "90%",
      maxHeight: "90vh",
      overflow: "auto",
      padding: "0",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e2e8f0",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1000,
    },
  };

  return (
    <Box className="max-w-2xl mx-auto pb-20">
      {/* Header with Create Post Button */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "white",
          boxShadow: 1,
          mb: 6,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" component="h1" fontWeight="bold">
          Posts
        </Typography>
        <Button
          onClick={() => {
            if (localStorage.getItem("userId")) {
              setShowCreateModal(true);
            } else {
              navigate("/login");
            }
          }}
          variant="contained"
          color="success"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <FiPlus size={18} />
          Create Post
        </Button>
      </Box>

      {/* Create Post Modal */}
      <Modal
        isOpen={showCreateModal}
        onRequestClose={closeModal}
        style={customModalStyles}
        contentLabel="Create New Post"
      >
        <Box p={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">Create New Post</Typography>
            <Button onClick={closeModal} color="inherit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </Box>
          <CreatePostContainer
            onCreate={handleCreatePost}
            onCancel={closeModal}
            isSubmitting={isCreatingPost}
          />
        </Box>
      </Modal>

      {/* Posts Feed */}
      <Box sx={{ mt: 3 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress size={40} color="success" />
          </Box>
        ) : error ? (
          <Box sx={{ backgroundColor: "error.light", p: 2, borderRadius: 1 }}>
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 12 }}>
            <Typography variant="h6" color="textSecondary" paragraph>
              No posts yet
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Be the first to create one!
            </Typography>
            <Button
              onClick={() => {
                if (localStorage.getItem("userId")) {
                  setShowCreateModal(true);
                } else {
                  navigate("/login");
                }
              }}
              variant="contained"
              color="success"
              sx={{ mt: 4, display: "flex", alignItems: "center", gap: 1 }}
            >
              <FiPlus size={18} />
              Create Post
            </Button>
          </Box>
        ) : (
          posts.map((post) => <PostCard key={post.id} initialPost={post} />)
        )}
      </Box>
    </Box>
  );
};

export default PostContainer;
