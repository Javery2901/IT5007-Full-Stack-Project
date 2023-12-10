import { useHelia } from '../hooks/useHelia';
import React, { useState, useMemo, useCallback, useEffect, useContext } from "react";
import { unixfs } from "@helia/unixfs";
import { CID } from 'multiformats/cid';

function FileDownloader({ fileCid, fileName }) {
    const { helia } = useHelia();
  
    const downloadFile = useCallback(async () => {
        if (!helia) return;
    
        let fileContent = "";
        const decoder = new TextDecoder();
        const heliaFs = unixfs(helia); // Assuming unixfs is a method to work with file system
    
        for await (const chunk of heliaFs.cat(CID.parse(fileCid))) {
            fileContent += decoder.decode(chunk, { stream: true });
        }
    
        const blob = new Blob([fileContent], { type: 'image/png' });
        const link = document.createElement('a');
        link.download = fileName;
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [fileCid, fileName, helia]);
  
    return (
        <button className="standard-button" onClick={() => downloadFile(fileCid, fileName)}>Download</button>
    );
}
  
export default FileDownloader;