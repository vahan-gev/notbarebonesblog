import React, { useEffect, useState } from 'react'
import { fetchArticles } from '../../services/articleService'
import Article from './Article'
import styled from 'styled-components'
import { useCallback } from 'react'

function ArticleControls({ user }) {
  const [articles, setArticles] = useState([])
  const [lastVisible, setLastVisible] = useState(null)
  const [hasMore, setHasMore] = useState(true)

  const getArticles = useCallback(() => {
    if (user) {
      const retrieveArticles = async () => {
        const articles = await fetchArticles(null)
        setArticles(articles)
        setLastVisible(articles[articles.length - 1].originalDoc)
      }
      retrieveArticles()
    }
  }, [user])

  const handleScroll = event => {
    const { scrollTop, scrollHeight } = event.target
    if (hasMore && scrollTop + window.innerHeight >= scrollHeight - 5) {
      const retrieveArticles = async () => {
        const newArticles = await fetchArticles(lastVisible)
        if (newArticles.length === 0 || newArticles[newArticles.length - 1]?.originalDoc?.id === lastVisible?.id) {
          setHasMore(false)
          return
        }
        setArticles([...articles, ...newArticles])
        setLastVisible(newArticles[newArticles.length - 1]?.originalDoc)
      }
      retrieveArticles()
    }
  }

  useEffect(() => {
    if (articles.length === 0 && user) {
      getArticles()
    }
  })
  return (
    <Content onScroll={handleScroll}>
      {articles && (
        <Articles>
          {articles && articles.length > 0 ? (
            articles.map(article => {
              return <Article key={article?.id} article={article} edit={true} getArticles={getArticles} />
            })
          ) : (
            <span>No articles found</span>
          )}
        </Articles>
      )}
    </Content>
  )
}

const Content = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  overflow-y: auto;
`
const Articles = styled.div`
  display: flex;
  flex: 1;
  padding: 10px;
  align-items: center;
  color: white;
  flex-direction: column;
`
export default ArticleControls
