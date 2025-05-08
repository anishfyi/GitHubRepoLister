import React, { useEffect, useState } from "react";

const RepoBox = (props) => {
  const { repo } = props;
  const [languages, setLanguages] = useState([]);
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    const fetchLanguages = async (languages_url) => {
      try {
        const response = await fetch(languages_url);
        const data = await response.json();
        setLanguages(Object.keys(data));
      } catch (error) {
        console.error("Error fetching languages:", error);
      } finally {
        setLoaded(true);
      }
    };
    
    if (repo.languages_url) {
      fetchLanguages(repo.languages_url);
    }
  }, [repo.languages_url]);
  
  return (
    <div className="card-component" key={repo.id}>
      <h3 className="repo-name">{repo.name}</h3>
      <p className="repo-desc">
        {repo.description 
          ? repo.description.length > 100 
            ? `${repo.description.substring(0, 100)}...` 
            : repo.description
          : "No description available"}
      </p>
      <div className="repo-languages">
        {languages.map((language) => (
          <span className="repo-lang" key={language}>
            {language}
          </span>
        ))}
      </div>
    </div>
  );
};

export default RepoBox;
