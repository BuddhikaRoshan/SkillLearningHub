import apiClient from "./axiosConfig";

export default {
  // Get notifications for a user
  async getNotificationsByUserId(userId) {
    try {
      const response = await apiClient.get(`/notifications/user/${userId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch notifications";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      throw new Error(errorMessage);
    }
  },

  // Get notification count for a user
  async getNotificationCountByUserId(userId) {
    try {
      const response = await apiClient.get(`/notifications/count/${userId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch notification count";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      throw new Error(errorMessage);
    }
  },
  async deletNotification(id) {
    try {
      const response = await apiClient.delete(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch notification count";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      throw new Error(errorMessage);
    }
  },

  // Create a notification
  async createNotification(userId, title, message) {
    try {
      const response = await apiClient.post("/notifications/", null, {
        params: {
          userId,
          title,
          message,
        },
      });
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to create notification";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      throw new Error(errorMessage);
    }
  },
};