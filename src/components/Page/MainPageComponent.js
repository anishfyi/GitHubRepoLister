import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();
  const [inputName, setInputName] = useState("");
  
  const changeName = (e) => {
    setInputName(e.target.value);
  };
  
  const submit = () => {
    if (inputName.trim()) {
      navigate(`/${inputName}`);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      submit();
    }
  };
  
  return (
    <div className="container">
      <div className="search-container">
        <h4>GitHub Repository Explorer</h4>
        <input
          type="text"
          placeholder="Enter GitHub Username"
          value={inputName}
          onChange={changeName}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <button 
          className="submit" 
          onClick={submit}
          disabled={!inputName.trim()}
        >
          Explore Repositories
        </button>
      </div>
    </div>
  );
};

export default MainPage;
