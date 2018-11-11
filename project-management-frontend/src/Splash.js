import React from "react";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";

export default ({ doSignup }) => {
  return (
    <div className="background">
      <div className="header" />
      <div className="splash-title">Project Management made easy</div>
      <div className="splash-motto">Log in or sign up now to get started!</div>
      <div className="splash-buttons">
        <Link to="/login">
          <Button className="mr-2" outline size="lg">
            Login
          </Button>
        </Link>

        <Button className="ml-2" outline size="lg" onClick={doSignup}>
          Sign up
        </Button>
      </div>
    </div>
  );
};
