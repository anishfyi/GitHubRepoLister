import React, { useEffect, useState, useCallback } from "react";
import { Circles } from "react-loader-spinner";
import { useParams } from "react-router-dom";
import UserDetails from "../UserDetails/UserComponent";
import { fetchWithRateLimitHandling, mockUser } from "../../services/MockService";

const SearchComponent = () => {
  const { username } = useParams();
  const [user, setUserDetails] = useState({
    name: "",
    github: "",
    avatar_url: "",
    loaded: false
  });
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetchWithRateLimitHandling(`https://api.github.com/users/${username}`);
      
      // Check if rate limited from our custom response
      if (response.rateLimited) {
        setRateLimitExceeded(true);
        // Use mock user data
        setUserDetails({
          login: mockUser.login,
          name: mockUser.name,
          github: mockUser.html_url,
          avatar_url: mockUser.avatar_url,
          loaded: true
        });
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user data. Status: ${response.status}`);
      }
      
      const data = await response.json();
      setUserDetails({
        login: data.login,
        name: data.name,
        github: data.html_url,
        avatar_url: data.avatar_url,
        loaded: true
      });
    } catch (err) {
      console.error("Error fetching user:", err);
      setError("Failed to load user data. " + err.message);
      // Fallback to mock data on error
      setRateLimitExceeded(true);
      setUserDetails({
        login: mockUser.login,
        name: mockUser.name,
        github: mockUser.html_url,
        avatar_url: mockUser.avatar_url,
        loaded: true
      });
    }
  }, [username]);

  useEffect(() => {
    if (username !== undefined && username !== "") {
      fetchUser();
    }
  }, [username, fetchUser]);

  return (
    <>
      {!user.loaded ? (
        <div className="loader">
          <Circles height="120" width="120" color="#2563eb" visible={true} />
          <h4>Loading</h4>
        </div>
      ) : error ? (
        <div className="error-message">
          <h2>Error: {error}</h2>
        </div>
      ) : user.login ? (
        <UserDetails user={user} rateLimitExceeded={rateLimitExceeded} />
      ) : (
        <div className="loader">
          <h2>Not Found - {username}</h2>
        </div>
      )}
    </>
  );
};

export default SearchComponent;
