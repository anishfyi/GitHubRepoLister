import React, { useEffect, useState } from "react";
import ReposComponent from "../Repos/RepositoryComponent";
import { fetchWithRateLimitHandling, mockUser } from "../../services/MockService";

const PaginationComponent = (props) => {
  const { username } = props;
  const [pages, setPages] = useState({
    page: 1,
    total_pages: 0,
  });
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Use our custom fetch function with rate limit handling
        setIsLoading(true);
        const response = await fetchWithRateLimitHandling(`https://api.github.com/users/${username}`);
        const userData = await response.json();
        
        // Set rate limit flag if needed
        if (response.rateLimited) {
          setRateLimitExceeded(true);
        }
        
        // Calculate total pages based on public_repos count
        const totalPages = Math.ceil(userData.public_repos / 10);
        setPages({ page: 1, total_pages: totalPages });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Fallback to mock data on error
        setRateLimitExceeded(true);
        setPages({ page: 1, total_pages: Math.ceil(mockUser.public_repos / 10) });
        setIsLoading(false);
      }
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
      {rateLimitExceeded && (
        <div className="rate-limit-warning">
          <p>GitHub API rate limit exceeded. Showing mock data.</p>
        </div>
      )}
      {isLoading ? (
        <div className="loading-pagination">Loading pagination...</div>
      ) : (
        <>
          <ReposComponent 
            page={pages.page} 
            username={username} 
            rateLimitExceeded={rateLimitExceeded} 
          />
          <div className="pages_pgn">
            <div className="page-nos">
              {makeButtons(pages.total_pages)}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PaginationComponent;
