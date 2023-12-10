# course-project-team-16

### Decentralized File Storage & Sharing

## To run this app

1. Clone this repo to IT5007 docker container and navigate to the folder
2. Give control to our automation.sh shell script by `chmod +x automation.sh`
4. Run `./automation.sh`, which contains installing node 20.5.0, npm install, compile and start
7. Visit http://localhost:5173

## Features

1. Decentralized File Storage on IPFS
   1. File uploading and downloading are performed by the Helia service. The service generates an IPFS node in the server and discovers peer nodes in the web using libp2p***
   2. Files are encoded using JS `TextEncoder` before uploading onto IPFS

2. Email-based identification: Each user is identified by their email
   1. Email and password are required for signing up and logging in
      1. An activation link will be sent to the email to verify each signup
   2. A token is generated to maintain a user session
   3. File sharing is based on emails

3. Webpage functionalities
   1. View uploaded files
   2. View files shared with me
   3. Download any files I have access to

4. Sharing functionalities
   1. Use a comma `,` to separate the shared emails
   2. Share a file I uploaded with users (emails) by sending an email invitation
   3. Modify the list of users (emails) that have access to a file shared by me (add and remove)
   4. Accept an email invitation*
       1. If this email has not signed up, the app redirects to the sign up page
   5. User gets email notification when access to a shared file is removed
  
\* coming soon <br>
** some files such as png, pdf, zip cannot be converted into UInt8Array, hence cannot be uploaded to IPFS. See https://stackoverflow.com/questions/35265879/saving-a-uint8array-array-storing-rgba-to-a-png-file <br>
*** still need configurations for nodes hosted in the docker container to communicate with other nodes, hence files uploaded from one tab cannot be downloaded from another tab<br>

## Video Demo

Link to G-drive: https://drive.google.com/file/d/1lQ3hrvN7u2AmXzmzxHgcJCOyre8NbP9O/view?usp=sharing
