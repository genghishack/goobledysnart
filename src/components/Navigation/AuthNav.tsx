import React from 'react';
import {useHistory} from "react-router-dom";
import {Auth} from "aws-amplify";
import {connect} from "react-redux";
import {Button, Dropdown, DropdownButton} from "react-bootstrap";
import DropdownItem from "react-bootstrap/DropdownItem";

import {useAppContext} from "../../libs/contextLib";
import {setCurrentUser} from "../../redux/actions/currentUser";

import './AuthNav.scss';

interface IAuthNav {
  dispatch: Function;
  currentUser: any;
}

const AuthNav = (props: IAuthNav) => {
  const {dispatch, currentUser} = props;

  const history = useHistory();
  //@ts-ignore
  const { isAuthenticated, userHasAuthenticated } = useAppContext();

  const navigate = (destination) => {
    history.push(`/${destination}`);
  }

  const handleLogout = async () => {
    await Auth.signOut()
    userHasAuthenticated(false);
    dispatch(setCurrentUser({}));
    history.push('/');
  }

  const getUserDisplayName = () => {
    let userDisplayName = '';
    if (currentUser.id) {
      userDisplayName = currentUser.email;
      if (currentUser.name) {
        userDisplayName = currentUser.name;
      }
    }
    return userDisplayName;
  }

  return (
    <div className="AuthNav">
      {isAuthenticated ? (
        <>
          <Dropdown>
            <DropdownButton
              className="UserMenu"
              title={getUserDisplayName()}
              variant="link"
            >
              <DropdownItem onClick={() => navigate('profile')}>Profile</DropdownItem>
              <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
            </DropdownButton>
          </Dropdown>
        </>
      ) : (
        <Button
          variant="link"
          onClick={() => navigate('auth')}
        >Login</Button>
      )}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser,
    errors: state.errors,
  }
}

export default connect(mapStateToProps)(AuthNav);
