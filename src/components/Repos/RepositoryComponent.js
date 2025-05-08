import React, { useEffect, useState } from "react";
import { Circles } from "react-loader-spinner";
import RepoBox from "../RepositoriesBox/RepoBoxComponent";
import { fetchWithRateLimitHandling } from "../../services/MockService";

const ReposComponent = (props) => {
  const { page, username, rateLimitExceeded } = props;
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPage = async (page_no) => {
      setLoading(true);
      setError(null);
      
      try {
        // Use our custom fetch function with rate limit handling
        const response = await fetchWithRateLimitHandling(
          `https://api.github.com/users/${username}/repos?per_page=10&page=${page_no}`
        );
        
        if (!response.ok && !response.rateLimited) {
          throw new Error(`Error fetching repositories: ${response.status}`);
        }
        
        const data = await response.json();
        setRepos(data);
      } catch (error) {
        console.error("Error fetching repositories:", error);
        setError("Failed to load repositories. " + error.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadPage(page);
  }, [page, username, rateLimitExceeded]);

  return (
    <>
      {loading ? (
        <div className="loader">
          <Circles height="120" width="120" color="#2563eb" visible={true} />
          <h4>Loading</h4>
        </div>
      ) : error ? (
        <div className="error-message">
          <h4>{error}</h4>
        </div>
      ) : (
        <div className="repo-container">
          {repos.map((repo) => (
            <RepoBox repo={repo} key={repo.id} />
          ))}
        </div>
      )}
    </>
  );
};

export default ReposComponent;
