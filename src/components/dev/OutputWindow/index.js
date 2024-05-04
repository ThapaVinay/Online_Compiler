import React from 'react';
import './style.css';

function OutputWindow({ outputDetails }) {
    return (
        <>
            <h1 className='outputHeading'>Output</h1>
            <div className='outWin'>
                {outputDetails && (
                    <pre className={outputDetails.status === "success" ? "green" : "red"}>
                        {outputDetails.stdout}
                    </pre>
                )}
            </div>
        </>
    );
}

export default OutputWindow;
