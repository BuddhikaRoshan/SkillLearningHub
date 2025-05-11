import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Avatar, Typography, Button, Grid, CircularProgress } from "@mui/material";
import postApi from "../api/postApi";
import userApi from "../api/userApi";
import { toast } from "react-toastify";
import FollowButton from "../components/Profile/FollowButton";
import FollowCountContainer from "../components/Profile/FollowCountContainer";
import followApi from "../api/followApi";

const UserProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const checkFollow = async () => {
      const result = await followApi.isUserFollowing(
        user.id,
        localStorage.getItem("userId")
      );
      setIsFollowing(result);
    };
    checkFollow();
  }, [user]);

  const [isLoading, setIsLoading] = useState(true);
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const [userData, userPosts] = await Promise.all([
          userApi.getUserById(id),
          postApi.getPostsByUser(id),
        ]);

        setUser(userData);
        setPosts(userPosts);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [id, currentUserId]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Typography align="center" variant="h6" py={12}>User not found</Typography>;
  }

  return (
    <Box maxWidth="lg" mx="auto" px={4} py={8}>
      {/* Profile Header */}
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} alignItems="center" gap={8} mb={12}>
        {/* Profile Picture */}
        <Avatar
          sx={{ width: { xs: 96, md: 128 }, height: { xs: 96, md: 128 }, border: 2, borderColor: "grey.200" }}
          src={user.profileImageUrl || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"}
          alt={user.username}
        />

        {/* Profile Info */}
        <Box flex="1">
          <Box display="flex" flexDirection={{ xs: "column", md: "row" }} alignItems="center" gap={4} mb={4}>
            <Typography variant="h5">{user.username}</Typography>

            {/* Follow/Edit Profile Button */}
            {currentUserId === id ? (
              <Button variant="outlined" size="small">
                Edit Profile
              </Button>
            ) : (
              <FollowButton user={user} />
            )}
          </Box>

          {/* Stats */}
          <Box display="flex" gap={8} mb={4}>
            <Box textAlign="center">
              <Typography variant="h6">{posts.length}</Typography>
              <Typography variant="body2">Posts</Typography>
            </Box>
            <FollowCountContainer user={user} />
          </Box>

          {/* Bio */}
          <Box>
            <Typography variant="h6">{user.fullName}</Typography>
            <Typography variant="body1" color="textSecondary">{user.bio || "No bio yet"}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Posts Grid */}
      {user.publicStatus || isFollowing ? (
        posts.length > 0 && (
          <Grid container spacing={1}>
            {posts.map((post) => (
              <Grid item xs={4} key={post.id}>
                <Box position="relative" className="group">
                  {post.mediaTypes && (
                    <img
                      src={post.mediaTypes[0].url}
                      alt={post.caption}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        )
      ) : (
        <Typography variant="h6">Account is private</Typography>
      )}
    </Box>
  );
};

export default UserProfilePage;
