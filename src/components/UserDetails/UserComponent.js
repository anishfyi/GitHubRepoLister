import React from "react";
import PaginationComponent from "../Pagination/PaginationComponent";

const UserDetails = (props) => {
  const { user, rateLimitExceeded } = props;
  return (
    <div className="user-details">
      {rateLimitExceeded && (
        <div className="rate-limit-notice">
          Note: Using cached data due to GitHub API rate limits. Some information may not be current.
        </div>
      )}
      
      <div className="user-details__main">
        <div>
          <img className="avatar" src={user.avatar_url} alt={`${user.login}'s avatar`} />
        </div>
        <div className="details">
          <h2>{user.name || user.login}</h2>
          <p>@{user.login}</p>
          <div className="link-text">
            <a href={user.github || user.html_url} target="_blank" rel="noopener noreferrer">
              Visit GitHub Profile
            </a>
          </div>
        </div>
      </div>
      
      <PaginationComponent username={user.login} rateLimitExceeded={rateLimitExceeded} />
    </div>
  );
};

export default UserDetails;
