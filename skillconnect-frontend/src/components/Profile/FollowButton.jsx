import React, { useEffect, useState } from "react";
import { FiUserPlus, FiUserCheck } from "react-icons/fi";
import followApi from "../../api/followApi";
import { toast } from "react-toastify";
const FollowButton = ({ user }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const checkFollow = async () => {
      const result = await followApi.isUserFollowing(
        localStorage.getItem("userId"),
        user.id
      );
      setIsFollowing(result);
    };
    checkFollow();
  }, [user]);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await followApi.unfollowUser({
          followerId: localStorage.getItem("userId"),
          followingId: user.id,
        });
        setIsFollowing(false);
        toast.success("User unfollowed successfully");
      } else {
        await followApi.followUser({
          followerId: localStorage.getItem("userId"),
          followingId: user.id,
        });
        setIsFollowing(true);
        toast.success("User followed  successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
<button
  onClick={handleFollow}
  style={{
    backgroundColor: isFollowing ? '#f3f4f6' : '#1b5e20',
    color: isFollowing ? '#1f2937' : '#fff',
  }}
  onMouseEnter={(e) => {
    if (!isFollowing) e.currentTarget.style.backgroundColor = '#145a32';
  }}
  onMouseLeave={(e) => {
    if (!isFollowing) e.currentTarget.style.backgroundColor = '#1b5e20';
  }}
  className="flex items-center gap-1 px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
>
  {isFollowing ? (
    <>
      <FiUserCheck size={16} /> UnFollow
    </>
  ) : (
    <>
      <FiUserPlus size={16} /> Follow
    </>
  )}
</button>

  );
};

export default FollowButton;
