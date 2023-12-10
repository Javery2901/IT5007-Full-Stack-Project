export const GET_USER = `
  query GetUser($email: String!) {
    getUser(email: $email) {
      email
      password
      ownedFiles
      accessedFiles
    }
  }
`;

export const GET_FILES = `
  query GetFiles($ids: [ID!]) {
    getFiles(ids: $ids) {
      _id
      fileHash
      fileName
      fileSize
      uploadedTime
      ownerEmail
      sharedEmails
    }
  }
`;

export const GET_SHARED_FILES = `
  query GetSharedFiles($ids: [ID!]) {
    getSharedFiles(ids: $ids) {
      _id
      fileHash
      fileName
      fileSize
      uploadedTime
      ownerEmail
      sharedEmails
    }
  }
`;