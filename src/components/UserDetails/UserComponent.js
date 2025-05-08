import React from "react";
import PaginationComponent from "../Pagination/PaginationComponent";

const UserDetails = (props) => {
  const { user, rateLimitExceeded } = props;
  return (
    <div className="user-details">
      <div className="user-details__main">
        <div>
          <img className="avatar" src={user.avatar_url} alt={`${user.login}'s avatar`} />
        </div>
        <div className="details">
          <h1>{user.name || user.login}</h1>
          <a className="btn btn-secondary btn-lg" tabIndex="-1" role="button" aria-disabled="false" href={user.github || user.html_url} target="_blank" rel="noopener noreferrer">Profile Link</a>
        </div>
      </div>
      
      <PaginationComponent username={user.login} />
    </div>
  );
};

export default UserDetails;
