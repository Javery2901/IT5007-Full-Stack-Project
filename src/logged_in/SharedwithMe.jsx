import { graphQLFetch } from "../utils/GraphQLFetch";
import React, { useState, useEffect, useContext } from 'react';
import FileDownloader from "./FileDownloader"; 
import { GET_SHARED_FILES } from "../gql/queries.js";
import { useNavigate } from 'react-router-dom';
import "../styles/content.css"; 

function SharedwithMe( {user, setUser} ) {
    const [sharedFiles, setSharedFiles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSharedFiles = async () => {
            try {
                const data = await graphQLFetch(GET_SHARED_FILES, { ids: user.accessedFiles });
                setSharedFiles(data.getSharedFiles);
            } catch (error) {
                console.error('Error fetching shared files:', error);
            }
        };

        if (user && user.accessedFiles) {
            fetchSharedFiles();
        }
    }, [user]);
    
    return (
        <div className="shardWithMeDiv">
            <table style={{ width: '100%' }} align="center" className="mySharedTable">
                <thead>
                    <tr>
                        <th style={{ width: '35%' }}>File Name</th>
                        <th style={{ width: '35%' }}>Size</th>
                        <th style={{ width: '100%' }}>Uploaded Time</th>
                        <th style={{ width: '35%' }}>Download</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        sharedFiles.map((file) => (
                            <tr key={file._id}>
                                <td>{file.fileName}</td>
                                <td>{Math.round(file.fileSize / 100) / 10} KB</td>
                                <td>{file.uploadedTime}</td>
                                <td>
                                    <FileDownloader fileCid={file.fileHash} fileName={file.fileName} />
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default SharedwithMe;