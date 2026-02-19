import React, { useState } from 'react';

const CodeAssistant = () => {
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');

    const executeCode = () => {
        try {
            // eslint-disable-next-line no-eval
            const result = eval(code);
            setOutput(String(result));
        } catch (error) {
            setOutput(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <h1>Code Assistant</h1>
            <textarea
                rows="10"
                cols="50"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Write your JavaScript code here..."
            />
            <br />
            <button onClick={executeCode}>Run Code</button>
            <h2>Output:</h2>
            <pre>{output}</pre>
        </div>
    );
};

export default CodeAssistant;
