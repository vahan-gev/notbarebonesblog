import { useState } from 'react'
import styled from 'styled-components'
import Button from '../Button/Button'
import swal from 'sweetalert'
import MarkdownEditor from '@uiw/react-markdown-editor'

export default function ArticleEntry({ addArticle }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

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
      addArticle({ title, body })
    }
  }

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
      <Title>Create a new article</Title>
      <br />
      <ArticleForm id="articleEntry" onSubmit={submit}>
        <TitleSection>
          <TitleInput
            id="titleField"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter title..."
          />
        </TitleSection>
        <br />
        <EditorContainer>
          <MarkdownEditor
            enablePreview={true}
            value={body}
            height="300px"
            theme={'dark'}
            onChange={(value, viewUpdate) => setBody(value)}
          />
        </EditorContainer>
        <br />
        <CustomHr />
        <br />
        <Button text="Ask AI" onClick={askAI} />
        <br />
        <Button text="Create" onClick={submit} />
      </ArticleForm>
    </Body>
  )
}

const EditorContainer = styled.div`
  width: 100%;
  overflow: auto;
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  overflow: auto;
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
const TitleSection = styled.div`
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
  width: 100%;
  border-radius: 5px;
  padding: 10px;
  font-family: 'Roboto', Tahoma, Geneva, Verdana, sans-serif;
`
const CustomHr = styled.hr`
  border: 1px solid #27272a;
`
