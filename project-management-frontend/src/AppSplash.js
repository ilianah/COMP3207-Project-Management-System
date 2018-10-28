import React from 'react';
import { Button } from 'reactstrap';

export default ({doLogin}) => {
    return <div className="background">
        <div className="header"/>
        <div className="splash-title">
            Project Management made easy
        </div>
        <div className="splash-motto">
            Log in now to get started! 
        </div>
        <div className="splash-buttons">
            <Button outline size="lg" onClick={doLogin}>Login</Button>    
        </div>
    </div>
}