import styled from 'styled-components'
import { MdExitToApp } from 'react-icons/md'
import { AiOutlinePlusCircle, AiOutlineUnorderedList } from 'react-icons/ai'
import { logout } from '../../services/authService'
export default function AdminSidebar({ setWriting, setEditing }) {
  return (
    <Body>
      <SectionOne>
        <SidebarButton
          onClick={() => {
            setWriting(true)
            setEditing(false)
          }}
        >
          <AiOutlinePlusCircle size={25} />
          <Popup id="popup">
            <span>New Article</span>
          </Popup>
        </SidebarButton>
        <SidebarButton
          onClick={() => {
            setEditing(true)
            setWriting(false)
          }}
        >
          <AiOutlineUnorderedList size={25} />
          <Popup id="popup">
            <span>All Articles</span>
          </Popup>
        </SidebarButton>
      </SectionOne>
      <SectionTwo>
        <SidebarButton onClick={logout}>
          <MdExitToApp size={25} />
          <Popup id="popup">
            <span>Log Out</span>
          </Popup>
        </SidebarButton>
      </SectionTwo>
    </Body>
  )
}

const Body = styled.nav`
  background-color: #101010;
  border-right: 1px solid #27272a;
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: -webkit-sticky;
  position: sticky;
  top: 0;

  @media (max-width: 630px) {
    display: none;
  }
`

const SidebarButton = styled.div`
  position: relative;
  border-radius: 50%;
  background-color: transparent;
  transition: 0.3s;
  font-size: 18px;
  padding: 5px 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  width: 60px;
  height: 60px;
  &:hover {
    background-color: #27272a;

    #popup {
      display: flex;
    }
  }
`

const Popup = styled.div`
  position: absolute;
  background-color: #27272a;
  color: white;
  border-radius: 5px;
  padding: 10px;
  font-size: 12px;
  top: 10px;
  left: 80px;
  white-space: nowrap;
  display: none;
  justify-content: center;
  align-items: center;
  > span {
    color: white;
    font-weight: 700;
  }
`

const SectionOne = styled.div``
const SectionTwo = styled.div``
