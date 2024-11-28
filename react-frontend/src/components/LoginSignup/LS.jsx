import React, { useState } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import lsStyles from "./lsStyles.css";
//import B from "../../assets/B.png";

function LS() {
  const [action, setAction] = useState("Login");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);

  function handleClick() {
    setAction(prevAction => (prevAction === "Login" ? "Sign up" : "Login"));
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  return (
    <div className="container">
      {/* <img src={B} alt="Logo" className="logo" /> */}
      <h2>{action}</h2>
      <form>
        <input id="name" type="text" name="name" placeholder="Username"></input>
        {action === "Login" ? <div></div> : <input type="email" name="email" placeholder="Email"></input>}
        <div className="password-input">
          <input 
            type={passwordVisible ? "text" : "password"} 
            name="password" 
            placeholder="Password"
            onChange={(e) => setHasPassword(e.target.value.length > 0)}
          />
          {hasPassword && (
            <button 
              type="button" 
              className="eye-icon" 
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          )}
        </div>
        <button type="submit">{action}</button>
      </form>
      <div className="ChangeClick">
        {action === "Login" ? "Don't have an account? " : "Already have an account? "}
        <p onClick={handleClick}>{action === "Login" ? "Sign up" : "Login"}</p>
      </div>
    </div>
  );
}

export default LS;