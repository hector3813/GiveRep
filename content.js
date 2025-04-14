import React from 'react';
import { createRoot } from 'react-dom/client';
import TweetHighlighter from './components/TweetHighlighter';

// Create a container for our React app
const container = document.createElement('div');
container.id = 'twitter-word-detector-root';
document.body.appendChild(container);

// Create root and render our component
const root = createRoot(container);
root.render(<TweetHighlighter />); 