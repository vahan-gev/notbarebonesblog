import styled from 'styled-components'
import { MdOutlineSpaceDashboard, MdExitToApp, MdRefresh } from 'react-icons/md'
import { logout } from '../../services/authService'
import { ifAdmin } from '../../services/userService'
import { auth } from '../../firebaseConfig'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
export default function Sidebar({ getArticles }) {
  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(() => {
    ifAdmin(auth.currentUser.uid).then(setIsAdmin)
  }, [])
  return (
    <Body>
      <SectionOne>
        <Profile>
          <ProfileImage referrerPolicy="no-referrer" src={auth?.currentUser?.photoURL} />
          <Popup id="popup">
            <span>Logged in as: {auth.currentUser.displayName}</span>
          </Popup>
        </Profile>
        <SidebarButton onClick={getArticles}>
          <MdRefresh size={25} />
          <Popup id="popup">
            <span>Refresh</span>
          </Popup>
        </SidebarButton>
      </SectionOne>
      <SectionTwo>
        {isAdmin && (
          <Link to="/admin">
            <SidebarButton>
              <MdOutlineSpaceDashboard size={25} />
              <Popup id="popup">
                <span>Admin Dashboard</span>
              </Popup>
            </SidebarButton>
          </Link>
        )}

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
      font-family: 'Roboto';
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

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 4px solid #101010;
  transition: 0.2s;

  &:hover {
    border: 4px solid #27272a;
  }
`
const Profile = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
  cursor: pointer;
  &:hover {
    #popup {
      display: flex;
      top: 0px;
    }
  }
`

const SectionOne = styled.div``
const SectionTwo = styled.div``
