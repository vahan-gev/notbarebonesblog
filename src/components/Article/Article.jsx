import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { getUserWithId } from '../../services/userService'
import { LiaCommentSolid } from 'react-icons/lia'
import { AiFillHeart, AiOutlineEye, AiOutlineHeart } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import CommentSection from '../CommentSection/CommentSection'
import { deleteArticleWithId, incrementArticleViews, likeArticle, unlikeArticle } from '../../services/articleService'
import { BsFillTrashFill, BsPencilSquare } from 'react-icons/bs'
import Button from '../Button/Button'
import swal from 'sweetalert'
import { auth } from '../../firebaseConfig'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import MarkdownPreview from '@uiw/react-markdown-preview'
export default function Article({ article, full = false, edit = false, getArticles }) {
  const [author, setAuthor] = useState('undefined')
  const [comments, setComments] = useState([])
  const [userLiked, setUserLiked] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const { width, height } = useWindowSize()

  const navigate = useNavigate()
  const updateComments = newComments => {
    let reversed = newComments?.reverse()
    setComments(reversed)
  }

  useEffect(() => {
    if (article) {
      getUserWithId(article?.author).then(user => {
        setAuthor(user?.displayName)
      })
      updateComments(article?.comments)
      setUserLiked(article?.likes?.includes(auth?.currentUser?.uid))
    }
  }, [article])

  const truncateString = (str, num) => {
    if (str.length > num) {
      return str.slice(0, num) + '...'
    } else {
      return str
    }
  }

  const addLikeToArticle = () => {
    if (article?.likes?.includes(auth?.currentUser?.uid)) {
      const index = article?.likes?.indexOf(auth?.currentUser?.uid)

      article?.likes?.splice(index, 1)
      setUserLiked(false)
      unlikeArticle(auth?.currentUser?.uid, article?.id)
    } else {
      article?.likes?.push(auth?.currentUser?.uid)
      setUserLiked(true)
      setShowConfetti(true)

      likeArticle(auth?.currentUser?.uid, article?.id)
    }
  }

  function isMarkdown(string) {
    const markdownPatterns = [
      /\*\*.*\*\*/,
      /\*.*\*/,
      /# .*/,
      /-\s.*/,
      /\d+\.\s.*/,
      /\[.*\]\(.*\)/,
      /!\[.*\]\(.*\)/,
      /`.*`/,
      /```[\s\S]*```/
    ]

    return markdownPatterns.some(pattern => pattern.test(string))
  }

  return (
    <Container>
      <Body>
        {showConfetti && (
          <Confetti
            width={width}
            height={height - 100}
            run={userLiked}
            numberOfPieces={300}
            recycle={false}
            onConfettiComplete={() => setShowConfetti(false)}
          />
        )}
        <ArticleTitleSection
          onClick={() => {
            if (!full) {
              navigate(`/article/${article?.id}`)
              incrementArticleViews(article?.id)
            }
          }}
        >
          <ArticleTitle>{article?.title}</ArticleTitle>
        </ArticleTitleSection>
        <ArticleContent>
          <MiscText>{`${article?.createdAt?.toDate()}`}</MiscText>

          {full ? (
            <MarkdownPreview
              style={{
                background: '#101010'
              }}
              wrapperElement={{
                'data-color-mode': 'dark'
              }}
              source={article?.body}
            />
          ) : isMarkdown(article?.body) ? (
            <TempText>This article is in markdown format. Click on the title to view it!</TempText>
          ) : (
            <TempText>{truncateString(article?.body, 100)}</TempText>
          )}

          {!full && !edit && article?.body?.length > 100 && (
            <MiscText
              onClick={() => {
                if (!full) {
                  navigate(`/article/${article?.id}`)
                  incrementArticleViews(article.id)
                }
              }}
            >
              Read More...
            </MiscText>
          )}

          <CustomHr />
          <br />
          <Footer>
            <AuthorSection>
              <AuthorText>Author: {author}</AuthorText>
            </AuthorSection>
            <InfoSection>
              <InfoText>
                <InfoTextIcon>
                  <LiaCommentSolid size={20} />
                </InfoTextIcon>
                {comments?.length}
              </InfoText>
              <InfoText>
                <InfoTextIcon onClick={addLikeToArticle}>
                  {userLiked ? <AiFillHeart size={20} /> : <AiOutlineHeart size={20} />}
                </InfoTextIcon>
                {article?.likes?.length}
              </InfoText>
              <InfoText>
                <InfoTextIcon>
                  <AiOutlineEye size={20} />
                </InfoTextIcon>
                {article?.views?.toLocaleString('en-US')}
              </InfoText>
            </InfoSection>
          </Footer>
        </ArticleContent>
      </Body>

      {edit && article && (
        <ButtonSection>
          <ButtonContainer>
            <Button
              onClick={() => navigate(`/article/edit/${article.id}`)}
              text="Edit"
              withIcon={true}
              Icon={BsPencilSquare}
            />
          </ButtonContainer>
          <ButtonContainer>
            <Button
              onClick={() => {
                deleteArticleWithId(article.id)
                  .then(() => {
                    swal({
                      title: 'Congratulations!',
                      text: 'Article deleted successfully!',
                      icon: 'info',
                      buttons: false,
                      timer: 3000
                    }).then(() => {
                      getArticles()
                    })
                  })
                  .catch(err => {
                    swal({
                      title: 'Something went wrong!',
                      text: `Encountered: ${err} with article: ${article.id}`,
                      icon: 'error',
                      buttons: false,
                      timer: 3000
                    })
                  })
              }}
              text="Delete"
              withIcon={true}
              Icon={BsFillTrashFill}
            />
          </ButtonContainer>
        </ButtonSection>
      )}

      {full && article && (
        <CommentSection articleId={article?.id} comments={comments} updateComments={updateComments} />
      )}
    </Container>
  )
}

const Body = styled.div`
  border: 1px solid #27272a;
  border-radius: 10px;
  margin: 10px 0;
  width: 700px;
  padding: 40px;
  cursor: pointer;
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

const MiscText = styled.span`
  color: gray;
  font-style: italic;
  @media (max-width: 530px) {
    font-size: 12px;
  }
`

const AuthorText = styled.span`
  color: gray;
  font-style: italic;
`

const InfoText = styled.span`
  color: gray;
  display: flex;
  align-items: center;
`

const InfoTextIcon = styled.div`
  margin: 0 10px;
`

const ArticleTitleSection = styled.div``
const ArticleContent = styled.div``
const ArticleTitle = styled.p`
  color: white;
  font-weight: bold;
  font-size: 25px;
  margin: 5px 0;
  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 830px) {
    font-size: 20px;
  }
`

const TempText = styled.p`
  color: white;
  margin: 15px 0;
  @media (max-width: 530px) {
    font-size: 12px;
  }
`

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: 530px) {
    justify-content: flex-start;
  }
`

const AuthorSection = styled.div`
  display: flex;
  flex: 0.8;
  @media (max-width: 530px) {
    display: none;
  }
`
const InfoSection = styled.div`
  display: flex;
  justify-content: space-around;
  flex: 0.2;
`

const CustomHr = styled.hr`
  border: 1px solid #27272a;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const ButtonSection = styled.div`
  display: flex;
  flex: 1;
  border: 1px solid #27272a;
  border-radius: 10px;
  margin: 10px 0;
  padding: 10px;
  font-family: 'Roboto', Tahoma, Geneva, Verdana, sans-serif;
`

const ButtonContainer = styled.div`
  display: flex;
  flex: 0.5;
  justify-content: center;
`
