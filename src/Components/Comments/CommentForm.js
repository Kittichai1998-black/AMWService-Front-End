import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import Form from 'react-bootstrap/Form'
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';

import { v4 as uuid } from 'uuid';
import Paper from '@mui/material/Paper';

const Input = styled('input')({
  display: 'none',
});

const commonStyles = {
  bgcolor: 'background.paper',
  borderColor: 'text.primary',
  m: 1,
  border: 1,
  width: '5rem',
  height: '5rem',
};

const CommentForm = ({
  handleSubmit, //text จาก page comment
  submitLabel,
  hasCancelButton = false,
  handleCancel,
  initialText = "",
  namecomment,
}) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState([]);
  const [namephoto, setNamephoto] = useState("");
  const [ImageName, setImageName] = useState([]);
  const [imgFile, setImgFile] = useState([]);
  const [fileNamemig, setfileNamemig] = useState(null);
  const [CountFile, setCountFile] = useState(0);

  const isTextareaDisabled = text.length === 0;
  const onSubmit = (event) => {
    event.preventDefault();
    handleSubmit(text, ImageName, file, fileNamemig, namephoto);
      setText("");
      setImageName([]);
      setImgFile([]);
      setFile([])
      setfileNamemig(null);
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const PreviewImg = (e) => {
    const reader = new FileReader();
    let namefie = [];
    let chkfiles = [...e.target.files];
    let urlimg = [];
    let fileNameArray = [];
    let imgArray = "";

    for (let i = 0; i < chkfiles.length; i++) {
      // debugger
      namefie[i] = chkfiles[i].name;
      file.push(chkfiles[i])
    }
    chkfiles.forEach(async (x) => {
      let y = URL.createObjectURL(x);
      urlimg.push(y);
      // console.log(fileBase64);
      let namef = uuid();
      imgArray += "|" + namef;
      fileNameArray.push(namef);
      if (imgArray !== "" || imgArray !== null) {
        setfileNamemig(imgArray.replace("|", ""));
      }

      if (namefie.length > 0) {
        setFile([...file])
        setImgFile([...imgFile.concat(urlimg)])
        setImageName([...ImageName.concat(fileNameArray)]);
      } else {
        setImgFile([]);
      }
    })
    // console.log(imgFile)
  };

  const handleRemoveImg = (index) => {
    ImageName.splice(index, 1)
    setImageName([...ImageName])

    imgFile.splice(index, 1)
    setImgFile([...imgFile])

    file.splice(index, 1)
    setFile([...file])
  };

  return (
    <form onSubmit={onSubmit}>
       {/* <textarea
        defaultValue={namecomment}
        className="comment-form-textarea"
        onChange={(e) => setText(e.target.value)}
        /> */}
      
      <TextField
        id="outlined-multiline-static"
        defaultValue={namecomment}
        label="Text"
        multiline
        rows={4}
        style={{ width: '100%', marginTop: 15 }}
        variant="outlined"
        // error={Description !== null ? null : err}
        onChange={(e) => setText(e.target.value)}
      />
      {/* <Box style={{ paddingTop: 10 }}> */}
      <ImageList sx={{ width: 'auto', maxHight: 'auto', paddingTop: 2 }} cols={6} gap={8}>
        {imgFile &&
          imgFile.map((photo, index) => (
            <ImageListItem key={photo.img}>
              <Box textAlign='right'>
                <IconButton style={{ backgroundColor: "#eee", }} title="Remove Image" size="small" onClick={() => handleRemoveImg(index)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <img key={index} src={photo} style={{ width: 200, height: 180, margin: 16, border: '1px solid' ,borderRadius: 10}} />
            </ImageListItem>
          ))}
      </ImageList>
      {/* </Box> */}
      <Box textAlign='left' >
        <div style={{ width: "100%" }}>
          <Stack
            direction="row"
            spacing={3}
          >
            <b>Upload Image</b>
            <input accept="image/*" multiple type="file" onChange={PreviewImg} />
          </Stack>
        </div>
      </Box >

      <button className="comment-form-button" style={{ marginTop: 5, padding: 2, width: 80 }} disabled={isTextareaDisabled}>
        {submitLabel}
      </button>
      {
        hasCancelButton && (
          <button
            type="button"
            className="comment-form-button comment-form-cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        )
      }
    </form >
  );
};

export default CommentForm;