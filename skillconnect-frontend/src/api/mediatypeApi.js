import apiClient from "./axiosConfig";

export default {
  /**
   * Get all media types
   * @returns {Promise<Array<MediaTypeResponseDTO>>}
   */
  async getAllMediaTypes() {
    try {
      const response = await apiClient.get("/media-types");
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch media types";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  /**
   * Get media types by post ID
   * @param {string} postId - Post ID
   * @returns {Promise<Array<MediaTypeResponseDTO>>}
   */
  async getMediaTypesByPost(postId) {
    try {
      const response = await apiClient.get(`/media-types/post/${postId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch media types for post";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  /**
   * Get a media type by ID
   * @param {string} id - Media type ID
   * @returns {Promise<MediaTypeResponseDTO>}
   */
  async getMediaTypeById(id) {
    try {
      const response = await apiClient.get(`/media-types/${id}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch media type";
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Media type not found";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      throw new Error(errorMessage);
    }
  },

  /**
   * Create a new media type
   * @param {MediaTypeDTO} mediaTypeData - Media type data to create
   * @returns {Promise<MediaTypeResponseDTO>}
   */
  async createMediaType(mediaTypeData) {
    try {
      const response = await apiClient.post("/media-types", mediaTypeData);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to create media type";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  /**
   * Update a media type
   * @param {string} id - Media type ID to update
   * @param {MediaTypeDTO} mediaTypeData - Updated media type data
   * @returns {Promise<MediaTypeResponseDTO>}
   */
  async updateMediaType(id, mediaTypeData) {
    try {
      const response = await apiClient.put(`/media-types/${id}`, mediaTypeData);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to update media type";
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Media type not found";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      throw new Error(errorMessage);
    }
  },

  /**
   * Delete a media type
   * @param {string} id - Media type ID to delete
   * @returns {Promise<boolean>}
   */
  async deleteMediaType(id) {
    try {
      await apiClient.delete(`/media-types/${id}`);
      return true;
    } catch (error) {
      let errorMessage = "Failed to delete media type";
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Media type not found";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      throw new Error(errorMessage);
    }
  },
};
