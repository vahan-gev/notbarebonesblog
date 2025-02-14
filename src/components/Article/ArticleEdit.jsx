import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { getArticleWithId, ifAdmin } from '../../services/userService'
import Header from '../Header/Header'
import { SignIn, useAuthentication } from '../../services/authService'
import { auth } from '../../firebaseConfig'
import { MdErrorOutline } from 'react-icons/md'
import Button from '../Button/Button'
import swal from 'sweetalert'
import { editArticleWithId } from '../../services/articleService'
import { useNavigate } from 'react-router-dom'
import MarkdownEditor from '@uiw/react-markdown-editor'

function ArticleEdit() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [article, setArticle] = useState(null)
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const navigate = useNavigate()

  const user = useAuthentication()
  function convertFormattedString(inputString) {
    const normalString = inputString.replace(/\\n/g, '\n')
    return normalString
  }
  function submit() {
    if (!title.trim() || !body.trim()) {
      swal({
        title: 'Something went wrong!',
        text: 'Both the title and body must be supplied!',
        icon: 'error',
        buttons: false,
        timer: 3000
      })
    } else {
      editArticleWithId(article?.id, title, body).then(() => {
        swal({
          title: 'Congratulations!',
          text: 'Article edited successfully!',
          icon: 'info',
          buttons: false,
          timer: 3000
        }).then(() => {
          navigate(`/article/${article?.id}`)
          setTitle('')
          setBody('')
          setArticle(null)
        })
      })
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        ifAdmin(user.uid)
          .then(setIsAdmin)
          .then(() => {
            if (!article) {
              getArticleWithId(id).then(article => {
                setArticle(article)
                setTitle(article?.title)
                setBody(article?.body)
              })
            }
          })
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [article, id])
  function askAI() {
    const container = document.createElement('div')

    const input = document.createElement('input')
    input.setAttribute('type', 'text')
    input.setAttribute('placeholder', 'Enter a prompt...')
    input.setAttribute('class', 'swal-input')

    const button = document.createElement('button')
    button.setAttribute('type', 'submit')
    button.innerHTML = 'Ask'
    button.setAttribute('class', 'swal-load-button')
    button.addEventListener('click', () => {
      button.innerHTML = 'Loading...'
      let apiUrl = `https://palm-api-0tei.onrender.com/getresponse?prompt=${encodeURIComponent(input.value)}`

      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then(data => {
          setBody(convertFormattedString(data.response))
          swal.close()
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error)
        })
    })
    container.appendChild(input)
    container.appendChild(button)

    swal({
      title: 'Ask AI',
      text: 'AI can sometimes generate innacurate results',
      icon: 'info',
      buttons: false,
      content: container
    })
  }
  return (
    <Body>
      <Header user={user} />
      {loading ? (
        <Title>Loading...</Title>
      ) : !user ? (
        <LoginSection>
          <SignIn />
        </LoginSection>
      ) : isAdmin ? (
        <Content>
          <ArticleBody>
            <Title>Edit article</Title>
            <br />
            <ArticleForm id="articleEdit" onSubmit={submit}>
              <TitleInput
                id="titleField"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter title..."
              />
              <br />
              <EditorContainer>
                <MarkdownEditor
                  enablePreview={true}
                  value={body}
                  height="400px"
                  theme={'dark'}
                  onChange={(value, viewUpdate) => setBody(value)}
                />
              </EditorContainer>
              <br />
              <CustomHr />
              <br />
              <Button text="Ask AI" onClick={askAI} />
              <br />
              <Button text="Edit" onClick={submit} />
            </ArticleForm>
          </ArticleBody>
        </Content>
      ) : (
        <AccessDenied>
          <MdErrorOutline size={100} color="white" />
          <ErrorText>Access Denied</ErrorText>
        </AccessDenied>
      )}
      <NotAvailable>Admin dashboard is not available. Use a larger screen</NotAvailable>
    </Body>
  )
}

const NotAvailable = styled.div`
  color: white;
  font-family: 'Roboto', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 20px;
  display: none;
  flex: 1;
  justify-content: center;
  align-items: center;
  transition: 0.2s;
  @media (max-width: 630px) {
    display: flex;
  }
  @media (max-width: 530px) {
    font-size: 14px;
  }
`

const Body = styled.div`
  display: flex;
  background-color: #101010;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
  overflow: auto;
`

const Content = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  overflow-y: auto;
  @media (max-width: 630px) {
    display: none;
  }
`

const AccessDenied = styled.div`
  display: flex;
  flex: 1;
  padding: 10px;
  align-items: center;
  justify-content: center;
  color: white;
  flex-direction: column;
`

const ErrorText = styled.h1`
  font-size: 50px;
  font-family: 'Roboto', Tahoma, Geneva, Verdana, sans-serif;
`
const LoginSection = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Title = styled.h1`
  color: white;
  font-size: 30px;
  font-weight: bold;
  font-family: 'Roboto', Tahoma, Geneva, Verdana, sans-serif;
`

const TitleInput = styled.input`
  background-color: black;
  border: 1px solid #27272a;
  color: white;
  outline: none;
  width: 600px;
  border-radius: 5px;
  padding: 10px;
  font-family: 'Roboto', Tahoma, Geneva, Verdana, sans-serif;
  width: 100%;
`

const ArticleForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 800px;
  transition: 0.2s;
  overflow: auto;
  @media (max-width: 950px) {
    width: 700px;
  }

  @media (max-width: 840px) {
    width: 600px;
  }
  @media (max-width: 730px) {
    width: 500px;
  }
`

const EditorContainer = styled.div`
  width: 100%;
  overflow: auto;
`

const CustomHr = styled.hr`
  border: 1px solid #27272a;
`

const ArticleBody = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`

export default ArticleEdit
