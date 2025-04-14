import React, { useEffect, useRef, useCallback } from 'react';

const TweetHighlighter = () => {
  const observerRef = useRef(null);
  const processedElements = useRef(new Set());

  const TARGET_WORD = "@GiveRep";
  const DEBOUNCE_DELAY = 500;
  const THROTTLE_DELAY = 1000;

  const isElementVisible = useCallback((element) => {
    try {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    } catch (e) {
      console.error('Error checking element visibility:', e);
      return false;
    }
  }, []);

  const processTextNode = useCallback((node) => {
    if (!node.nodeValue.toLowerCase().includes(TARGET_WORD.toLowerCase())) {
      return;
    }

    const span = document.createElement('span');
    span.innerHTML = node.nodeValue.replace(
      new RegExp(TARGET_WORD.replace('@', '\\@'), 'gi'),
      match => `<span style="color: #1DA1F2; font-weight: bold;">${match} 😊</span>`
    );
    node.parentNode.replaceChild(span, node);
  }, []);

  const checkElementForWord = useCallback((element) => {
    if (!isElementVisible(element) || processedElements.current.has(element)) {
      return;
    }

    processedElements.current.add(element);

    const tweetTexts = element.querySelectorAll('[data-testid="tweetText"], [data-testid="tweet"]');
    tweetTexts.forEach(tweetText => {
      if (processedElements.current.has(tweetText)) {
        return;
      }

      processedElements.current.add(tweetText);
      
      const walker = document.createTreeWalker(
        tweetText,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );

      let node;
      while (node = walker.nextNode()) {
        processTextNode(node);
      }
    });
  }, [isElementVisible, processTextNode]);

  const checkForWord = useCallback(() => {
    const containers = [
      ...document.querySelectorAll('[data-testid="primaryColumn"]'),
      ...document.querySelectorAll('[data-testid="tweet"]')
    ];

    containers.forEach(container => {
      checkElementForWord(container);
    });

    const quoteTweets = document.querySelectorAll('[data-testid="tweet"] article');
    quoteTweets.forEach(tweet => {
      checkElementForWord(tweet);
    });
  }, [checkElementForWord]);

  const debouncedCheck = useCallback(() => {
    let timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(checkForWord, DEBOUNCE_DELAY);
    };
  }, [checkForWord]);

  const throttledCheck = useCallback(() => {
    let inThrottle = false;
    return () => {
      if (!inThrottle) {
        checkForWord();
        inThrottle = true;
        setTimeout(() => inThrottle = false, THROTTLE_DELAY);
      }
    };
  }, [checkForWord]);

  useEffect(() => {
    const setupObserver = () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new MutationObserver((mutations) => {
        const hasRelevantChanges = mutations.some(mutation => 
          mutation.type === 'childList' && 
          mutation.addedNodes.length > 0
        );
        
        if (hasRelevantChanges) {
          throttledCheck()();
        }
      });

      observerRef.current.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: false
      });

      setTimeout(checkForWord, 1000);
    };

    setupObserver();

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [checkForWord, throttledCheck]);

  return null; // This component doesn't render anything
};

export default TweetHighlighter; 