import React, { useState, useRef } from "react";
import postApi from "../api/postApi";
import mediatypeApi from "../api/mediatypeApi";
import { uploadFile } from "../services/uploadFileService";
import Modal from "react-modal";

const PostActionsComponent = ({ post, onPostUpdated, onPostDeleted }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const optionsRef = useRef(null);

  // Close options when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle delete post
  const handleDeletePost = async () => {
    setIsLoading(true);
    try {
      await postApi.deletePost(post.id);
      setShowDeleteConfirm(false);
      onPostDeleted(post.id);
      showToast("Post deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting post:", error);
      showToast("Failed to delete post", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Show toast message
  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };
  const customModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "90vh",
      minHeight: "60vh",
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
    <>
      {/* More options button */}
      <div className="relative ml-auto" ref={optionsRef}>
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="More options"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        {/* Dropdown menu */}
        {showOptions && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
            <div className="py-1">
              <button
                onClick={() => {
                  setShowOptions(false);
                  setShowEditModal(true);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit Post
              </button>
              <button
                onClick={() => {
                  setShowOptions(false);
                  setShowDeleteConfirm(true);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Delete Post
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <Modal
          isOpen={showEditModal}
          onRequestClose={setShowEditModal}
          style={customModalStyles}
          contentLabel="Create New Post"
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Post</h2>
              <button
                onClick={setShowEditModal}
                className="text-gray-500 hover:text-gray-700"
              >
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
              </button>
            </div>
            <EditPostModal
              post={post}
              onClose={() => setShowEditModal(false)}
              onPostUpdated={(updatedPost) => {
                onPostUpdated(updatedPost);
                showToast("Post updated successfully", "success");
              }}
            />
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 w-full">
            <h3 className="text-lg font-medium mb-4">Delete Post</h3>
            <p className="mb-6">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
                disabled={isLoading}
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 disabled:bg-red-300"
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toast.show && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-2 rounded-md text-white ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}
    </>
  );
};

// Edit Post Modal Component
const EditPostModal = ({ post, onClose, onPostUpdated }) => {
  const [caption, setCaption] = useState(post.caption || "");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [previews, setPreviews] = useState(
    post.mediaTypes?.map((media) => ({
      url: media.url,
      type: media.type,
      id: media.id,
      isExisting: true,
    })) || []
  );
  const [uploadProgress, setUploadProgress] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const existingCount = previews.filter((p) => p.isExisting).length;

    // Validate file count
    if (files.length + existingCount + mediaFiles.length > 3) {
      setError("You can upload a maximum of 3 files");
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      const isValidType =
        file.type.startsWith("image/") ||
        (file.type.startsWith("video/") && file.size <= 30 * 1024 * 1024);
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
            isExisting: false,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    setMediaFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    const preview = previews[index];

    if (preview.isExisting) {
      // Just mark existing files for removal in UI
      setPreviews((prev) => prev.filter((_, i) => i !== index));
    } else {
      // Remove new files from both arrays
      const newFileIndex = mediaFiles.findIndex(
        (f) => f === previews[index].file
      );

      if (newFileIndex !== -1) {
        setMediaFiles((prev) => prev.filter((_, i) => i !== newFileIndex));
      }
      setPreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // 2. Handle media changes
      let existingMediaIds = previews
        .filter((p) => p.isExisting)
        .map((p) => p.id);

      // Remove media types that were deleted
      const mediaToDelete = post.mediaTypes
        .filter((media) => !existingMediaIds.includes(media.id))
        .map((media) => media.id);

      for (const mediaId of mediaToDelete) {
        await mediatypeApi.deleteMediaType(mediaId);
      }

      // 3. Upload new media files
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
            postId: post.id,
          };

          const type = await mediatypeApi.createMediaType(mediaType);
          existingMediaIds.push(type.id);
        } catch (err) {
          console.error(`Failed to upload ${file.name}:`, err);
          throw new Error(`Failed to upload ${file.name}`);
        }
      }

      // 4. Get updated post data
      const refreshedPost = await postApi.getPostById(post.id);

      // 5. Update post with caption
      await postApi.updatePost(post.id, {
        ...refreshedPost,
        caption,
        mediaTypeIds: existingMediaIds,
      });

      onPostUpdated(refreshedPost);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 max-w-2xl w-full h-full overflow-y-auto">
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
                {!preview.isExisting &&
                  uploadProgress[preview.file?.name] > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gray-200 h-1">
                      <div
                        className="bg-emerald-600 h-1"
                        style={{
                          width: `${uploadProgress[preview.file?.name]}%`,
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
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            disabled={previews.length >= 3}
            className={`px-4 py-2 rounded ${
              previews.length >= 3
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
            }`}
          >
            {previews.length === 0 ? "Add Photos/Videos" : "Add More"}
          </button>
          {previews.length > 0 && (
            <span className="ml-2 text-sm text-gray-500">
              {previews.length}/3 files selected
            </span>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !caption}
            className={`py-2 px-4 rounded text-white font-medium ${
              isSubmitting || !caption
                ? "bg-emerald-300 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostActionsComponent;
