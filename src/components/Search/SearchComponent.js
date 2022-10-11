import React, { useEffect, useState } from "react";
import { Circles } from "react-loader-spinner";

import { useParams } from "react-router-dom";
import UserDetails from "../UserDetails/UserComponent";
const SearchComponent = () => {
  const { username } = useParams();
  useEffect(() => {
    if (username !== undefined || username !== "") {
      fetchUser();
    }
  }, []);
  const [user, setUserDetails] = useState({
    name: "",
    github: "",
    avatar_url: "",
    loaded: false,
  });

  const fetchUser = async (e) => {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const data = await response.json();
    setUserDetails({
      login: data.login,
      name: data.name,
      github: data.html_url,
      avatar_url: data.avatar_url,
      loaded: true,
    });
  };

  return (
    <>
      {user.loaded ? (
        <>
          {user.login ? (
            <UserDetails user={user} />
          ) : (
            <div className="loader">
              <h2>Not Found - {username}</h2>
            </div>
          )}
        </>
      ) : (
        <div className="loader">
          <Circles height="120" width="120" color="#000000" visible={true} />
          <h4>Loading</h4>
        </div>
      )}
    </>
  );
};

export default SearchComponent;
