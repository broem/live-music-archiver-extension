import React from 'react';

function onBack() {
    window.history.back();
}

const Back = () => {
    return (
        <div className="col-2 scrape-back">
            <button id="back" type="button" className="btn btn-primary btn-danger" onClick={onBack}>back</button>
        </div>
    );
}

export default Back;