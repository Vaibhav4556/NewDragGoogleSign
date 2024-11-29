import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import DragPage from "./DragPage";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import DragAPIcode from "./DragAPIcode";
function Content() {
  const [data, setData] = useState({
    email: "",
    phone: "",
    profession: "",
    userName: "",
  });

  const [showAddtask, setShowAddtask] = useState(false)
  const handleCloseAddtask=()=>{
    setShowAddtask(false)
  }

  const handleShowAddtask=()=>{
    setShowAddtask(true)
  }
  const Token = localStorage.getItem("token");

  useEffect(() => {
    axios

      .get("http://localhost:3003/content", {
        headers: {
          Token,
        },
      })
      .then((response) => {
        // setData(...data, setData({userName : response.data.message.userName ,email : response.data.message.email,phone:response.data.message.phone, profession : response.data.message.profession }))

        setData({
          ...data,
          email: response.data.message.email,
          phone: response.data.message.phone,
          profession: response.data.message.profession,
          userName: response.data.message.userName,
        });

        console.log(response.data.message.userName);

        // setData({email : response.data.message.email })
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div
      className="container shadow-lg p-3 mb-5 bg-body rounded"
      style={{ maxwidth: "60%", marginTop: "5%" }}
    >
     

      
      <Dialog
        open={showAddtask}
        onClose={handleCloseAddtask}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <div style={{padding:"20px 20px"}}>
        <DialogTitle id="alert-dialog-title">
          Fill the task details
        </DialogTitle>
        <div style={{padding:"10px" ,display:"flex", flexDirection:"column",gap:"20px"}}>
        <TextField id="outlined-basic" label="Title" variant="outlined" />
        <TextField id="outlined-basic" label="Description" variant="outlined" />
        </div>
        </div>
        <Button variant="contained" style={{margin:"30px",textTransform:"none"}}>Add Task</Button>
      </Dialog>
      <div>
        {/* <DragPage/> */}
        <DragAPIcode/>
      </div>
    </div>
  );
}

export default Content;
