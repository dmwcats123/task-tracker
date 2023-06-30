"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

function UserAuthentication() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [inputError, setInputError] = useState("");
  const { push } = useRouter();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const toggleRegister = () => {
    setInputError("");
    setIsRegistering(!isRegistering);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setInputError("");

    const userInfo = {
      registering: isRegistering,
      username: username,
      password: password,
    };
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });
      const resData = await response.json();
      if (response.ok) {
        // Handle successful login
        // You can store the user token or any other necessary information
        push("/MainPage" + "?username=" + username);
      } else {
        // Handle login failure
        setInputError(resData.message);
        // You can display an error message to the user or perform any other necessary action
      }
    } catch (error) {
      // Handle error if API request fails
      setInputError(error);
    }

    // Clear form fields
    setUsername("");
    setPassword("");
  };

  return (
    <div className="max-w-xs mx-auto my-auto bg-slate-100 shadow-md rounded px-8 py-6">
      <h2 className="text-2xl text-center mb-6">
        {isRegistering ? "Register" : "Login"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          {isRegistering ? "Register" : "Login"}
        </button>
      </form>
      <p className="text-center mt-4">
        {isRegistering ? "Already have an account?" : "Don't have an account?"}
        <button
          className="text-blue-500 hover:text-blue-700 ml-1 focus:outline-none"
          onClick={() => toggleRegister()}
        >
          {isRegistering ? "Login" : "Register"}
        </button>
      </p>
      {inputError && (
        <div className="input-form-error text-red-500 mt-4">{inputError}</div>
      )}
    </div>
  );
}

export default UserAuthentication;
