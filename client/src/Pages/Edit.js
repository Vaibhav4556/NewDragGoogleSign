import axios from "axios";
import React, { useEffect, useState } from "react";
const Token = localStorage.getItem("token");
function Edit() {
  const [data, setData] = useState();
  useEffect(() => {
    axios
      .put("http://localhost:3003/edit" ,{headers :{
        Token
              } })
      .then((res) => setData(res))
      .catch((err) => console.log(err));
  },[Token]);
  console.log(data);
  return <div>Edit</div>;
}

export default Edit;
