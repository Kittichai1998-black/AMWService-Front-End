import React, { useState, useEffect } from 'react'
import CommentForm from "./CommentForm";
import PicUser from "../../assets/imgs/NicePng.png"
import Alert from '@mui/material/Alert';
// import moment from 'moment';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { CommentAPI } from '../../intercepetors/axios';
import dayjs from 'dayjs'
import 'dayjs/locale/th'
import axios from 'axios';
import { Create } from "@mui/icons-material";

const Comment = ({
  comment,
  replies,
  setActiveComment,
  activeComment,
  setBackendComments,
  backendComments,
  parentID,
  image,
  serviceNo,
  // updateComment,
  // deleteComment,
  addComment,
  parentId = null,
  currentUserId,
  commentuser,
}) => {
  const isEditing =
    activeComment &&
    activeComment.id === comment.id &&
    activeComment.type === "editing";
  const isReplying =
    activeComment &&
    activeComment.id === comment.id &&
    activeComment.type === "replying";
  const fiveMinutes = 300000;
  const timePassed = comment.createTime > fiveMinutes;
  // const canDelete = currentUserId === comment.userId && replies.length === 0 && !timePassed;
  const canReply = Boolean(currentUserId);
  const canCancel = Boolean(currentUserId);
  // const canEdit = currentUserId === comment.userId && !timePassed;
  const replyId = parentID ? parentID : comment.id;
  const createdAt = comment.createTime
  const newDate = new Date().toLocaleString().split(",")[0]
  const AfterCreate = newDate
  // const [backendComments, setBackendComments] = useState([]);
  const [Images, setImageFile] = useState([])
  const [imgFull, setFull] = useState({});
  const [ParentID, setParentID] = useState("");
  const queryParams = new URLSearchParams(window.location.search);
  const ServiceID = queryParams.get("ServiceID")
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [userID, setUserID] = useState(localStorage.getItem("userID"));
  const [open, setOpen] = useState(false);
  const [showResults, setShowResults] = useState(false)
  const commentParent = comment

  useEffect(() => {
    GetImages();
    // console.log(activeComment)
    // console.log(commentParent);
    // console.log(replyId)
  }, [])

  useEffect(() => {
    setParentID(activeComment.id)
  }, [activeComment])

  async function GetImages() {
    await axios.get(CommentAPI.API_URL + '/GetImageComment', { params: { RepairID: ServiceID } }
    ).then(res => {
      setImageFile(res.data)
      // console.log(res.data)
    })
  }

  async function SaveImage(ImageName, file, fileNamemig, namephoto) {
    // console.log(ImageName)
    // console.log(file)
    // console.log(fileNamemig)
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

        }
        // else {
        //   swal.fire({ icon: 'error', title: "Failed", text: "ข้อมูลไม่ถูกต้อง" });
        // }
      })
    }
  }

  const dialogImg = (val) => {
    setFull(val)
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  };

  const onClick = () => setShowResults(true)

  const commentBox = () => {
    return (
      <>
        <div key={comment.id} className="comment"> {/* คอมเม้นไอดี*/}
          <div className="comment-image-container">
            <img src={PicUser} style={{ width: 40, height: 40 }} /> {/* รูปโปรไฟล์*/}
          </div>
          <div className="comment-right-part">
            <div className="comment-content">
              <div className="comment-author">{comment.userName}</div>   {/* ขื่อผู้คอมเม้น*/}
              <div style={{margin:5}}><h8>{("day js DD-MM-YYYY", dayjs(createdAt).format('DD-MMMM-YYYY HH:mm'))}</h8></div> {/* วันที่เวลาคอมเม้น*/}
            </div>
            {/* {!isEditing && */}
            <div className="comment-text">
              {comment.description}
              <Box style={{ paddingTop: 10 }}>
                <ImageList sx={{ width: 800, maxHeight: 450 }} cols={3} gap={8}>
                  {Images.filter((x) => x.comment_Id === comment.id).map((photo, index) => (
                    <ImageListItem key={photo.imageSrc}>
                      <img src={photo.imageSrc}
                        style={{ width: 200, height: 180, cursor: "pointer", border: '1px solid' ,borderRadius: 10}}
                        onClick={() => dialogImg(photo.imageSrc)}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Box>
            </div>

            {/* }  */}
            {!isEditing && <div className="comment-text">{comment.body}</div>}
            {isEditing && (
              <CommentForm
                submitLabel="Update"
                hasCancelButton
                initialText={comment.body}
                // handleSubmit={(text) => updateComment(text, comment.id)}
                handleCancel={() => {
                  setActiveComment(null);
                }}
              />
            )}
            {parentID === null ?
              <>
                <div className="comment-actions">
                  {canReply && (
                    <div
                      className="comment-action"
                      onClick={() => {
                        setActiveComment({ id: comment.id, name: comment.userName, type: "replying" }) //set id เฉยๆ
                        // console.log(activeComment.name)
                      }
                      }
                    >
                      Reply
                    </div>

                  )}
                  {canCancel && (
                    <div
                      className="comment-action"
                      onClick={() =>
                        setActiveComment("")
                      }
                    >
                      Cancel
                    </div>
                  )}

                </div>
              </>
              : ''}
            {isReplying && (
              <CommentForm
                submitLabel="Reply"
                namecomment={activeComment.name}
                handleSubmit={addComment}
              // handleSubmit={addCommenttacking}
              //ส่งข้อมูลไปยัง function
              />
            )}

            {showResults &&
              <>
                {replies.length > 0 && (
                  <div className="replies">

                    {replies.map((reply) => (
                      <Comment
                        comment={reply}
                        key={reply.id}
                        setActiveComment={setActiveComment}
                        activeComment={activeComment}
                        // updateComment={updateComment}
                        // deleteComment={deleteComment}
                        addComment={addComment}
                        parentId={comment.id}
                        replies={[]}
                        currentUserId={currentUserId}
                      />
                    ))}
                  </div>
                )}
              </>
            }
            {showResults !== true ?
              <div><Button style={{ textTransform: 'none' }} onClick={() => setShowResults(!showResults)}>{replies.length} Replies</Button></div>
              :
              <div><Button style={{ textTransform: 'none' }} onClick={() => setShowResults(!showResults)}>Close</Button></div>}


          </div>
          {/* {(comment.length <= 0) &&
            <Alert severity='info'>ไม่มีข้อความ</Alert>
          } */}

          <div>
            <Dialog fullWidth={true} maxWidth="lg" open={open}
              onClose={handleClose} aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description">
              <div>
                <center>
                  <img src={imgFull} alt="image" style={{ maxWidth: "100%", maxHeight: "100%" }} />
                </center>
              </div>
            </Dialog>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {parentID === null ?
        <div>{commentBox()}</div> : <div style={{ zoom: '90%' }}>{commentBox()}</div>}
    </>
  );
};


export default Comment;