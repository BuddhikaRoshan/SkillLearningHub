import apiClient from "./axiosConfig";

export default {
  async getLikesByPost(postId) {
    try {
      const response = await apiClient.get(`/likes/post/${postId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch post likes";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  async getLikesByUser(userId) {
    try {
      const response = await apiClient.get(`/likes/user/${userId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch user likes";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  async hasUserLikedPost(userId, postId) {
    try {
      const response = await apiClient.get(
        `/likes/check?userId=${userId}&postId=${postId}`
      );
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to check like status";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  async createLike(likeData) {
    try {
      const response = await apiClient.post("/likes", likeData);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to create like";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  async deleteLike(likeId) {
    try {
      await apiClient.delete(`/likes/${likeId}`);
      return true;
    } catch (error) {
      let errorMessage = "Failed to delete like";
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Like not found";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      throw new Error(errorMessage);
    }
  },
};
