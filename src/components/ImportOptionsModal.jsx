import { Button, Menu, MenuItem } from '@mui/material';
import React, { useRef, useState } from 'react'
import { ImportFamilyBtn } from './Buttons/ImportFamilyBtn';
import { useTreeState } from '../contexts';

const style={
  //backgroundColor:'#e7f5ec',
  // color:'black',
  border:'0px',
  marginTop:'0px',
  marginBottom:'0',
  paddingTop:'0px',
  fontSize:14,
  
}
const ImportOptionsModal = ({setOpenModal,openModal}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [data,setData] = useTreeState()
  const [files,setFiles] = useState([])

  const inputRef = useRef(null)
  
  const handleFileUpload = (file) => {
    const fr = new FileReader()
    fr.onload = function (e) {
      try {
        const result = JSON.parse(e.target.result)
        const formatted = JSON.stringify(result, null, 2)
        result.value = formatted

        // console.log(result)
        setData(result)
        // setSelectedNode(result)
      } catch (error) {
        // console.error('Error parsing JSON:', error)
        alert('Invalid JSON file')
      } finally {
        setIsUploading(false)
      }
    };

    fr.readAsText(file)
  }

  const handleUploadClick = () => {
    inputRef.current.click()
  }

  const handleInputChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setIsUploading(true)
      handleFileUpload(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      setIsUploading(true)
      handleFileUpload(file)
    }
  }
  const getToken = () => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    console.log(accessToken);
    if (accessToken) {
      localStorage.setItem('accessToken',accessToken)
      return accessToken
    } else {
      console.error('Error retrieving access token');
    }
  }
  const handleReadFile = async () => {
    const accessToken = getToken()
    const folderId = process.env.REACT_APP_FOLDER_ID
    const apiKey = process.env.REACT_APP_API_KEY
    console.log(accessToken);
    if (!accessToken) {
      console.error('Access token not available. Please authenticate first.');
      return;
    }

    const apiUrl = 'https://www.googleapis.com/drive/v3/files'; // Replace FILE_ID with the actual file ID
    const response = await fetch(`${apiUrl}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      
    });

    if (response.ok) {
      const data = await response.json();
      console.log('File data:', data.files);
      if (data.files) {
        setFiles(data.files.filter(file => file.mimeType === 'application/json'));
      }
    } else {
      console.error('Failed to read file:', response.status, response.statusText);
    }
  };

  return (
    <Menu
      sx={{
        marginLeft:`40px`,
        paddingTop:'0',
        
      }}
      
      id="basic-menu"
      // anchorEl={anchorEl}
      open={openModal}
      onClose={() => setOpenModal(false)}
      // onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
      onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
    >
        <input
          id="upload"
          ref={inputRef}
          type="file"
          style={{ display: 'none' }}
          onChange={handleInputChange}
        />
      <MenuItem sx={style} onClick={handleUploadClick} >
        Local Disk
      </MenuItem>
      <MenuItem sx={style} onClick={handleReadFile} >Import From Google Drive</MenuItem>
     
    </Menu>
  )
}

export default ImportOptionsModal