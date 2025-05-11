import React, { useState, useRef } from "react";
import postApi from "../api/postApi";
import mediatypeApi from "../api/mediatypeApi";
import { uploadFile } from "../services/uploadFileService";
import { Button, CircularProgress } from "@mui/material";

const CreatePostContainer = () => {
  const userId = localStorage.getItem("userId");
  const [caption, setCaption] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate file count
    if (files.length + mediaFiles.length > 3) {
      setError("You can upload a maximum of 3 files");
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      const isValidType =
        file.type.startsWith("image/") ||
        (file.type.startsWith("video/") && file.size <= 30 * 1024 * 1024); // 30MB max for videos
      if (!isValidType) {
        setError("Only images and videos (max 30MB) are allowed");
      }
      return isValidType;
    });

    // Create previews
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviews((prev) => [
          ...prev,
          {
            url: reader.result,
            type: file.type.startsWith("image/") ? "image" : "video",
            file,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    setMediaFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // 1. First create the post
      const postData = {
        caption,
        userId,
        mediaTypeIds: [],
        taggedUserIds: [],
      };

      const createdPost = await postApi.createPost(postData);

      // 2. Upload media files and create media types
      const mediaTypeIds = [];

      for (let i = 0; i < mediaFiles.length; i++) {
        const file = mediaFiles[i];
        try {
          // Update progress
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: 0,
          }));

          // Upload file to Firebase
          const fileUrl = await uploadFile(file, (progress) => {
            setUploadProgress((prev) => ({
              ...prev,
              [file.name]: progress,
            }));
          });

          // Create media type
          const mediaType = {
            type: file.type.startsWith("image/") ? "image" : "video",
            url: fileUrl,
            postId: createdPost.id,
          };

          const createdMediaType = await mediatypeApi.createMediaType(
            mediaType
          );
          mediaTypeIds.push(createdMediaType.id);
        } catch (err) {
          console.error(`Failed to upload ${file.name}:`, err);
          throw new Error(`Failed to upload ${file.name}`);
        }
      }

      // 3. Update post with media type IDs
      await postApi.updatePost(createdPost.id, {
        ...createdPost,
        mediaTypeIds,
      });

      // Reset form on success
      setCaption("");
      setMediaFiles([]);
      setPreviews([]);
      alert("Post created successfully!");
      location.reload();
    } catch (err) {
      setError(err.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Caption</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            rows="3"
            placeholder="What's on your mind?"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Media (max 3)</label>

          {/* Media previews */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                {preview.type === "image" ? (
                  <img
                    src={preview.url}
                    alt={`Preview ${index}`}
                    className="w-full h-32 object-cover rounded"
                  />
                ) : (
                  <video
                    src={preview.url}
                    className="w-full h-32 object-cover rounded"
                    controls
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
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
                </button>
                {uploadProgress[mediaFiles[index]?.name] > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gray-200 h-1">
                    <div
                      className="bg-emerald-600 h-1"
                      style={{
                        width: `${uploadProgress[mediaFiles[index]?.name]}%`,
                      }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* File input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/*,video/*"
            className="hidden"
          />
          <Button
            type="button"
            onClick={() => fileInputRef.current.click()}
            disabled={mediaFiles.length >= 3}
            sx={{
              px: 4,
              py: 2,
              bgcolor: "#1b5e20", // Custom green color
              color: "white", // Text color set to white
              "&:hover": {
                bgcolor: "#166f1f", // Darker green on hover
              },
              textTransform: "none",
            }}
          >
            {mediaFiles.length === 0 ? "Add Photos/Videos" : "Add More"}
          </Button>
          {mediaFiles.length > 0 && (
            <span className="ml-2 text-sm text-gray-500">
              {mediaFiles.length}/3 files selected
            </span>
          )}
        </div>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            py: 2,
            bgcolor: "#1b5e20", // Custom green color
            color: "white", // Text color set to white
            "&:hover": {
              bgcolor: "#166f1f", // Darker green on hover
            },
            textTransform: "none",
          }}
          disabled={isSubmitting || !caption || mediaFiles.length === 0}
        >
          {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Create Post"}
        </Button>
      </form>
    </div>
  );
};

export default CreatePostContainer;
