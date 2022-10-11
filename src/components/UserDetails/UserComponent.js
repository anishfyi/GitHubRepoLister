import React from "react";
import Button from 'react-bootstrap/Button';
import PaginationComponent from "../Pagination/PaginationComponent";

const UserDetails = (props) => {
  const { user } = props;
  return (
    <div className="user-details">
      <div className="user-details__main">
        <div>
          <img className="avatar" src={user.avatar_url} />
        </div>
        <div className="details">
          <h1>{user.name}</h1>
          <a class="btn btn-secondary btn-lg" tabindex="-1" role="button" aria-disabled="false" href={user.github} target = "_blank">Profile Link</a>
        </div>
        
      </div>
      
      <PaginationComponent username={user.login} />
    </div>
  );
};

export default UserDetails;
