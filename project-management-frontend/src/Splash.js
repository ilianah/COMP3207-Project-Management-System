import React from "react";
import { Button } from "reactstrap";

export default ({ doLogin, doSignup }) => {
  return (
    <div className="background">
      <div className="header" />
      <div className="splash-title">Project Management made easy</div>
      <div className="splash-motto">Log in or sign up now to get started!</div>
      <div className="splash-buttons">
        <Button className="mr-2" outline size="lg" onClick={doLogin}>
          Login
        </Button>

        <Button className="ml-2" outline size="lg" onClick={doSignup}>
          Sign up
        </Button>
      </div>
    </div>
  );
};
