import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getUserWithId } from '../../services/userService'
function Comment({ comment }) {
  const [author, setAuthor] = useState('Loading...')
  useEffect(() => {
    if (comment) {
      getUserWithId(comment?.author).then(user => {
        setAuthor(user.displayName)
      })
    }
  }, [comment])
  return (
    <Body>
      <CommentTitleSection>
        <CommentTitle>{author}</CommentTitle>
      </CommentTitleSection>
      <CommentContent>
        <MiscText>{`${comment?.createdAt?.toDate()}`}</MiscText>
        <TempText>{comment?.body}</TempText>
      </CommentContent>
    </Body>
  )
}

const Body = styled.div`
  border: 1px solid #27272a;
  border-radius: 10px;
  margin: 10px 0;
  padding: 20px;
  font-family: 'Roboto', Tahoma, Geneva, Verdana, sans-serif;
  transition: 0.2s;
  cursor: pointer;
  &:hover {
    background-color: #27272a;
  }

  transition: 0.3s;
  @media (max-width: 830px) {
    width: 100%;
  }

  /* @media (max-width: 530px) {
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
  } */
`

const MiscText = styled.span`
  color: gray;
  font-style: italic;
`

const TempText = styled.p`
  color: white;
  margin-top: 15px;
`
const CommentTitleSection = styled.div``
const CommentContent = styled.div``
const CommentTitle = styled.p`
  color: white;
  font-weight: bold;
`

export default Comment
