import React, { useEffect, useState } from "react";
import followApi from "../../api/followApi";

const FollowCountContainer = ({ user }) => {
  const [followCount, setFollowCount] = useState(0);

  useEffect(() => {
    followApi
      .getFollowerCount(user.id)
      .then((result) => setFollowCount(result))
      .catch((err) => console.error(err));
  }, [user]);

  return (
    <div className="text-center">
      <span className="font-semibold">{followCount}</span>
      <span className="block text-sm">Followers</span>
    </div>
  );
};

export default FollowCountContainer;
