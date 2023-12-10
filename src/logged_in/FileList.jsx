import React, { useState, useMemo, useCallback, useEffect, useContext } from "react";
import { useHelia } from '../hooks/useHelia';
import FileUploader from "./FileUploader";
import { UploadType } from "./FileUploader";
import { unixfs } from "@helia/unixfs";
import { CID } from 'multiformats/cid';
import { GET_FILES } from "../gql/queries.js";
import { DELETE_FILE, UPDATE_SHARED_EMAILS } from "../gql/mutations.js";
import { graphQLFetch } from "../utils/GraphQLFetch.jsx";
import { sendEmail } from '../utils/utils'; 
import FileDownloader from "./FileDownloader"; 
import "../styles/content.css";


const parseEmails = (emailString, userEmail) => {
  return emailString.replace(userEmail, '').replace(',,', ',').replace(/,\s*$/, '').split(',').map(email => email.trim());
}

export default function FileList( { user, setUser } ) {

  const { helia } = useHelia()
  const [ ownedFiles, setOwnedFiles ] = useState([])
  const [ files, setFiles ] = useState({})
  const [ rerender, setRerender ] = useState(1);

  const heliaFs = useMemo(() => {
    if (helia == null) {
      return null
    }
    return unixfs(helia)
  }, [helia])

  useEffect(() => {
    const asyncFn = async () => {
      try {
        const data = await graphQLFetch(GET_FILES, { ids: user.ownedFiles });
        setOwnedFiles(data.getFiles);
      } catch (error) {
        console.log("Error fetching files: ", error);
      }
    }
    asyncFn();

    return
  }, [user, files, rerender]);


  const deleteFile = useCallback(async (id) => {
    
    try {
      const data = await graphQLFetch(DELETE_FILE, { id });
      const updatedUser = data.deleteFile;
      confirm("File deleted.");
      setUser(updatedUser);

      const fileRemovedInfo = 'file_removed';
      const sendEmailData = { email: user.email, content: fileRemovedInfo};
      console.log(sendEmailData.email, sendEmailData.content);
      await sendEmail(sendEmailData);

      // also send emal to all shared emails, to be completed.
      for (const email of sharedEmails) {
        const sendEmailData = { email: email, content: fileRemovedInfo };
        await sendEmail(sendEmailData);
      }

    } catch (error) {
      console.log("Error deleting file: ", error);
    }
  })


  const updateSharedEmails = useCallback(async (fileId, emailString) => {

    const emails = parseEmails(emailString, user.email)

    // Regular expression for basic email format validation
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Verify each email in the array
    for (const email of emails) {
      if (!emailFormat.test(email)) {
        confirm(`${email} is not of a valid email format`)
        return
      }
    }
    
    try {
      const data = await graphQLFetch(UPDATE_SHARED_EMAILS, { id: fileId, emails: emails });
      const fileName = data.updateSharedEmails.fileName;
      confirm(`Shared emails updated: ${fileName}`);
      setRerender(rerender + 1);

      const fileSharingContent = 'file_sharing';
      for (const email of emails){
        const sendEmailData = { email: email, content: fileSharingContent};
        await sendEmail(sendEmailData);
      }

    } catch (error) {
      console.log("Error updating shared emails: ", error);
    }
  }, [files])


  if (ownedFiles) {
    return (
      <div className="fileListTableDiv">
        <table align="center" className="myFileTable">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Size</th>
              <th>Uploaded Time</th>
              <th>Download</th>
              <th>Update</th>
              <th>Edit Shared Emails List</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {ownedFiles.map((file) => (
              <tr key={file._id}>
                <td>{file.fileName}</td>
                <td>{Math.round(file.fileSize / 100) / 10} KB</td>
                <td>{file.uploadedTime}</td>
                <td><FileDownloader fileCid={file.fileHash} fileName={file.fileName} /></td>
                <td><FileUploader uploadType={UploadType.UPDATE} fileId={file._id} files={files} setFiles={setFiles} /></td>
                <td>
                  <div className="emailInputDiv">
                    <input
                      className="emailInput" 
                      name={"sharedEmailsInput" + file._id} 
                      defaultValue={file.sharedEmails} 
                    />
                    <button className="save-button" 
                      onClick={() => {
                      let input = document.getElementsByName("sharedEmailsInput" + file._id)[0];
                      if (input.value !== input.defaultValue) {
                        updateSharedEmails(file._id, input.value)
                      }
                    }} 
                    >
                      Save
                    </button>
                  </div>
                </td>
                <td><button className="standard-button delete-button" onClick={() => deleteFile(file._id)}>Delete</button></td>
              </tr>)
            )}
          </tbody>
        </table>
      </div>
    )
  }
}