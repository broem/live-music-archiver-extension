import React from 'react';
import Back from '../Common/back';

const Errored = () => {
    return (
        <div className="error">
            <Back />
            <h1>Unable to connect to server, make sure you're logged into Chrome!</h1>
            <h2>Please try again later</h2>
        </div>
    );
}

export default Errored;
