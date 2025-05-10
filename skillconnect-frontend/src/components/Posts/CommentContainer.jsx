import React, { useState } from "react";
import { FiEdit2, FiTrash2, FiMoreHorizontal } from "react-icons/fi";
import { toast } from "react-toastify";

const CommentContainer = ({ comments, postUserId, onDelete, onUpdate }) => {
  const [expandedComments, setExpandedComments] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const userId = localStorage.getItem("userId");

  const toggleCommentExpand = (commentId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleEditClick = (comment) => {
    setEditingCommentId(comment.id);
    setEditedContent(comment.content);
  };

  const handleEditSubmit = async (commentId) => {
    if (!editedContent.trim()) {
      toast.warning("Comment cannot be empty");
      return;
    }

    try {
      await onUpdate(commentId, editedContent);
      setEditingCommentId(null);
      toast.success("Comment updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update comment");
    }
  };

  const handleDeleteClick = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await onDelete(commentId);
        toast.success("Comment deleted successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete comment");
      }
    }
  };

  return comments.length > 0 ? (
    <div className="mt-3 space-y-3">
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
            {comment.user?.profileImageUrl && (
              <img
                src={comment.user.profileImageUrl}
                alt={`${comment.user.firstName}'s profile`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flex-1">
            <div className="bg-gray-100 rounded-lg px-3 py-2">
              <div className="font-medium text-sm flex justify-between items-center">
                <span>{comment.user?.firstName || "User"}</span>
                {(comment.user.id === userId || postUserId === userId) && (
                  <div className="relative">
                    <button
                      className="text-gray-500 hover:text-gray-700 p-1"
                      onClick={() => toggleCommentExpand(comment.id)}
                    >
                      <FiMoreHorizontal size={16} />
                    </button>
                    {expandedComments[comment.id] && (
                      <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <button
                          onClick={() => handleEditClick(comment)}
                          className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FiEdit2 className="mr-2" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(comment.id)}
                          className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <FiTrash2 className="mr-2" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {editingCommentId === comment.id ? (
                <div className="mt-2">
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-sm"
                    rows={3}
                  />
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      onClick={() => setEditingCommentId(null)}
                      className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleEditSubmit(comment.id)}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-sm mt-1">{comment.content}</div>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1 flex space-x-2">
              <span>
                {new Date(comment.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <button className="hover:text-gray-700">Like</button>
              <button className="hover:text-gray-700">Reply</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : null;
};

export default CommentContainer;
