/**
 * Code Handling Module
 * Manages code input, loading, and syntax highlighting
 */

export function setupCodeHandling() {
  const codeBlock = document.getElementById("codeBlock");
  const codeInput = document.getElementById("codeInput");
  const renderCodeBtn = document.getElementById("renderCodeBtn");
  const startBtn = document.getElementById("startBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const viewer = document.getElementById("viewer");
  const scrollContainer = document.getElementById("scrollContainer");
  const themeLink = document.getElementById("hljsTheme");
  const titleBar = document.getElementById("titleBar");

  // Initially disable buttons that require code
  startBtn.disabled = true;
  downloadBtn.disabled = true;

  // Track whether code has been loaded
  let codeLoaded = false;
  
  // Create placeholder text element
  let placeholderElement = null;
  
  // Setup editable title bar
  if (titleBar) {
    // Make title bar editable
    titleBar.contentEditable = true;
    
    // Focus handling - select all text when clicked
    titleBar.addEventListener('focus', function() {
      // Use setTimeout to ensure selection happens after focus
      setTimeout(() => {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(titleBar);
        selection.removeAllRanges();
        selection.addRange(range);
      }, 0);
      
      // Mark that user has manually focused/edited the filename
      localStorage.setItem('filename_edited', 'true');
    });
    
    // Handle enter key to save and blur
    titleBar.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        titleBar.blur();
      }
    });
    
    // Ensure filename has proper extension
    titleBar.addEventListener('blur', function() {
      let filename = titleBar.innerText.trim();
      
      if (!filename) {
        titleBar.innerText = 'code.js'; // Default filename
        return;
      }
      
      // Add .js extension if none exists
      if (!filename.includes('.')) {
        filename += '.js';
        titleBar.innerText = filename;
      }
      
      // Store filename in localStorage
      localStorage.setItem('filename', filename);
      
      console.log(`Filename updated to: ${filename}`);
    });
    
    // Load saved filename if available
    const savedFilename = localStorage.getItem('filename');
    if (savedFilename) {
      titleBar.innerText = savedFilename;
    }
  }
  
  function createOrUpdatePlaceholder() {
    // Remove any existing placeholder
    if (placeholderElement) {
      placeholderElement.remove();
    }
    
    // Create new placeholder
    placeholderElement = document.createElement('div');
    placeholderElement.className = 'placeholder-text';
    placeholderElement.textContent = "Code will appear here after you paste it above and click 'Load Code'";
    
    // Add placeholder to the appropriate container
    if (scrollContainer) {
      scrollContainer.appendChild(placeholderElement);
    } else {
      viewer.appendChild(placeholderElement);
    }
    
    // Hide codeBlock when showing placeholder
    if (codeBlock) {
      codeBlock.style.display = 'none';
    }
    
    console.log("Placeholder created/updated");
  }

  function loadCodeFromInput() {
    const codeText = codeInput.value;
    
    if (codeText.trim() === "") {
      // For empty input, show centered placeholder instead of code
      createOrUpdatePlaceholder();
      
      startBtn.disabled = true;
      downloadBtn.disabled = true;
      codeLoaded = false;
    } else {
      // Remove placeholder if it exists
      if (placeholderElement) {
        placeholderElement.remove();
        placeholderElement = null;
      }
      
      // Show and update code block with user code
      if (codeBlock) {
        codeBlock.style.display = 'block';
        codeBlock.textContent = codeText;
      }
      
      // Apply highlighting with a slight delay
      setTimeout(() => {
        console.log("Highlighting loaded code");
        if (codeBlock) {
          // Log what code is being highlighted
          console.log("Code being highlighted:", codeBlock.textContent.substring(0, 100) + "...");
          
          // Set language class
          codeBlock.className = "language-javascript";
          
          // Clear data-highlighted attribute to allow highlighting
          codeBlock.removeAttribute('data-highlighted');
          
          if (typeof hljs !== 'undefined') {
            try {
              // Get current theme
              const currentTheme = themeLink.getAttribute('href');
              console.log("Using theme:", currentTheme);
              
              // Highlight the code
              hljs.highlightElement(codeBlock);
              
              // Verify if highlight was applied by checking classes
              console.log("Syntax highlighting applied. Classes:", codeBlock.className);
              
              codeLoaded = true;
            } catch (error) {
              console.error("Error when highlighting code:", error);
            }
          } else {
            console.error('highlight.js is not loaded when trying to highlight code!');
          }
        }
      }, 10);
      
      startBtn.disabled = false;
      downloadBtn.disabled = false;
      
      // Reset scroll position to top
      if (scrollContainer) {
        scrollContainer.scrollTop = 0;
      } else {
        viewer.scrollTop = 0;
      }
      
      // Try to infer filename from first line comment if filename not manually edited
      if (!localStorage.getItem('filename_edited')) {
        const firstLine = codeText.split('\n')[0];
        if (firstLine.includes("File:") || firstLine.includes("file:")) {
          const inferredName = firstLine.split(':')[1].trim();
          titleBar.innerText = inferredName;
          localStorage.setItem('filename', inferredName);
        }
      }
    }
  }

  // Setup event listener for code loading button
  if (renderCodeBtn) {
    renderCodeBtn.addEventListener("click", () => {
      console.log("Load code button clicked");
      
      // Safety check for hljs
      if (typeof hljs === 'undefined') {
        console.error("highlight.js not loaded before loading code!");
        alert("Syntax highlighting is not available. The page may need to be refreshed.");
        return;
      }
      
      loadCodeFromInput();
    });
  } else {
    console.error("Code render button not found");
  }

  // Initialize highlight.js if available
  if (typeof hljs !== 'undefined') {
    // Configure highlight.js
    hljs.configure({languages: ['javascript']});
    
    // Show initial placeholder
    createOrUpdatePlaceholder();
  } else {
    console.error('highlight.js is not loaded during initialization!');
    alert("Syntax highlighting is not available. You may need to refresh the page.");
  }
  
  return {
    loadCodeFromInput,
    isCodeLoaded: () => codeLoaded
  };
} 