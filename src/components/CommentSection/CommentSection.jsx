import React, { useState } from 'react'
import styled from 'styled-components'
import Comment from './Comment'
import { createComment } from '../../services/userService'
import { auth } from '../../firebaseConfig'
import Button from '../Button/Button'
import swal from 'sweetalert'

function CommentSection({ articleId, comments, updateComments }) {
  const [commentText, setCommentText] = useState('')

  const handleCommentSubmit = () => {
    if (commentText.trim() === '') {
      swal({
        title: 'Something went wrong!',
        text: 'Comment must be supplied!',
        icon: 'error',
        buttons: false,
        timer: 3000
      })
    } else {
      createComment(articleId, auth.currentUser.uid, commentText)
        .then(newComment => {
          updateComments([...comments, newComment])
          setCommentText('')
        })
        .catch(error => {
          console.error('Error creating comment:', error)
        })
    }
  }

  return (
    <Body>
      <Title>Comments: {comments?.length}</Title>

      <CommentInputContainer>
        <CommentInput
          id="commentField"
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
        />
        <Button onClick={handleCommentSubmit} text="Comment"></Button>
      </CommentInputContainer>

      {comments?.map(comment => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </Body>
  )
}

const Body = styled.div`
  border: 1px solid #27272a;
  border-radius: 10px;
  margin: 10px 0;
  width: 700px;
  padding: 40px;
  font-family: 'Roboto', Tahoma, Geneva, Verdana, sans-serif;

  transition: 0.3s;
  @media (max-width: 830px) {
    width: 500px;
  }

  @media (max-width: 530px) {
    width: 400px;
    padding: 20px;
  }

  @media (max-width: 450px) {
    width: 350px;
    padding: 20px;
  }
  @media (max-width: 380px) {
    width: 300px;
    padding: 20px;
  }
  @media (max-width: 330px) {
    width: 100%;
    padding: 20px;
  }
`

const Title = styled.p`
  color: white;
  font-size: 20px;
`

const CommentInputContainer = styled.div`
  display: flex;
  margin-top: 20px;
  transition: 0.3s;

  @media (max-width: 450px) {
    flex-direction: column;
  }
`

const CommentInput = styled.input`
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #27272a;
  border-radius: 4px;
  font-size: 16px;
  outline: none;
  color: white;
  background-color: black;
  margin-right: 10px;
  @media (max-width: 450px) {
    margin-right: 0px;
    margin-bottom: 10px;
  }
`

export default CommentSection
