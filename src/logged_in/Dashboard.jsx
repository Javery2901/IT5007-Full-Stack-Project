import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import FileList from "./FileList";
import { useFiles } from "../hooks/useFiles";
import FileUploader from "./FileUploader";
import { UploadType } from "./FileUploader";
import FileProvider from "../provider/FileProvider";
import { UserContext } from "../App.jsx";
import "../styles/content.css";

function Dashboard( {user, setUser} ) {

  const [ files, setFiles ] = useState([])
  const navigate = useNavigate();

  return (
    <UserContext.Provider value={{ user, setUser }}>
        <FileProvider>
        <div className="dashboardContent">
          <div className="fileUploaderDiv">
            <FileUploader uploadType={UploadType.ADD} fileId={"0"} newFiles={files} setNewFiles={setFiles}/>
          </div>
            <FileList user={user} setUser={setUser} />
        </div>
        </FileProvider>
    </UserContext.Provider>
  );
}

export default Dashboard; 