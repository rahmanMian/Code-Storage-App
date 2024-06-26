import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import "../App.css";
import { CreateBlocks } from "./createBlocks";
import { ShuffleOutput } from "../shuffle/shuffleOutput";
import { SearchBar } from "./searchBar";
import { SearchBlocks} from "./searchBlocks";
import { QuestionSearchBar } from "./questionSearchBar";
import { AddedSearchBlocks } from "./addedSearchBlocks";
import logo from '../img/logo.png'; // Adjust the path based on your directory structure





/**
 * Component to add and manage questions.
 *
 * @function AddQuestion
 * @returns {JSX.Element} The rendered AddQuestion component.
 * @description Manages the state of questions and handles adding new questions. Persists questions to localStorage.
 * @author Rahman Mian
 */
export function AddQuestion() {

    //gets the locally stored values of questions stored
   const [questions, setQuestion] = useState(() => {
        const localValue = localStorage.getItem('QUESTIONS');
        if (localValue === null) return [];
        return JSON.parse(localValue);
    });
    

    //array for list of preffered vals
    const [results , setResults] = useState([]);

    //array for list of vals that you have added
     const [searchResults , setSearchResults] = useState([]);

    //to use for question input
    const [input, setInput] = useState("");

    
    //to use for question search input
    const [searchInput, setSearchInput] = useState("");

    const [searchBarClicked, setSearchBarClicked] = useState(false);

    const [searchBarAddedClicked, setSearchBarAddedClicked] = useState(false);


    //locally stores questions added my users 
    useEffect(() => {
        localStorage.setItem("QUESTIONS", JSON.stringify(questions));
    }, [questions]);



    //locally stores the index for randow shuffle
    const [index, setIndex] = useState(() => {
        const index = sessionStorage.getItem('shuffledIndex');
        return index !== null ? parseInt(index) : Number.MAX_SAFE_INTEGER;
    });

    //stores 
    useEffect(() => {
            sessionStorage.setItem('shuffledIndex', index);
    }, [index]);


    /**
     * Adds a new question to the state.
     *
     * @function addQuestion
     * @author Rahman Mian
     * @param {string} title - The title of the new question.
     */
    function addQuestion(title, titleSlug) {
        // Check if the question already exists
        const questionExists = questions.some(question => question.title === title);
    
        if (questionExists) {
            alert("Question already added!");
        } else {
            const newQuestion = {
                id: uuidv4(),
                title: title,
                titleSlug: titleSlug,
                comment: ""
            };
            setQuestion(questions => [newQuestion, ...questions]);
        }
    }
    

     /**
     * Adds a new question to the state.
     *
     * @function addQuestion
     * @author Rahman Mian
     * @param {string} id - The title of the question.
     * @param {string} comment - comment user adds
     */
    function addComment(id, comment) {
        setQuestion(questions => //questions => // questions.map is for robust state management in react 
            questions.map(question => 
                question.id === id ? { ...question, comment: comment } : question
            )
        );
    }


    return (
        <>
             
             <div className="searchContainer">
             <SearchBar setResults={setResults} setInput = {setInput} setSearchBarClicked ={setSearchBarClicked}/>
             {searchBarClicked && <SearchBlocks results = {results} addQuestion={addQuestion} setInput={setInput}/>}
             </div>


            <div className="history-block">
            
            {/*Renders the shuffle block usiing an index generated*/}
            <ShuffleOutput questionArray={questions} setIndex={setIndex} index ={index}/>
             
             <div className="searchAddedContainer">
            <QuestionSearchBar setSearchResults={setSearchResults}  setSearchInput = {setSearchInput} questions={questions} setSearchBarAddedClicked = {setSearchBarAddedClicked} />
            {searchBarAddedClicked && <AddedSearchBlocks setSearchResults={setSearchResults}  searchResults={searchResults} setSearchInput={setSearchInput} questions={questions}/>}
            </div>
            <div className="inner-box-app">
            {/*Renders the blocks using and the comments*/}
            <CreateBlocks questionArray={questions} setQuestion={setQuestion} setIndex={setIndex} addComment={addComment}/>
            </div>
            </div>
        </>
    );
}
