import React, { useEffect, useState } from 'react'
import { SignIn, useAuthentication } from '../../services/authService'
import { auth } from '../../firebaseConfig'
import styled from 'styled-components'
import Header from '../Header/Header'
import { ifAdmin } from '../../services/userService'
import { MdErrorOutline } from 'react-icons/md'
import AdminSidebar from './AdminSidebar'
import { createArticle } from '../../services/articleService'
import ArticleEntry from '../Article/ArticleEntry'
import swal from 'sweetalert'
import ArticleControls from '../Article/ArticleControls'

function AdminDashboard() {
  const user = useAuthentication()
  const [isAdmin, setIsAdmin] = useState(false)
  const [writing, setWriting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        ifAdmin(user.uid).then(setIsAdmin)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  function addArticle({ title, body }) {
    createArticle({ title, body, author: auth?.currentUser?.uid }).then(article => {
      setWriting(false)
      swal({
        title: 'Congratulations!',
        text: 'Your article is now live!',
        icon: 'info',
        buttons: false,
        timer: 3000
      })
    })
  }

  const setWritingExport = bool => {
    setWriting(bool)
  }

  const setEditingExport = bool => {
    setEditing(bool)
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
      ) : (
        <>
          {isAdmin ? (
            <Content>
              <AdminSidebar setWriting={setWritingExport} setEditing={setEditingExport} />
              <Section>
                {writing ? (
                  <ArticleEntry addArticle={addArticle} />
                ) : editing ? (
                  <ArticleControls user={user} />
                ) : (
                  <Title>Select an action from the sidebar</Title>
                )}
              </Section>
            </Content>
          ) : (
            <AccessDenied>
              <MdErrorOutline size={100} color="white" />
              <ErrorText>Access Denied</ErrorText>
            </AccessDenied>
          )}

          <NotAvailable>Admin dashboard is not available. Use a larger screen</NotAvailable>
        </>
      )}
    </Body>
  )
}

const Section = styled.section`
  display: flex;
  flex: 1;
  padding: 10px;
  color: white;
`

const Body = styled.div`
  display: flex;
  background-color: #101010;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
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

const Title = styled.p`
  color: white;
  font-size: 24px;
  font-family: 'Roboto', Tahoma, Geneva, Verdana, sans-serif;
`

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

export default AdminDashboard
