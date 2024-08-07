import {React, useReducer} from 'react'
import "./searchBlock.css";


export const SearchBlock = ({result, addQuestion, setInput, questions, setKey}) => {
  
  const [_, forceUpdate] = useReducer(x => x + 1, 0);

  const handleClick = () => {
    addQuestion(result.title, result.titleSlug);
    setInput("");
    setKey(currentKey => currentKey+1)

  };



  return (
    <div className="search-result" onClick={handleClick}>{result.title}</div>
  )
}
