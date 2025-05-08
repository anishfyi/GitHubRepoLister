import React, { useEffect, useState } from "react";
import ReposComponent from "../Repos/RepositoryComponent";

const PaginationComponent = (props) => {
  const [loading, setLoading] = useState(true);
  const { username } = props;
  const [pages, setPages] = useState({
    page: 1,
    total_pages: 0,
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      // First fetch user info to get total repo count
      const response = await fetch(`https://api.github.com/users/${username}`);
      const userData = await response.json();
      
      // Calculate total pages based on public_repos count
      const totalPages = Math.ceil(userData.public_repos / 10);
      setPages({ page: 1, total_pages: totalPages });
      setLoading(false);
    };
    
    fetchUserInfo();
  }, [username]);

  const makeButtons = () => {
    let buttons = [];
    for (let i = 1; i <= pages.total_pages; i++) {
      buttons.push(
        <button
          key={i}
          style={
            pages.page === i
              ? { backgroundColor: "#000000", color: "white" }
              : {}
          }
          onClick={() => setPages({ ...pages, page: i })}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="pagination">
      <ReposComponent page={pages.page} username={username} />
      <div className="pages_pgn">
        <div className="page-nos">
          {makeButtons(pages.total_pages)}
        </div>
      </div>
    </div>
  );
};

export default PaginationComponent;
