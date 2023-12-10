export const ADD_USER = `
  mutation AddUser($email: String!, $password: String!) {
    addUser(email: $email, password: $password) {
      email
      ownedFiles
      accessedFiles
    }
  }
`;

export const ADD_FILE = `
  mutation AddFile($fileHash: String!, $fileName: String!, $fileSize: Int!, $ownerEmail: String!) {
    addFile(fileHash: $fileHash, fileName: $fileName, fileSize: $fileSize, ownerEmail: $ownerEmail) {
      email
      ownedFiles
      accessedFiles
    }
  }
`;

export const DELETE_FILE = `
  mutation DeleteFile($id: String!) {
    deleteFile(id: $id) {
      email
      ownedFiles
      accessedFiles
    }
  }
`;

export const UPDATE_FILE = `
  mutation UpdateFile($id: String!, $fileHash: String!, $fileName: String!, $fileSize: Int!) {
    updateFile(id: $id, fileHash: $fileHash, fileName: $fileName, fileSize: $fileSize) {
      fileName
    }
  }
`;

export const UPDATE_SHARED_EMAILS = `
  mutation UpdateSharedEmails($id: String!, $emails: [String!]) {
    updateSharedEmails(id: $id, emails: $emails) {
      fileName
    }
  }
`;