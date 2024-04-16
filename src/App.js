import React, {useState, useRef, useEffect} from "react";
import "./App.css";
import {useData} from "./api/getData"; 

function App() {
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null); 
  const {data, isLoading: isDataLoading} = useData();

  useEffect(() => {
    if (inputRef.current) {
      const inputStyle = window.getComputedStyle(inputRef.current);
      const inputBackgroundColor =
        inputStyle.getPropertyValue("background-color"); 
      document.documentElement.style.setProperty(
        "--tag-background-color",
        inputBackgroundColor
      ); 
    }
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      if (tags.includes(inputValue.trim())) {
        setInputValue("");
        setShowSuggestions(false);
      } else {
        setTags([...tags, inputValue.trim()]);
        setInputValue("");
        setShowSuggestions(false); 
      }
    }
  };

  const handleTagClick = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSuggestionClick = (suggestion) => {
    setTags([...tags, suggestion.name]);
    setInputValue("");
    setShowSuggestions(false); 
  };

  const handleTagInputChange = (e) => {
    setInputValue(e.target.value);
    setShowSuggestions(true); 
  };

  const filteredSuggestions = data
    ? data.filter((suggestion) => !tags.includes(suggestion.name))
    : [];
  const showAddTagOption =
    inputValue.trim() !== "" &&
    !data.some(
      (suggestion) => suggestion.name.toLowerCase() === inputValue.toLowerCase()
    );

  return (
    <div className="container">
      <div className="tags-container">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="tag"
            style={{
              backgroundColor:
                data &&
                data.some(
                  (suggestion) =>
                    suggestion.name.toLowerCase() === tag.toLowerCase()
                )
                  ? null
                  : "var(--tag-background-color)",
            }}
            onClick={() => handleTagClick(tag)}
          >
            {tag}
            {data &&
              data.some(
                (suggestion) =>
                  suggestion.name.toLowerCase() === tag.toLowerCase()
              ) && <span className="tag-close">x</span>}
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleTagInputChange}
          onKeyDown={handleKeyDown}
          className="tag-input"
          ref={inputRef} 
        />
      </div>
      {showSuggestions &&
        inputValue.trim() !== "" &&
        !isDataLoading && ( 
          <div className="suggestions-container">
            {showAddTagOption && (
              <div
                onClick={() => handleSuggestionClick({name: inputValue})}
                className="suggestion"
              >
                Add "{inputValue}"
              </div>
            )}
            {filteredSuggestions
              .filter((suggestion) =>
                suggestion.name.toLowerCase().includes(inputValue.toLowerCase())
              )
              .map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="suggestion"
                >
                  {suggestion.name}
                </div>
              ))}
          </div>
        )}
    </div>
  );
}

export default App;
