import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import "../App.css";
import { CreateBlocks } from "./createBlocks";
import { ShuffleOutput } from "../shuffle/shuffleOutput";
import { SearchBar } from "./searchBar";
import { SearchBlocks} from "./searchBlocks";
import { QuestionSearchBar } from "./questionSearchBar";
import { AddedSearchBlocks } from "./addedSearchBlocks";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, doc, addDoc, query, querySnapshot, updateDoc, where, getDocs, getDoc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import logo from '../img/logo.png'; // Adjust the path based on your directory structure

// Your Firebase configuration object
const firebaseConfig = {
    apiKey: process.env.REACT_APP_AUTH_KEY,
    authDomain: "leetbank-auth.firebaseapp.com",
    databaseURL: "https://leetbank-auth-default-rtdb.firebaseio.com",
    projectId: "leetbank-auth",
    storageBucket: "leetbank-auth.appspot.com",
    messagingSenderId: "687062345726",
    appId: "1:687062345726:web:421eea1cc2d57fdfa602af",
    measurementId: "G-NP2RXNWYRQ"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  
  // Initialize Firestore
  const db = getFirestore(app);
  
  // Now you can use `db` to interact with Firestore
  

  // Function to check for duplicate email and add user if no duplicate is found
export const addUserToDB = async (email) => {
    try {
       
        const userCollectionRef = collection(db, 'users');

        // Query to find users with the specified email
        const userQuery = query(userCollectionRef, where('email', '==', email));
        const userSnapshot = await getDocs(userQuery);

        if (userSnapshot.empty) {
            console.log("No user found with the specified email.");
            return;
        }

        const userDoc = userSnapshot.docs[0];
        const userDocRef = doc(db, 'users', userDoc.id);

           // Get the user's questions
           const userData = userDoc.data();
           const questions = userData.questions || [];

        if (querySnapshot.empty) {
            // No duplicate found, add the new user
            const docRef = await addDoc(userCollectionRef, {
                email: email,
                questions: []
            });
            console.log("Document written with ID: ", docRef.id);
        } else {
            // Duplicate found
            console.log("Email already exists in the database.");
        }
    } catch (error) {
        console.error("Error adding document: ", error.message);
    }
};


export const addQuestionToDB = async (title, titleSlug) => {
    try {
        const userDocRef = doc(db, 'users', sessionStorage.getItem("currentEmail"));
        const userDocSnap = await getDoc(userDocRef);



        if (!userDocSnap.exists()) {
            console.log("No user found with the specified ID.");
            return;
        }

        const userData = userDocSnap.data();
        const questions = userData.questions || [];

        // Check if the question title already exists in the user's questions array
        const titleExists = questions.some(question => question.title === title);

        if (titleExists) {
            console.log("Question title already exists.");
            return;
        } else {
            // Create the new question
            const newQuestion = {
                id: uuidv4(),
                title: title,
                titleSlug: titleSlug,
                comment: ""
            };

            // Add the new question to the user's questions array
            // Add the new question at the top of the array
            const updatedQuestions = [newQuestion, ...questions];

            // Update the user's document with the new questions array
            await updateDoc(userDocRef, {
                questions: updatedQuestions
            });

            console.log("Question added successfully.");
        }
    } catch (error) {
        console.error("error adding question", error.message);
    }




}

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
              /*last worked on point*/ 
            addQuestionToDB(title, titleSlug);
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
