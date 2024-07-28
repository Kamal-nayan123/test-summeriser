import React, { useState } from 'react';
import './chat.css';
import ReactMarkdown from 'react-markdown'; // Import react-markdown

function Chat() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! I can answer your questions based on the PDF you uploaded.' },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async () => {
    if (userInput.trim() !== '') {
      setIsLoading(true); // Set loading state to true
      setMessages([
        ...messages,
        { role: 'user', content: userInput },
        { role: 'ai', content: 'Thinking...' },
      ]);
      setUserInput('');

      try {
        const response = await fetch('http://localhost:5000/search', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: userInput }),
        });

        if (response.ok) {
          const data = await response.json();
          setMessages([
            ...messages,
            { role: 'ai', content: data.answer },
          ]);
        } else {
          console.error('Error fetching data:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false); // Set loading state back to false after request
      }
    }
  };

  return (
    <div className="chat-container" style={{ padding: '20px', margin: '20px' }}> {/* Add padding and margin */}
      <div className="chat-header">
        <h2>Chat with AI</h2>
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role === 'ai' ? 'ai-message' : 'user-message'}`}>
            {/* Render Markdown using ReactMarkdown */}
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ))}
        {isLoading && (
          <div className="message ai-message">
            <div className="message-text">Loading...</div>
          </div>
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={userInput}
          onChange={handleInputChange}
          disabled={isLoading} // Disable input while loading
        />
        <button onClick={handleSubmit} disabled={isLoading}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;