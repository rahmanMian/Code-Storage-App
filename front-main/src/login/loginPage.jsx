import React, {useState, useEffect} from 'react';
import logo from '../img/logo.png'; // Adjust the path as per your folder structure
import image1 from '../img/image1.png';
import image2 from '../img/image2.png';
import image3 from '../img/image3.png'
import {CustomAlert} from './customAlert';
import './loginPage.css'; // Adjust the path as per your folder structure
import { Navigate, useNavigate } from 'react-router-dom';
import {registerUser} from '../server/Firebase/register.js';
import { signinUser } from '../server/Firebase/signin.js';
import { resetPassword } from '../server/Firebase/forgotPassword.js';
import { googleSignin } from '../server/Firebase/googleSignin.js';
import { addUserToDB } from '../add/addQuestion.jsx';


export const LoginPage = () => {
  const [isSignUpMode, setSignUpMode] = useState(false);
  const [activeBullet, setActiveBullet] = useState(1);
  const [inputFocus, setInputFocus] = useState({});
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [classNameFront, setClassNameFront] = useState("");
  const [classNameBack, setClassNameBack] = useState("is-flipped");
  const navigate = useNavigate();

  
  const handleShowAlert = () => {
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };




  const handleFocus = (index) => {
    setInputFocus({ ...inputFocus, [index]: true });
  };

  const handleBlur = (index, value) => {
    if (value !== "") return;
    setInputFocus({ ...inputFocus, [index]: false });
  };

  const handleToggle = () => {
    setSignUpMode(!isSignUpMode);
    handleFlipBack();
  };

  const moveSlider = (index) => {
    setActiveBullet(index);
  };

    // Function to automatically move the slider
    const autoMoveSlider = () => {
      setActiveBullet((prev) => (prev % 3) + 1);
    };
  
    // Use effect to set up interval for automatic sliding
    useEffect(() => {
      const intervalId = setInterval(() => {
        autoMoveSlider();
      }, 5000); // Change image every 5 seconds
  
      // Clean up the interval on component unmount
      return () => clearInterval(intervalId);
    }, []);

    const handlePassword1Change = (event) => {
      const newPassword1 = event.target.value;
      setPassword1(newPassword1);
    };
  
    const handlePassword2Change = (event) => {
      const newPassword2 = event.target.value;
      setPassword2(newPassword2);
    };



    const handleSubmit = (event) =>{
      registerUser(document.getElementById("signup-email").value, password1, password2, event);
    }

    const handleSignIn = async (event) =>{
      const signinEmail = document.getElementById("signinEmail").value;
      const signinPass = document.getElementById("signinPassword").value
      
      const isSuccess = await signinUser(signinEmail, signinPass, event);
      if(isSuccess){
      localStorage.setItem("currentEmail", signinEmail);
      navigate("/login-to-app");
      }
      
      
    }
    
    
    const handleGoogleSignIn = async (event) =>{
  
      
      const email = await googleSignin(event);

      if(email){
      addUserToDB(email);
      localStorage.setItem("currentEmail", email);
      navigate("/login-to-app");
      }
      
    }
    

    const handleFlipBack = () => {
       setClassNameBack("is-flipped");
       setClassNameFront("");
    }

    const handleFlipFront = () => {
      setClassNameFront("is-flipped");
      setClassNameBack("");
    }

    const handleResetPassword = (event) =>{
      const resetEmail = document.getElementById("resetPasswordEmail").value;
      resetPassword(resetEmail, event);
    }
  
   
  return (
    <main className={isSignUpMode ? "sign-up-mode" : ""}>
      <div className="box">
        <div className="inner-box">
          <div className="forms-wrap">
            <form autoComplete="off" className="sign-in-form">
              <div className="logo">
                <img src={logo} alt="LeetBank" />
                <h2>LeetBank</h2>
              </div>

              <div className="heading">
                <h2>Welcome Back</h2>
                <h6>Not registered yet?</h6>
                <button type="button" className="toggle" onClick={handleToggle}>
                  Sign up
                </button>
               <div id="signinMessage" className="form__message form__message--error"></div>
              </div>

              <div className="actual-form">
                <div className={`input-wrap ${inputFocus[1] ? "active" : ""}`}>
                  <input
                    type="text"
                    minLength="4"
                    className="input-field"
                    placeholder= "Email"
                    id="signinEmail"
                    autoComplete="off"
                    onFocus={() => handleFocus(1)}
                    onBlur={(e) => handleBlur(1, e.target.value)}
                    required
                  />
                </div>
                <div id="signinEmailError" className="form__input-error-message"></div>

                <div className={`input-wrap ${inputFocus[2] ? "active" : ""}`}>
                  <input
                    type="password"
                    minLength="4"
                    className="input-field"
                    placeholder="Password"
                    id="signinPassword"
                    autoComplete="off"
                    onFocus={() => handleFocus(2)}
                    onBlur={(e) => handleBlur(2, e.target.value)}
                    required
                  />
                </div>
                <div id="signinPasswordError" className="form__input-error-message"></div>

                <input type="submit" value="Sign In" className="sign-btn" onClick={handleSignIn} />
                <input type="submit" value="Sign in with Google" className="sign-btn" id="google-btn" onClick={handleGoogleSignIn} />

                <p className="text">
                  Forgotten your password?  <a onClick={handleFlipFront} className='help-link'>Get help</a> signing in
                </p>
              </div>
            </form>

              {/*Sign up form*/ }
            <form autoComplete="off" className="sign-up-form">
              <div className="logo">
                <img src={logo} alt="LeetBank" />
                <h2>LeetBank</h2>
              </div>

              <div className="heading">
                <h2>Get Started</h2>
                <h6>Already have an account?</h6>
                <button type="button" className="toggle" onClick={handleToggle}>
                  Sign in
                </button>
                <div id="loginMessage" className="form__message form__message--error"></div>
              </div>

              <div className="actual-form">
                <div className={`input-wrap ${inputFocus[3] ? "active" : ""}`}>
                  <input
                    type="text"
                    minLength="4"
                    placeholder="Email"
                    className="input-field"
                    id="signup-email"
                    autoComplete="off"
                    onFocus={() => handleFocus(3)}
                    onBlur={(e) => handleBlur(3, e.target.value)}
                    required
                  />
                </div>
                <div id="emailError" className="form__input-error-message"></div>

                <div className={`input-wrap ${inputFocus[4] ? "active" : ""}`}>
                  <input
                    type="password"
                    minLength="6"
                    className="input-field"
                    placeholder="Password"
                    id="choosePassword"
                    autoComplete="off"
                    onChange={handlePassword1Change}
                    onFocus={() => handleFocus(4)}
                    onBlur={(e) => handleBlur(4, e.target.value)}
                    required
                  />
                </div>
                <div  id="passwordError" className="form__input-error-message"></div>

                <div className={`input-wrap ${inputFocus[5] ? "active" : ""}`}>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Confirm Password"
                    id="confirmPassword"
                    autoComplete="off"
                    onChange={handlePassword2Change}
                    onFocus={() => handleFocus(5)}
                    onBlur={(e) => handleBlur(5, e.target.value)}
                    required
                  />
                </div>
                <div id="passwordMatchError" className="form__input-error-message"></div>

            
                <input type="submit" value="Sign Up" className="sign-btn" onClick={handleSubmit}/>
                            
              {showAlert && (
                <CustomAlert
                  message="Passwords do not match. Please try again."
                  onClose={handleCloseAlert}
                />
              )}


                <p className="text">
                  By signing up, I agree to the <a href="#">Terms of Services</a> and <a href="#">Privacy Policy</a>
                </p>
              </div>
            </form>
          </div>
           
          <div className='flip-container'>
          <div  className={`carousel front ${classNameFront}`}>
            <div className="images-wrapper">
              <img
                id="image1"
                src={image1}
                className={`image img-1 ${activeBullet === 1 ? "show" : ""}`}
                alt="Access your LeetCode Questions"
              />
              <img
                id="image3"
                src={image2}
                className={`image img-2 ${activeBullet === 2 ? "show" : ""}`}
                alt="Store your Solutions"
              />
              <img
                id="image3"
                src={image3}
                className={`image img-3 ${activeBullet === 3 ? "show" : ""}`}
                alt="Quickly access your solutions"
              />
            </div>

            <div className="text-slider">
              <div className="text-wrap">
                <div
                  className="text-group"
                  style={{ transform: `translateY(${-(activeBullet - 1) * 2.55}rem)` }}
                >
                  <h2>Access your LeetCode Questions</h2>
                  <h2>Store your Solutions</h2>
                  <h2>Quickly access your solutions</h2>
                </div>
              </div>

              <div className="bullets">
                <span
                  className={activeBullet === 1 ? "active" : ""}
                  data-value="1"
                  onClick={() => moveSlider(1)}
                ></span>
                <span
                  className={activeBullet === 2 ? "active" : ""}
                  data-value="2"
                  onClick={() => moveSlider(2)}
                ></span>
                <span
                  className={activeBullet === 3 ? "active" : ""}
                  data-value="3"
                  onClick={() => moveSlider(3)}
                ></span>
              </div>
            </div>
          </div>

          <div  className={`carousel back ${classNameBack}`}>
              <div className="heading">
                <h2>Forgotten Your Password?</h2>
                <h6>Enter your email for a reset link</h6>
              </div>
              <div id="forgottenPassword"></div>
              <div className={`input-wrap forgotten-email`}>
                  <input
                    type="text"
                    minLength="4"
                    placeholder="Email"
                    id="resetPasswordEmail"
                    className="input-field"
                    autoComplete="off"
                    onFocus={() => handleFocus(3)}
                    onBlur={(e) => handleBlur(3, e.target.value)}
                    required
                  />
                </div>
                <input type="submit" value="Send Link" id="forgot-btn" className="forgot-btn" onClick={handleResetPassword} />
          </div>
          </div>
        </div>
      </div>
    </main>
  );
};


