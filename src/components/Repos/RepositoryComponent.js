import React, { useEffect, useState } from "react";
import { ColorRing, Circles } from "react-loader-spinner";
import RepoBox from "../RepositoriesBox/RepoBoxComponent";

const ReposComponent = (props) => {
  const { page, username } = props;
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadPage = async (page_no) => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=10&page=${page_no}`
        );
        const data = await response.json();
        setRepos(data);
      } catch (error) {
        console.error("Error fetching repositories:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPage(page);
  }, [page, username]);

  return (
    <>
      {loading ? (
        <div className="loader">
          <Circles height="120" width="120" color="#000000" visible={true} />
          <h4>Loading</h4>
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
