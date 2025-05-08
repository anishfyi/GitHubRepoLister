import React, { useEffect, useState } from "react";
import Card from 'react-bootstrap/Card';
import { Circles } from "react-loader-spinner";

const RepoBox = (props) => {
  const { repo } = props;
  const [languages, setLanguages] = useState([]);
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    const fetchLanguages = async (languages_url) => {
      const response = await fetch(languages_url);
      const data = await response.json();
      setLanguages(Object.keys(data));
      setLoaded(true);
    };
    
    if (repo.languages_url) {
      fetchLanguages(repo.languages_url);
    }
  }, [repo.languages_url]);
  
  return (
    <Card border="secondary" style={{ width: '28rem' }}>
      <Card.Header>{repo.name}</Card.Header>
        <div className="card-component" key={repo.id}>
          <Card.Text><p className="repo-desc">{repo.description?.substring(0, 25)}...</p>
          <div className="repo-languages">
          {(
            <>
              {languages.map((language) => (
                <span className="repo-lang" key={language}>
                  {language}
                </span>
              ))}
            </>
          )}
      </div></Card.Text>
    </div>
    </Card>
  );
};

export default RepoBox;
