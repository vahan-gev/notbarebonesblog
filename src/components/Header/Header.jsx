import React from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import Button from '../Button/Button'
import { logout } from '../../services/authService'
function Header({ user, reset = null }) {
  const navigate = useNavigate()
  return (
    <Body>
      <Logo>
        <Title
          onClick={() => {
            navigate('/')
            if (reset) {
              reset()
            }
            window.scrollTo(0, 0)
          }}
        >
          Not Bare Bones Blog
        </Title>
        <LogoImage
          alt="This logo doesn't have any connection to the projectm it is solely for requirement"
          src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fclipart-library.com%2Fimages_k%2Ftransparent-images-free%2Ftransparent-images-free-24.png&f=1&nofb=1&ipt=b23e18dde2ce17a9f063993d597b589b11fae2352ce402b541e9e3f17fb717c8&ipo=images"
        />
      </Logo>

      {user && <span>Welcome, {user.displayName}</span>}
      {user && (
        <ButtonContainer>
          <Button onClick={logout} text="Log Out" />
        </ButtonContainer>
      )}
    </Body>
  )
}

const Logo = styled.div`
  display: flex;
  align-items: center;
`

const LogoImage = styled.img`
  width: 40px;
  height: 40px;
  filter: brightness(0) invert(1);
  margin-left: 10px;
  transition: 0.2s;
  @media (max-width: 600px) {
    width: 25px;
    height: 25px;
  }
  @media (max-width: 340px) {
    width: 20px;
    height: 20px;
  }
`

const Body = styled.header`
  display: flex;
  justify-content: space-between;
  color: white;
  grid-column: 1 / span 2;
  padding: 10px 15px;
  align-items: center;
  border-bottom: 1px solid #27272a;
  background: linear-gradient(115deg, #222222, #000000);
  width: 100%;
  font-family: 'Roboto', Tahoma, Geneva, Verdana, sans-serif;
  position: -webkit-sticky;
  position: sticky;
  top: 0;

  @media (max-width: 630px) {
    > span {
      display: none;
    }
  }
`

const Title = styled.h1`
  font-weight: 900;
  font-size: 30px;
  margin: 0;
  cursor: pointer;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  font-family: 'Roboto', Tahoma, Geneva, Verdana, sans-serif;
  transition: 0.5s;
  @media (max-width: 600px) {
    font-size: 20px;
  }
  @media (max-width: 340px) {
    font-size: 14px;
  }
`

const ButtonContainer = styled.div`
  display: none;
  @media (max-width: 630px) {
    display: block;
  }
`

export default Header
