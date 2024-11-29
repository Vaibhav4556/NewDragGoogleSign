import React, { useState,useEffect } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
const clientId = "174883911723-ofusqjjou2ip1dcntihss8alb2k3h38e.apps.googleusercontent.com";
function Login() {
  const [data,setData]=useState()
  const [emailData,setemailData] = useState()
  const navigate = useNavigate()
  const [user, setUser] = useState({
    email: "",
    password: "",
 
  });

  const handleSubmit = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const register = () => {
    const { email, password} = user;
  
    if (email && password) {
      
        console.log(user);

        axios
        .get("http://localhost:3003/content" )
        .then(response => console.log(response.data))

        axios
            .post("http://localhost:3003/login", user)
            .then(res => {
                setData(res.data.message)
                if(res.data.token)
               localStorage.setItem('token', res.data.token)
              
              });
            
              // !localStorage.getItem("token") ? navigate("/registration"):navigate("/")
            
    } else {
      alert({data});
      
    }
    
  };

  const Token = localStorage.getItem("token");

  //token availbale in storage redirect to localstorage
  useEffect(() => {
    Token?
    navigate("/content", { replace: true }):<></>
  }, [Token]);

  const handleSuccess = (response) => {
    console.log("Login Success: ", response.profileObj);

    // Send token to the backend
    fetch("http://localhost:5000/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tokenId: response.tokenId }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // Handle success or store user data
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleFailure = (response) => {
    console.log("Login Failed: ", response);
  };

  useEffect(() => {
    const initClient = () => {
      gapi.load("client:auth2", () => {
        gapi.auth2.init({
          client_id: clientId,
        });
      });
    };
    initClient();
  }, []);

  const handleLogin = () => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2
      .signIn()
      .then((googleUser) => {
        const profile = googleUser.getBasicProfile();
        const idToken = googleUser.getAuthResponse().id_token;

        console.log("User Profile:", {
          id: profile.getId(),
          name: profile.getName(),
          email: profile.getEmail(),
        });

        // Send the token to your backend
        fetch("http://localhost:3003/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tokenId: idToken }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Server Response:", data);
            setemailData(data)
            localStorage.setItem('token', data.token)
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      })
      .catch((error) => {
        console.error("Login Failed:", error);
      });
  };

  return (
    <>
      <div
        className="shadow-lg p-3 mb-5 bg-body rounded "
        style={{ width: "500px", margin: "auto", marginTop: "100px" }}
      >
        <h3>Login Page</h3>
        <div className="mb-3 row mt-4">
          <label htmlFor="email" className="col-sm-2 col-htmlForm-label">
            Email
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="htmlForm-control"
              name="email"
              id="email"
              value={user.email}
              onChange={handleSubmit}
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="password" className="col-sm-2 col-htmlForm-label">
            Password
          </label>
          <div className="col-sm-10">
            <input
              type="password"
              className="htmlForm-control"
              id="password"
              name="password"
              value={user.password}
              onChange={handleSubmit}
            />
          </div>
       
        </div>
        <div style={{marginLeft:"80px",gap:"20px",display:"flex",alignItems:"center"}}>
        <button className="btn btn-primary" onClick={handleLogin}>Login with Google</button>
        <button
          onClick={register}
          type="button"
          className="btn btn-primary"
          // style={{ marginLeft: "380px" }}
        >
          Login
        </button>
        </div>
        <h5 style={{color:"red"}}>{data}</h5>
      
      </div>

     
    </>
  );
}

export default Login;
