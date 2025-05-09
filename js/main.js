/**
 * Main entry point for Code Animation application
 */

import { setupThemes } from './modules/theme.js';
import { setupCodeHandling } from './modules/codeHandling.js';
import { setupAnimation } from './modules/animation.js';
import { setupExporter } from './modules/exporter.js';
import { setupModals } from './modules/modalHandler.js';

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing Code Animation application...');

  try {
    // First, check if highlight.js is properly loaded
    if (typeof hljs === 'undefined') {
      console.error('highlight.js is not loaded! Attempting to reload the script...');
      
      // Try to load highlight.js dynamically if not available
      const hljsScript = document.createElement('script');
      hljsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
      
      hljsScript.onload = () => {
        console.log('highlight.js loaded dynamically!');
        
        // Also load the JavaScript language support
        const hljsJsScript = document.createElement('script');
        hljsJsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/javascript.min.js';
        
        hljsJsScript.onload = () => {
          console.log('highlight.js JavaScript language support loaded!');
          initializeApp();
        };
        
        hljsJsScript.onerror = (error) => {
          console.error('Failed to load highlight.js JavaScript language support:', error);
          alert('Failed to load syntax highlighting. Please refresh the page or check your connection.');
        };
        
        document.head.appendChild(hljsJsScript);
      };
      
      hljsScript.onerror = (error) => {
        console.error('Failed to load highlight.js:', error);
        alert('Failed to load syntax highlighting. Please refresh the page or check your connection.');
      };
      
      document.head.appendChild(hljsScript);
    } else {
      // If highlight.js is already loaded, proceed with initialization
      console.log('highlight.js is already loaded, proceeding with initialization');
      initializeApp();
    }
  } catch (error) {
    console.error('Error during application initialization:', error);
    // Display a user-friendly error message
    alert('There was an error initializing the application. Please check the console for details or refresh the page.');
  }
  
  // Function to initialize app once highlight.js is ready
  function initializeApp() {
    try {
      // Initialize all modules in the correct order
      // Load code handling first as it sets up the code display area
      console.log('Setting up code handling...');
      const codeHandler = setupCodeHandling();
      
      // Then set up themes which depend on the code display being ready
      console.log('Setting up themes...');
      const themeHandler = setupThemes();
      
      // Initialize remaining modules
      console.log('Setting up animation...');
      setupAnimation();
      
      console.log('Setting up export functionality...');
      setupExporter();
      
      console.log('Setting up modal windows...');
      setupModals();

      console.log('Application initialization complete');
      
      // Store module handlers in window for debugging
      window._codeAnimationModules = {
        codeHandler,
        themeHandler
      };
    } catch (err) {
      console.error('Error initializing modules:', err);
      alert('There was an error setting up the application. You may need to refresh the page.');
    }
  }
}); 