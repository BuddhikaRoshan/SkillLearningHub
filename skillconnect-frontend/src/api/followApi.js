import apiClient from "./axiosConfig";

export default {
  async followUser(followData) {
    try {
      const response = await apiClient.post("/follow", followData);
      return response.data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.message || "Failed to follow user"
      );
    }
  },

  async unfollowUser(followData) {
    try {
      const response = await apiClient.delete("/follow", { data: followData });
      return response.data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.message || "Failed to unfollow user"
      );
    }
  },

  async getFollowingCount(userId) {
    try {
      const response = await apiClient.get(`/follow/count/following/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.message || "Failed to get following count"
      );
    }
  },

  async getFollowerCount(userId) {
    try {
      const response = await apiClient.get(`/follow/count/followers/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.message || "Failed to get follower count"
      );
    }
  },

  async isUserFollowing(followerId, followingId) {
    try {
      const response = await apiClient.get("/follow/is-following", {
        params: { followerId, followingId },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.message || "Failed to check follow status"
      );
    }
  },
};
