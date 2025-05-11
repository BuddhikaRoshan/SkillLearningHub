import apiClient from "./axiosConfig";

export default {
  async getCommentsByPost(postId) {
    try {
      const response = await apiClient.get(`/comments/post/${postId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch post comments";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  async getCommentsByUser(userId) {
    try {
      const response = await apiClient.get(`/comments/user/${userId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch user comments";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  async getCommentById(id) {
    try {
      const response = await apiClient.get(`/comments/${id}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch comment";
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Comment not found";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      throw new Error(errorMessage);
    }
  },

  async createComment(commentData) {
    try {
      const response = await apiClient.post("/comments", commentData);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to create comment";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  async updateComment(id, commentData) {
    try {
      const response = await apiClient.put(`/comments/${id}`, commentData);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to update comment";
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Comment not found";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      throw new Error(errorMessage);
    }
  },

  async deleteComment(id) {
    try {
      await apiClient.delete(`/comments/${id}`);
      return true;
    } catch (error) {
      let errorMessage = "Failed to delete comment";
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Comment not found";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      throw new Error(errorMessage);
    }
  },
};
