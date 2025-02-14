import React from 'react'
import styled from 'styled-components'
function Button({ text, onClick, withIcon = false, Icon }) {
  return (
    <Body onClick={onClick}>
      <span>{text}</span>
      {withIcon && <Icon size={15} />}
    </Body>
  )
}

const Body = styled.div`
  background-color: black;
  border: 1px solid #27272a;
  border-radius: 5px;
  transition: 0.3s;
  font-size: 18px;
  padding: 5px 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: #27272a;
  }
  > span {
    color: white;
    font-family: 'Roboto', Tahoma, Geneva, Verdana, sans-serif;
    margin-right: 5px;
  }
`

export default Button
