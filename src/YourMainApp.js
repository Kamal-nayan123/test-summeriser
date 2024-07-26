import React, { useState } from 'react';
// import './mainApp.css'; // Make sure to create 'mainApp.css' and import it

const YourMainApp = () => {
  const [inputText, setInputText] = useState(''); // For storing the user's input text
  const [summaryText, setSummaryText] = useState(''); // For storing the summarized text

  const handleSummarize = () => {
    // 1. Implement your summarization logic here.
    // You can use a library or write your own algorithm.
    // For example (using nlp_compromise):
    // import { nlp } from 'nlp_compromise'; 
    // const summary = nlp(inputText).summarize(5).text(); // Generate a summary with 5 sentences

    // 2. Set the summary text in the state
    // setSummaryText(summary);
  };

  const handleClear = () => {
    setInputText('');
    setSummaryText('');
  };

  return (
    <div className="main-app-container">
      <h1>Text Summeriser</h1>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Paste or type your text here..."
      />
      <div className="button-container">
        <button onClick={handleSummarize}>Summarize</button>
        <button onClick={handleClear}>Clear</button>
      </div>
      <div className="summary">
        <h2>Summary:</h2>
        <p>{summaryText}</p>
      </div>
    </div>
  );
};

export default YourMainApp;