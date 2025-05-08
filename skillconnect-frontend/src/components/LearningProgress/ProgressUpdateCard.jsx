import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
  Chip,
  LinearProgress,
  Divider,
} from "@mui/material";
import { FiMoreVertical, FiEdit2, FiTrash2 } from "react-icons/fi";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const ProgressUpdateCard = ({ update, userId, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const completionPercentage = (update?.completedProgress ?? 0) * 100;

  const getProgressColor = (percentage) => {
    const normalized = percentage > 1 ? percentage / 100 : percentage;
    if (normalized < 0.2) return "#ff9a9e"; // soft pink
    if (normalized < 0.5) return "#f6bd60"; // warm orange
    if (normalized < 0.7) return "#90caf9"; // light blue
    return "#81c784"; // green
  };

  return (
    <Card elevation={3} sx={{ borderRadius: 3, position: "relative" }}>
      <CardContent>
        {/* Header: Chip & Percentage Box */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Chip
            label={update.templateType || "Update"}
            color="primary"
            variant="outlined"
            sx={{ textTransform: "uppercase", fontWeight: 500 }}
          />
<Box
  sx={{
    backgroundColor: getProgressColor(completionPercentage),
    color: "#fff",
    px: 2,
    py: 1,
    borderRadius: 2,
    fontWeight: "bold",
    boxShadow: 2,
    fontSize: 14,
    mr: 5, // Adjust this value to move left
  }}
>
  {Math.round(completionPercentage)}%
</Box>

        </Box>

        {/* Progress Bar */}
        <Box sx={{ width: "100%", mb: 3 }}>
          <LinearProgress
            variant="determinate"
            value={completionPercentage}
            sx={{
              height: 10,
              borderRadius: 5,
              [`& .MuiLinearProgress-bar`]: {
                backgroundColor: getProgressColor(completionPercentage),
              },
            }}
          />
        </Box>

        {/* Content */}
        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", fontWeight: 500, mb: 2 }}>
          {update.content}
        </Typography>

        {/* Estimated Time */}
        <Box display="flex" alignItems="center" mb={2}>
          <AccessTimeIcon sx={{ mr: 1, color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary">
            Estimated Time:{" "}
            <Typography component="span" fontWeight="bold" color="text.primary">
              {update.estimatedTime} hours
            </Typography>
          </Typography>
        </Box>

        {/* Date */}
        <Divider sx={{ mb: 1 }} />
        <Typography variant="caption" color="text.secondary">
          {new Date(update.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
      </CardContent>

      {/* Menu for Edit/Delete */}
      {update.userId === userId && (
        <CardActions sx={{ position: "absolute", top: 8, right: 1 }}>
          <IconButton size="small" onClick={handleMenuOpen}>
            <FiMoreVertical />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem
              onClick={() => {
                onEdit(update);
                handleMenuClose();
              }}
            >
              <FiEdit2 style={{ marginRight: 8 }} />
              Edit
            </MenuItem>
            <MenuItem
              onClick={() => {
                onDelete(update.id);
                handleMenuClose();
              }}
              sx={{ color: "error.main" }}
            >
              <FiTrash2 style={{ marginRight: 8 }} />
              Delete
            </MenuItem>
          </Menu>
        </CardActions>
      )}
    </Card>
  );
};

export default ProgressUpdateCard;
