import React, { useEffect, useState } from "react";
import ReposComponent from "../Repos/RepositoryComponent";
import { fetchWithRateLimitHandling, mockUser } from "../../services/MockService";

const PaginationComponent = (props) => {
  const { username, rateLimitExceeded: parentRateLimitExceeded } = props;
  const [pages, setPages] = useState({
    page: 1,
    total_pages: 0,
    totalRepos: 0
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
          const totalRepos = mockUser.public_repos;
          setPages({
            page: 1,
            total_pages: Math.ceil(totalRepos / 10),
            totalRepos
          });
        } else {
          const userData = await response.json();
          // Calculate total pages based on public_repos count
          const totalRepos = userData.public_repos;
          setPages({
            page: 1,
            total_pages: Math.ceil(totalRepos / 10),
            totalRepos
          });
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Fallback to mock data on error
        const totalRepos = mockUser.public_repos;
        setRateLimitExceeded(true);
        setPages({
          page: 1,
          total_pages: Math.ceil(totalRepos / 10),
          totalRepos
        });
        setIsLoading(false);
      }
    };
    
    fetchUserInfo();
  }, [username, parentRateLimitExceeded]);

  const handlePrevPage = () => {
    if (pages.page > 1) {
      setPages({ ...pages, page: pages.page - 1 });
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (pages.page < pages.total_pages) {
      setPages({ ...pages, page: pages.page + 1 });
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const makeButtons = () => {
    let buttons = [];
    
    // For small number of pages, show all
    if (pages.total_pages <= 5) {
      for (let i = 1; i <= pages.total_pages; i++) {
        buttons.push(
          <button
            key={i}
            className={pages.page === i ? "active" : ""}
            onClick={() => {
              setPages({ ...pages, page: i });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            {i}
          </button>
        );
      }
      return buttons;
    }
    
    // For larger number of pages, show a window with current page in center
    let startPage = Math.max(1, pages.page - 2);
    let endPage = Math.min(pages.total_pages, startPage + 4);
    
    // Adjust start page if we're near the end
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    // Add first page and ellipsis if needed
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          className={pages.page === 1 ? "active" : ""}
          onClick={() => {
            setPages({ ...pages, page: 1 });
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          1
        </button>
      );
      
      if (startPage > 2) {
        buttons.push(
          <span key="start-ellipsis" className="ellipsis">...</span>
        );
      }
    }
    
    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      if (i === 1 || i === pages.total_pages) continue; // Skip first and last as they're added separately
      
      buttons.push(
        <button
          key={i}
          className={pages.page === i ? "active" : ""}
          onClick={() => {
            setPages({ ...pages, page: i });
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          {i}
        </button>
      );
    }
    
    // Add last page and ellipsis if needed
    if (endPage < pages.total_pages) {
      if (endPage < pages.total_pages - 1) {
        buttons.push(
          <span key="end-ellipsis" className="ellipsis">...</span>
        );
      }
      
      buttons.push(
        <button
          key={pages.total_pages}
          className={pages.page === pages.total_pages ? "active" : ""}
          onClick={() => {
            setPages({ ...pages, page: pages.total_pages });
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          {pages.total_pages}
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
        <>
          <div className="pages_pgn">
            <button 
              id="arrow-btn" 
              onClick={handlePrevPage}
              disabled={pages.page === 1}
              aria-label="Previous page"
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
              aria-label="Next page"
            >
              &raquo;
            </button>
          </div>
          
          <div className="pagination-info">
            Page {pages.page} of {pages.total_pages} • {pages.totalRepos} repositories total
          </div>
        </>
      )}
    </div>
  );
};

export default PaginationComponent;
