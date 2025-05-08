import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../App.css";

const MainPage = () => {
  const naigate = useNavigate();
  const [inputName, setInputName] = useState("");
  const changeName = (e) => {
    setInputName(e.target.value);
  };
  const submit = (e) => {
    if (e.key === "Enter") {
      return naigate(`/${inputName}`);
    }
  };
  return (
    <div className="container">
      <div className="search-container">
        <h1>GitHub Repository Lister: </h1>
        <input
          type="text"
          placeholder="Enter GitHub Username"
          onChange={(e) => changeName(e)}
          onKeyDown={(e) => submit(e)}
        />
        <Link to={`/${inputName}`}>
          <button className="submit">Submit</button>
        </Link>
      </div>
    </div>
  );
};

export default MainPage;
