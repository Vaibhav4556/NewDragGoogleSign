import React from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaHouseUser } from "react-icons/fa"


function Navbar() {

  const handleLogout = () => {
    try {
      localStorage.clear();
      window.location.reload();
      // navigate("/", { replace: true });
    } catch (err) {
      console.log(err);
    }
  };

    const navigate = useNavigate()
    let Token = localStorage.getItem('token')
    
  return (
    
    <nav className="navbar navbar-dark bg-dark" >
        
      <div  style={{display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center", width:"100%"}}>
      
        <div className="d-flex gap-3 " style={{marginLeft:"20px",padding:"10px"}} >
        <button type="button" class="btn btn-success"><FaHouseUser/></button>
                <button type="button" className="btn btn-primary"  >
               
          <NavLink style={{ color: "white", textDecoration: "none"}} to="./">
          
            Homepage
          </NavLink>
        </button>
      {
        !Token ?
        <button type="button" className="btn btn-primary">
          <NavLink
            style={{ color: "white", textDecoration: "none" }}
            to="./login"
          >
            
            Login
          </NavLink>{" "}
        </button>:    <button type="button" className="btn btn-primary" onClick={handleLogout}>
          <NavLink
            style={{ color: "white", textDecoration: "none" }}
            to="./login"
          >
            
            Logout
          </NavLink>{" "}
        </button>}
        
        {!Token ?
        <button type="button" className="btn btn-primary">
          <NavLink
            style={{ color: "white", textDecoration: "none" }}
            to="./registration"
          >
          
            Registration{" "}
          </NavLink>
        </button>:null}
        <button type="button" className="btn btn-primary" >
          <NavLink style={{ color: "white", textDecoration: "none" }} to="./content">
            
           Content
          </NavLink>
        </button>
        </div>
        <div style={{marginRight:"300px",display:"flex"}} >
        <button type="button" className="btn btn-primary"  onClick={()=>{navigate(-1)}}> Previous Page</button>
        <button  style={{marginLeft:"200px"}} type="button" className="btn btn-primary"  onClick={()=>{navigate(+1)}}> Next Page</button>
        </div>
      </div>
     
    </nav>
  
  );
}

export default Navbar;
