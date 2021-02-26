import React from 'react';
import {Auth} from "aws-amplify";
import Form from "react-bootstrap/Form";

import {useAuthContext} from "../../libs/contextLib";
import {onError} from "../../libs/errorLib";
import LoaderButton from "../LoaderButton";

const Signup = () => {
  //@ts-ignore
  const {
    //@ts-ignore
    authPhaseTransition, resetFormState,
    //@ts-ignore
    isLoading, setIsLoading,
    //@ts-ignore
    fields, handleFieldChange,
    //@ts-ignore
    setNewUser, attemptSignin,
  } = useAuthContext();

  const validateForm = () => {
    return (
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);
    try {
      const user = await Auth.signUp({
        username: fields.email,
        password: fields.password,
        attributes: {
          name: fields.name,
        },
      });
      resetFormState();
      setNewUser(user);

    } catch (e) {
      if (e.code === 'UsernameExistsException') {
        await attemptSignin();
      } else {
        console.log(e);
        onError(e);
        setIsLoading(false);
      }
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <header>Create an account</header>
      {/*@ts-ignore*/}
      <Form.Group controlId="email" size="lg">
        <Form.Label>Email</Form.Label>
        <Form.Control
          autoFocus
          type="email"
          value={fields.email}
          onChange={handleFieldChange}
        />
      </Form.Group>
      {/*@ts-ignore*/}
      <Form.Group controlId="name" size="lg">
        <Form.Label>Name</Form.Label>
        <Form.Control
          autoFocus
          type="text"
          value={fields.name}
          onChange={handleFieldChange}
        />
      </Form.Group>
      {/*@ts-ignore*/}
      <Form.Group controlId="password" size="lg">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={fields.password}
          onChange={handleFieldChange}
        />
      </Form.Group>
      {/*@ts-ignore*/}
      <Form.Group controlId="confirmPassword" size="lg">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          onChange={handleFieldChange}
          value={fields.confirmPassword}
        />
      </Form.Group>
      <div className="options">
        <div/>
        <a className="option" onClick={() => authPhaseTransition('login')}>
          Return to login
        </a>
      </div>
      <LoaderButton
        block
        size="lg"
        type="submit"
        variant="success"
        isLoading={isLoading}
        disabled={!validateForm()}
      >
        Signup
      </LoaderButton>
    </Form>
  );
}

export default Signup;
