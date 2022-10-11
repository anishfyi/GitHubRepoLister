import React, { useEffect, useState } from "react";
import ReposComponent from "../Repos/RepositoryComponent";

const PaginationComponent = (props) => {
  const [loading, setLoading] = useState(true);
  const { username } = props;
  const [pages, setPages] = useState({
    page: 0,
    total_pages: 0,
  
  });

  useEffect(() => {
    const fetchRepos = async (total_pages) => {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos`
      );
      const data = await response.json();
      setPages({ page: 1, total_pages: (data.length / 10)+1 });
      setLoading(true);
    };
    fetchRepos();
  }, []);


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
