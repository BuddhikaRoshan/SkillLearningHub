import React, { useEffect, useState } from "react";
import likeApi from "../../api/likeApi";
import commentApi from "../../api/commentApi";
import { toast } from "react-toastify";
import CommentContainer from "./CommentContainer";

const LikeCommentContainer = ({ post }) => {
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [commentButtonClicked, setCommentButtonClicked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeId, setLikeId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = localStorage.getItem("userId");

  const fetchData = async () => {
    try {
      const [likesData, commentsData] = await Promise.all([
        likeApi.getLikesByPost(post.id),
        commentApi.getCommentsByPost(post.id),
      ]);
      setLikes(likesData);
      setComments(commentsData);

      const userLike = likesData.find((like) => like.user.id === userId);
      setIsLiked(!!userLike);
      if (userLike) {
        setLikeId(userLike.id);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load likes and comments");
    }
  };

  const handleLike = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (isLiked) {
        await likeApi.deleteLike(likeId);
        setLikes((prevLikes) => prevLikes.filter((like) => like.id !== likeId));
        setIsLiked(false);
        setLikeId(null);
      } else {
        const newLike = await likeApi.createLike({
          userId,
          postId: post.id,
        });
        setLikes((prevLikes) => [...prevLikes, newLike]);
        setIsLiked(true);
        setLikeId(newLike.id);
      }
    } catch (error) {
      console.error("Error handling like:", error);
      toast.error(isLiked ? "Failed to unlike post" : "Failed to like post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) {
      toast.warning("Please enter a comment");
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const newComment = await commentApi.createComment({
        userId,
        postId: post.id,
        content: comment,
      });

      setComments((prevComments) => [...prevComments, newComment]);
      setComment("");
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentApi.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error(error);
      throw new Error("Failed to delete comment");
    }
  };

  const handleUpdateComment = async (commentId, content) => {
    try {
      const updatedComment = await commentApi.updateComment(commentId, {
        content,
      });
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? updatedComment : c))
      );
    } catch (error) {
      console.error(error);
      throw new Error("Failed to update comment");
    }
  };

  useEffect(() => {
    fetchData();
  }, [post.id, userId]);

  return (
    <div className="p-4 border-t border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm text-gray-500">
          {likes.length > 0 && (
            <span className="inline-flex items-center">
              <span className="bg-emerald-500 p-1 rounded-full mr-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
              {likes.length}
            </span>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {comments.length > 0 && `${comments.length} comments`}
        </div>
      </div>

      <div className="flex border-t border-b border-gray-200 py-2">
        <button
          onClick={handleLike}
          disabled={isSubmitting}
          className={`flex items-center justify-center space-x-1 flex-1 py-1 rounded-md transition ${
            isLiked
              ? "text-emerald-600 hover:bg-emerald-50"
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill={isLiked ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeWidth={isLiked ? 0 : 2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span>{isLiked ? "Liked" : "Like"}</span>
        </button>
        <button
          onClick={() => setCommentButtonClicked(!commentButtonClicked)}
          className="flex items-center justify-center space-x-1 flex-1 py-1 text-gray-500 hover:bg-gray-50 rounded-md transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span>Comment</span>
        </button>
      </div>

      {commentButtonClicked && (
        <div className="mt-3 flex flex-col">
          <div className="flex items-start space-x-2 mt-1">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"></div>
            <div className="flex-1 relative">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                rows={2}
              />
              <button
                onClick={handleComment}
                disabled={!comment.trim() || isSubmitting}
                className={`absolute right-2 bottom-2 px-3 py-1 rounded-md text-sm font-medium 
                ${
                  !comment.trim() || isSubmitting
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-emerald-500 text-white hover:bg-emerald-600"
                }`}
              >
                {isSubmitting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}

      <CommentContainer
        comments={comments}
        postUserId={post.userId}
        onDelete={handleDeleteComment}
        onUpdate={handleUpdateComment}
      />
    </div>
  );
};

export default LikeCommentContainer;
