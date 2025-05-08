import React, { useEffect, useState } from "react";
import ReposComponent from "../Repos/RepositoryComponent";
import { fetchWithRateLimitHandling, mockUser } from "../../services/MockService";

const PaginationComponent = (props) => {
  const { username, rateLimitExceeded: parentRateLimitExceeded } = props;
  const [pages, setPages] = useState({
    page: 1,
    total_pages: 0,
  });
  const [rateLimitExceeded, setRateLimitExceeded] = useState(parentRateLimitExceeded || false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Use our custom fetch function with rate limit handling
        setIsLoading(true);
        const response = await fetchWithRateLimitHandling(`https://api.github.com/users/${username}`);
        
        // Set rate limit flag if needed
        if (response.rateLimited) {
          setRateLimitExceeded(true);
          // Use mock data for pagination
          setPages({ page: 1, total_pages: Math.ceil(mockUser.public_repos / 10) });
        } else {
          const userData = await response.json();
          // Calculate total pages based on public_repos count
          const totalPages = Math.ceil(userData.public_repos / 10);
          setPages({ page: 1, total_pages: totalPages });
        }
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
  }, [username, parentRateLimitExceeded]);

  const handlePrevPage = () => {
    if (pages.page > 1) {
      setPages({ ...pages, page: pages.page - 1 });
    }
  };

  const handleNextPage = () => {
    if (pages.page < pages.total_pages) {
      setPages({ ...pages, page: pages.page + 1 });
    }
  };

  const makeButtons = () => {
    let buttons = [];
    // Show maximum 5 pages with current page in center when possible
    let startPage = Math.max(1, pages.page - 2);
    let endPage = Math.min(pages.total_pages, startPage + 4);
    
    // Adjust start page if we're near the end
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={pages.page === i ? "active" : ""}
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
      <ReposComponent 
        page={pages.page} 
        username={username} 
        rateLimitExceeded={rateLimitExceeded} 
      />
      
      {!isLoading && pages.total_pages > 0 && (
        <div className="pages_pgn">
          <button 
            id="arrow-btn" 
            onClick={handlePrevPage}
            disabled={pages.page === 1}
          >
            &laquo;
          </button>
          
          <div className="page-nos">
            {makeButtons()}
          </div>
          
          <button 
            id="arrow-btn" 
            onClick={handleNextPage}
            disabled={pages.page === pages.total_pages}
          >
            &raquo;
          </button>
        </div>
      )}
    </div>
  );
};

export default PaginationComponent;
