import { useState } from "react";
import { Box, Avatar, Button, Typography, IconButton } from "@mui/material";
import PostMediaContainer from "./PostMediaContainer";
import PostActionsComponent from "./PostActionsComponent";
import LikeCommentContainer from "./Posts/LikeCommentContainer";
import { Link } from "react-router-dom";

const PostCard = ({ initialPost }) => {
  const [post, setPost] = useState(initialPost);
  const currentUserId = localStorage.getItem("userId");
  const isOwner = currentUserId === post.user.id;

  const [expanded, setExpanded] = useState(false);
  const MAX_CAPTION_LENGTH = 150;

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handlePostUpdated = (updatedPost) => {
    setPost((prevPost) => ({
      ...prevPost,
      ...updatedPost,
    }));
    window.location.reload();
  };

  const shouldTruncate = post.caption.length > MAX_CAPTION_LENGTH;
  const displayCaption =
    shouldTruncate && !expanded
      ? `${post.caption.substring(0, MAX_CAPTION_LENGTH)}...`
      : post.caption;

  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: 2,
        boxShadow: 3,
        overflow: "hidden",
        mb: 3,
      }}
    >
      {/* Post Header */}
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <Link
          to={
            localStorage.getItem("userId") === post.user.id
              ? `/profile`
              : `/user-profile/${post.user.id}`
          }
        >
          <Avatar
            sx={{ width: 40, height: 40 }}
            src={post.user.profileImageUrl}
            alt={post.user.firstName}
          >
            {post.user.profileImageUrl ? null : (
              <Typography variant="body1">
                {post.user.firstName?.charAt(0) || post.user.username?.charAt(0)}
              </Typography>
            )}
          </Avatar>
        </Link>
        <Box>
          <Typography variant="h6" fontWeight="medium">
            {post.user.firstName} {post.user.lastName}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {new Date(post.createdAt).toLocaleString()}
          </Typography>
        </Box>
        {isOwner && (
          <PostActionsComponent
            post={post}
            onPostUpdated={handlePostUpdated}
            onPostDeleted={() => {
              window.location.reload();
            }}
          />
        )}
      </Box>

      {/* Caption */}
      {post.caption && (
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography variant="body2" color="textPrimary">
            {displayCaption}
            {shouldTruncate && (
              <Button
                onClick={toggleExpand}
                sx={{ ml: 1, color: "emerald.main", textTransform: "none" }}
              >
                {expanded ? "Show less" : "Show more"}
              </Button>
            )}
          </Typography>
        </Box>
      )}

      {/* Media */}
      <PostMediaContainer post={post} />

      {/* Post Footer */}
      <LikeCommentContainer post={post} />
    </Box>
  );
};

export default PostCard;
