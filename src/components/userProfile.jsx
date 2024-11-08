import React, { useState, useEffect, useMemo } from 'react';
import { getUserData, getUserImage } from '../services/storageService';

const UserProfile = ({ userId, onUserSelect }) => {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);

  // Fetch user data and image from cache
  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        const cachedUser = await getUserData(userId);
        if (cachedUser) {
          setUser(cachedUser);
          const userImage = await getUserImage(userId);
          setImage(userImage);
        }
      }
    };

    fetchUser();
  }, [userId]);

  // Memoize the user profile data so that it doesn't re-render until user data is loaded
  const memoizedUser = useMemo(() => {
    return user ? (
      <div className="flex items-center space-x-4">
        {image && <img src={image} alt="User" className="w-12 h-12 rounded-full" />}
        <div>
          <h2 className="font-semibold">{user.name}</h2>
          <p className="text-sm">{user.email}</p>
        </div>
      </div>
    ) : null; // Return null until user data is loaded
  }, [user, image]);

  // If no userId is provided, show the button to select a user
  if (!userId) {
    return (
      <button
        className="p-2 bg-blue-500 text-white rounded-lg"
        onClick={onUserSelect} // Trigger the user selection or creation
      >
        User
      </button>
    );
  }

  // Render memoized user content after the user has been loaded
  return memoizedUser;
};

export default UserProfile;
