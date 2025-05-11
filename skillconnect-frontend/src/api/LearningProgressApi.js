// src/learningProgressApi.js
import apiClient from "./axiosConfig";

export default {
  async getAllProgressUpdates() {
    try {
      const response = await apiClient.get("/progress-updates");
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch progress updates";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  async getProgressUpdatesByUser(userId) {
    try {
      const response = await apiClient.get(`/progress-updates/user/${userId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch user progress updates";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  async getProgressUpdateById(id) {
    try {
      const response = await apiClient.get(`/progress-updates/${id}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch progress update";
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Progress update not found";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      throw new Error(errorMessage);
    }
  },

  async createProgressUpdate(progressData) {
    try {
      const response = await apiClient.post("/progress-updates", progressData);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to create progress update";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  async updateProgressUpdate(id, progressData) {
    try {
      const response = await apiClient.put(
        `/progress-updates/${id}`,
        progressData
      );
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to update progress update";
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Progress update not found";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      throw new Error(errorMessage);
    }
  },

  async deleteProgressUpdate(id) {
    try {
      await apiClient.delete(`/progress-updates/${id}`);
      return true;
    } catch (error) {
      let errorMessage = "Failed to delete progress update";
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Progress update not found";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      throw new Error(errorMessage);
    }
  },
};

