import { useCallback, useEffect, useState } from "react"
import Sidebar from "./Sidebar/Sidebar"
import Article from "./Article/Article"
import { SignIn, useAuthentication } from "../services/authService"
import { fetchArticles } from "../services/articleService"
import Header from "./Header/Header"
import styled from "styled-components"
import { useParams } from "react-router-dom"
import { getArticleWithId } from "../services/userService"
import { useRef } from "react"
import { useLocation } from "react-router-dom/dist"


// FIXED QUOTA EXCEEDED ERROR FROM: ArticleEdit.jsx

/*
  TODO:
  - Add admin dashboard(DONE), where you can create(DONE), edit(DONE) and delete(DONE) articles, etc.
  - Add user view(DONE), infinite scroll(DONE), article views (DONE), likes(DONE), comments(DONE), etc.
  - Optional: Markdown support for articles(DONE), AI to write articles(DONE)

  Routes:
    - / (home page) (DONE)
    - /admin (DONE)
    - /article/:id (DONE)
    - /article/edit/:id (DONE)
    
  Data:
    - User
      uid: string
      email: string
      displayName: string
      photoURL: string
      role: string

    - Article
      id: string
      title: string
      body: string
      comments: Comment[]
      likes: []
      views: int
      createdAt: timestamp
      author: User.uid
    
    - Comment
      id: string
      body: string
      createdAt: timestamp
      author: User.uid
      
*/




export default function App() {
  const [articles, setArticles] = useState([]);
  const [article, setArticle] = useState({});
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const user = useAuthentication();
  const contentRef = useRef(null);
  const location = useLocation();
  const { id } = useParams();


  const reset = () => {
    if (location.pathname !== "/") {
      setLastVisible(null)
      setHasMore(true)
    }
  }

  const getArticles = useCallback(() => {
    if (user) {
      const retrieveArticles = async () => {
        const articles = await fetchArticles(null);
        setArticles(articles);
        setLastVisible(articles[articles.length - 1].originalDoc);
      }
      retrieveArticles();
    }
  }, [user]);

  const handleScroll = event => {
    const { scrollTop, scrollHeight } = event.target;
    if (hasMore && scrollTop + window.innerHeight >= scrollHeight - 5) {

      const retrieveArticles = async () => {
        const newArticles = await fetchArticles(lastVisible);
        if (newArticles.length === 0 || (newArticles[newArticles.length - 1]?.originalDoc?.id === lastVisible?.id)) {
          setHasMore(false);
          return;
        }
        setArticles([...articles, ...newArticles]);
        setLastVisible(newArticles[newArticles.length - 1]?.originalDoc);
      }
      retrieveArticles();
    }
  }

  useEffect(() => {
    if (user) {
      if (!id) {
        getArticles();
      } else {
        getArticleWithId(id).then(setArticle);
      }
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    }



  }, [user, id, getArticles]);

  return (
    <Body>
      <Header user={user} reset={reset} />
      {!user ? (
        <LoginSection>
          <SignIn />
        </LoginSection>
      ) : id ? (
        <Content ref={contentRef}>
          <Articles>
            {article && id && <Article article={article} full={true} />}
          </Articles>

        </Content>

      ) : (
        <Content onScroll={handleScroll} ref={contentRef} >
          <Sidebar getArticles={getArticles} />
          <Articles>
            {articles && articles.length > 0 ? (
              articles.map((article) => {
                return (
                  <Article key={article?.id} article={article} />
                )
              })
            ) : <span>No articles found</span>}
          </Articles>
        </Content>

      )}
    </Body>

  )
}

const Body = styled.div`
  display: flex;
  background-color: #101010;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
  
`

const LoginSection = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Content = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  overflow-y: auto;
`
const Articles = styled.div`
  display: grid;
  grid-template-columns: auto;
  width: 100%;
  padding: 10px;
  align-items: center;
  justify-content: center;
  color: white;

`