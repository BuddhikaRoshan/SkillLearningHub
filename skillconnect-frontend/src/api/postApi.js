import apiClient from "./axiosConfig";

export default {
  /**
   * Get all posts
   * @returns {Promise<Array<PostResponseDTO>>}
   */
  async getAllPosts() {
    try {
      const response = await apiClient.get("/posts");
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch posts";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  /**
   * Get a post by ID
   * @param {string} id - Post ID
   * @returns {Promise<PostResponseDTO>}
   */
  async getPostById(id) {
    try {
      const response = await apiClient.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch post";
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Post not found";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      throw new Error(errorMessage);
    }
  },

  /**
   * Create a new post
   * @param {PostDTO} postData - Post data to create
   * @returns {Promise<PostResponseDTO>}
   */
  async createPost(postData) {
    try {
      const response = await apiClient.post("/posts", postData);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to create post";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  /**
   * Update a post
   * @param {string} id - Post ID to update
   * @param {PostDTO} postData - Updated post data
   * @returns {Promise<PostResponseDTO>}
   */
  async updatePost(id, postData) {
    try {
      const response = await apiClient.put(`/posts/${id}`, postData);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to update post";
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Post not found";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      throw new Error(errorMessage);
    }
  },

  /**
   * Delete a post
   * @param {string} id - Post ID to delete
   * @returns {Promise<boolean>}
   */
  async deletePost(id) {
    try {
      await apiClient.delete(`/posts/${id}`);
      return true;
    } catch (error) {
      let errorMessage = "Failed to delete post";
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Post not found";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      throw new Error(errorMessage);
    }
  },

  /**
   * Get posts by user ID
   * @param {string} userId - User ID
   * @returns {Promise<Array<PostResponseDTO>>}
   */
  async getPostsByUser(userId) {
    try {
      const response = await apiClient.get(`/posts/user/${userId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch user posts";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },
};
