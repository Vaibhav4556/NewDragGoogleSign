import React, { useState } from "react";
import axios from "axios"
function Registration() {
  const [data,setData]=useState()
  const [user, setUser] = useState({
    email: "",
    password: "",
    cpassword: "",
    phone : "",
    profession  : "",
    userName : "",

  });

  const handleSubmit = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const register = () => {
    const { email, password,phone, profession,userName } = user;
  
    if (email && password && password === user.cpassword) {
      if (password.length > 5) {
        console.log(user);
        axios
            .post("http://localhost:3003/register", user)
            .then(res => setData(res.data.message));


      } else {
        alert("password should greater than 5 character");
      }
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <>
      <div
        className="shadow-lg p-3 mb-5 bg-body rounded "
        style={{ width: "500px", margin: "auto", marginTop: "100px" }}
      >
        <h3>Registration Page</h3>
        <div className="mb-3 row mt-4">

        <label htmlFor="userName" className="col-sm-2 col-htmlForm-label">
            Name
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="htmlForm-control"
              name="userName"
              id="username"
              value={user.userName}
              onChange={handleSubmit}
            />
          </div>
        </div>
          

        <div className="mb-3 row mt-4">
          <label htmlFor="profession" className="col-sm-2 col-htmlForm-label">
            Profession
          </label>
          <div className="col-sm-10 mb-3">
            <input
              type="text"
              className="htmlForm-control"
              name="profession"
              id="profession"
              value={user.profession}
              onChange={handleSubmit}
            />
          </div>
          
          <label htmlFor="phone" className="col-sm-2 col-htmlForm-label">
            Phone
          </label>
          <div className="col-sm-10 mb-3">
            <input
              type="text"
              className="htmlForm-control"
              name="phone"
              id="phone"
              value={user.phone}
              onChange={handleSubmit}
            />
          </div>

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

        <div className="mb-3 row">
          <label htmlFor="cpassword" className="col-sm-2 col-htmlForm-label">
            Confirm Password
          </label>
          <div className="col-sm-10">
            <input
              type="password"
              name="cpassword"
              className="htmlForm-control"
              id="cpassword"
              value={user.cpassword}
              onChange={handleSubmit}
            />
          </div>
        </div>

        <button
          onClick={register}
          type="button"
          className="btn btn-primary"
          style={{ marginLeft: "380px" }}
        >
          Register
        </button>
        <h5 style={{color:"red"}}>{data}</h5>
      </div>
    </>
  );
}

export default Registration;
