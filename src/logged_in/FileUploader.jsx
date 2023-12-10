import React, { useState, useCallback, useContext, useMemo } from "react";
import { UserContext } from "../App.jsx";
import { useHelia } from '../hooks/useHelia';
import { unixfs } from '@helia/unixfs';
import { graphQLFetch } from '../utils/GraphQLFetch';
import { ADD_FILE, UPDATE_FILE } from '../gql/mutations';
import "../styles/content.css"; 

/**
 *
 * @param {File} file
 * @returns {Promise<Uint8Array>}
 */
async function readFileAsUint8Array (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const arrayBuffer = reader.result
      if (arrayBuffer != null) {
        if (typeof arrayBuffer === 'string') {
          const uint8Array = new TextEncoder().encode(arrayBuffer)
          resolve(uint8Array)
        } else if (arrayBuffer instanceof ArrayBuffer) {
          const uint8Array = new Uint8Array(arrayBuffer)
          resolve(uint8Array)
        }
        return
      }
      reject(new Error('arrayBuffer is null'))
    }

    reader.onerror = (error) => {
      reject(error)
    }

    reader.readAsArrayBuffer(file)
  })
}

export const UploadType = {
  ADD: 0,
  UPDATE: 1
}

/**
 * @returns {React.FunctionComponent}
 */
export default function FileUploader( {uploadType, fileId, files, setFiles, newFiles, setNewFiles} ) {

  const [ refresh, setRefresh ] = useState(1)
  const { user, setUser } = useContext(UserContext)
  const { helia } = useHelia()
  const heliaFs = useMemo(() => {
    if (helia == null) {
      return null
    }
    return unixfs(helia)
  }, [helia])

  const uploadFiles = useCallback(async (uploadType, fileId) => {
    if (heliaFs == null) {
      return
    }
    
    if (uploadType == UploadType.ADD) {
      for await (const file of newFiles) {
        const fileCid = await heliaFs.addBytes(await readFileAsUint8Array(file))
      
        const variables = {
          fileHash: fileCid.toString(),
          fileName: file.name,
          fileSize: file.size,
          ownerEmail: user.email
        }
        
        try {
          const data = await graphQLFetch(ADD_FILE, variables);
          const updatedUser = data.addFile
          setUser(updatedUser);
          setNewFiles([]);
        } catch (error) {
          console.log("Error adding file:", error);
        }
      }
    } else if (uploadType == UploadType.UPDATE) {
      const fileCid = await heliaFs.addBytes(await readFileAsUint8Array(files[fileId][0]))

      const variables = {
        id: fileId,
        fileHash: fileCid.toString(),
        fileName: files[fileId][0].name,
        fileSize: files[fileId][0].size,
      }
      
      try {
        const data = await graphQLFetch(UPDATE_FILE, variables);
        const updatedFile = data.updateFile.fileName;
        let filesToUpdate = files;
        filesToUpdate[fileId] = [];
        await setFiles({});
        setRefresh(refresh + 1);
        confirm(`File updated: ${updatedFile}`);
      } catch (error) {
        console.log("Error updating file:", error);
      }
    }

  }, [heliaFs, files, newFiles])


  const handleFileEvent = useCallback(async (e, fileId) => {
    const filesToUpload = Array.prototype.slice.call(e.target.files);

    if (uploadType == UploadType.ADD) {
      newFiles = filesToUpload;
      setNewFiles(filesToUpload);
      setRefresh(refresh + 1);
    } else {
      let filesToUpdate = files;
      filesToUpdate[fileId] = filesToUpload;
      setFiles(filesToUpdate);
      setRefresh(refresh + 1);
    }
    
  }, [files])


  return (
    <div className="fileUploaderElement">
      <div style={{ display: 'flex', alignItems: 'center' }}> {/* Add this line */}
        <label htmlFor={"FileUploaderInput" + fileId} style={{ marginRight: '1vw' }}> {/* Add marginRight for spacing */}
          <a
            className="btn btn-secondary"
            style={{
              border: "1px solid gray",
              padding: "0.5vh 1vw",
              cursor: "pointer",
              borderRadius: "3px",
              fontSize: "0.9em",
            }}
          >
            {uploadType == UploadType.ADD ? "Select Files" : "Select File"}
          </a>
        </label>
        <button 
          onClick={() => uploadFiles(uploadType, fileId)}
          className="standard-button"
          style={{
            padding: "0.8vh 1vw",
          }}>
          {uploadType == UploadType.ADD ? "Upload" : "Update"}
        </button>
      </div> {/* Close the flex container div here */}
      <input
        style={{ display: "none" }}
        id={"FileUploaderInput" + fileId}
        type="file"
        multiple
        onChange={(e) => handleFileEvent(e, fileId)}
      />
      <div id={fileId} className="fileUploader-list" style={{ paddingTop: "1vh" }}>
        {uploadType == UploadType.ADD ? (newFiles.map((file, idx) => (
          <div key={idx} style={{ color: newFiles.length > 0 ? 'grey' : 'defaultColor' }}>{file.name}</div>
        ))) : (files[fileId] ? (
          <div style={{ color: files[fileId].length > 0 ? 'grey' : 'defaultColor' }}>{files[fileId][0].name}</div>
        ) : (
          <></>
        ))}
      </div>
    </div>
  );
}
