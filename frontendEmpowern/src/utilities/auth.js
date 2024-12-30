// src/utilities/auth.js

// Example function to set a token in local storage
export const setToken = (token) => {
    localStorage.setItem("authToken", token);
  };
  
  // Example function to get the token from local storage
  export const getToken = () => {
    return localStorage.getItem("authToken");
  };
  
  // Example function to clear the token from local storage
  export const clearToken = () => {
    localStorage.removeItem("authToken");
  };
  