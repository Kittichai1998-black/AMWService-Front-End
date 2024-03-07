import React, { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { CommentAPI } from '../../intercepetors/axios';
import axios from 'axios';

const Comments = ({ commentsUrl, currentUserId, service_no }) => {
  const [backendComments, setBackendComments] = useState([]);
  const [activeComment, setActiveComment] = useState("");
  const [ParentID, setParentID] = useState("");
  const [dataDetail, setDataDetail] = useState([]);
  // const [texteditor, settexteditor] = useState(text);
  // const initialValue = 1;
  const [Images, setImageFile] = useState([])
  const queryParams = new URLSearchParams(window.location.search);
  const ServiceID = queryParams.get("ServiceID")
  // const ServiceNo = queryParams.get('so')
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [userID, setUserID] = useState(localStorage.getItem("userID"));
  const rootComments = backendComments.filter(
    (backendComment) => backendComment.parentID === null
  );
  const messageID = backendComments
  const imagecomment = Images

  const getReplies = (commentId) =>
    backendComments
      .filter((backendComment) => backendComment.parentID === commentId)
      .sort(
        (a, b) =>
          new Date(a.createTime).getTime() - new Date(b.createTime).getTime()
      );

  useEffect(() => {
    getMessage()
    if (activeComment.id !== undefined) {
      setParentID(activeComment.id)
    }
    else {
      setParentID("")
    }
    // console.log(activeComment)
    // console.log(currentUserId)
  }, [activeComment]);

  const addComment = (text,ImageName, file, fileNamemig) => {
    // console.log(text)
    // console.log(ParentID)
    // console.log(ImageName)
    // console.log(file)
    // console.log(fileNamemig)
    const formData = new FormData();
    // formData.append('ID', 0)
    formData.append('Service_ID', ServiceID)
    formData.append('Service_No', service_no)
    formData.append('UserID', userID)
    formData.append('UserName', user.replace(/['"]+/g, ''))
    formData.append('Description', text)
    formData.append('ParentID', ParentID)
    formData.append('Status', 1)
    formData.append('CreateBy', userID)
    formData.append('CreateTime', new Date().toISOString())
    // formData.append('ImageFile', file)

    axios({
      method: 'post',
      url: CommentAPI.API_URL,
      data: formData
    })
      .then(function (response) {
        if (response.data.status === "Success") {
          SaveImage(ImageName, file, fileNamemig);
          // getMessage();
          setParentID("");
          setBackendComments([response, ...backendComments]);
          setActiveComment("");
          getMessage()
          setTimeout(() => {
            getMessage()
          }, 1000)
          // setTimeout(() => {
          //   refreshPage()
          // }, 1000)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  async function SaveImage(ImageName, file, fileNamemig,namephoto) {
    for (let i of Object.keys(ImageName)) {
      const formData = new FormData();
      formData.append('Pic_Repair_AQ_Id', 0)
      // formData.append('PRAQ_Name_Full', file)
      formData.append('PRAQ_Name', ImageName)
      formData.append('PRAQ_Ans_Question_Id', ParentID)
      formData.append('PR_Repair_Id', ServiceID)
      formData.append('ImageFile', file[i])
      formData.append('Status', 1)
      formData.append('CreateBy', userID)
      // formData.append('ImageSrc', '1')
      // console.log(file);
      // console.log(namephoto);
      await axios({
        method: 'post',
        url: CommentAPI.API_URL + '/ImageComment',
        data: formData
      }).then((res) => {
        if (res.data.status === "Success") {
          // setTimeout(() => {
          //   getMessage()
          //   refreshPage()
          // }, 1000)
        }
      })
    }
  }

  async function getMessage() {
    axios.get(CommentAPI.API_URL + '/Message?Service_ID=' + ServiceID
    ).then(res => {
      setBackendComments(res.data);
      // messageID(res.data)
    })
      .catch((err) => {
        return err;
      });
  }

  // async function GetImages() {
  //   axios.get(CommentAPI.API_URL + '/GetImageComment', { params: { RepairID: ServiceID } }
  //   ).then(res => {
  //     setImageFile(res.data)
  //     // console.log(res.data)
  //   })
  // }
  
  function refreshPage() {
    window.location.reload(false);
  }
  // const InsertComment = (text, ImageName, file, fileNamemig,namephoto) => {
  //   // addComment(text)
  //   SaveImage(ImageName, file, fileNamemig)
  // }
  // debugger

  // const updateComment = (text, commentId) => {
  //   updateCommentApi(text).then(() => {
  //     const updatedBackendComments = backendComments.map((backendComment) => {
  //       if (backendComment.service_id === commentId) {
  //         return { ...backendComment, description: text };
  //       }
  //       return backendComment;
  //     });
  //     setBackendComments(updatedBackendComments);
  //     setActiveComment(null);
  //   });
  // };
  // const deleteComment = (commentId) => {
  //   if (window.confirm("Are you sure you want to remove comment?")) {
  //     deleteCommentApi().then(() => {
  //       const updatedBackendComments = backendComments.filter(
  //         (backendComment) => backendComment.id !== commentId
  //       );
  //       setBackendComments(updatedBackendComments);
  //     });
  //   }
  // };

  return (
    <div className="comments">
      {/* <h4 className="comments-title">Comment</h4> */}
      {/* <div className="comment-form-title">เพิ่มความคิดเห็น</div> */}

      <Box textAlign='right' sx={{ p: 1 }}>
        <CommentForm submitLabel="Send" handleSubmit={addComment}/> 
      </Box>
      <div className="comments-container" style={{ padding: 14 }}>
        <Accordion elevation={4}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Comment ({backendComments.length})</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Paper elevation={0} style={{ padding: 16, zoom: "90%" }}>
              {rootComments.map((rootComment) => (
                <Comment
                  key={rootComment.id}
                  commentuser={messageID.map((items) => { return items.id })} //ส่ง id ไปที่ comment
                  comment={rootComment}
                  replies={getReplies(rootComment.id)}
                  activeComment={activeComment}
                  setActiveComment={setActiveComment}
                  backendComments={backendComments}
                  setBackendComments={setBackendComments}
                  addComment={addComment}
                  parentID={rootComment.parentID}
                  image={imagecomment}
                  serviceNo={service_no}
                  // deleteComment={deleteComment}
                  // updateComment={updateComment}
                  currentUserId={currentUserId}
                />
              ))}
            </Paper>
          </AccordionDetails>
        </Accordion>

      </div>
    </div>
  );
};

export default Comments;