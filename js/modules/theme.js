/**
 * Theme handling module
 * Manages theme selection and application
 */

export function setupThemes() {
  const themeSelect = document.getElementById("themeSelect");
  const themeLink = document.getElementById("hljsTheme");
  const codeBlock = document.getElementById("codeBlock");
  const viewer = document.getElementById("viewer");
  const titleBar = document.getElementById("titleBar");

  // Map theme names to their backgrounds for viewer styling
  const themeBackgrounds = {
    'atom-one-dark': '#282c34',
    'github': '#f8f8f8',
    'monokai': '#272822',
    'androidstudio': '#282b2e',
    'dracula': '#282a36'
  };

  // Ensure the themeSelect element exists
  if (!themeSelect) {
    console.error("Theme selector not found in the DOM");
    return;
  }
  
  // Ensure the themeLink element exists
  if (!themeLink) {
    console.error("Theme stylesheet link not found in the DOM");
    return;
  }
  
  console.log("Theme setup: Initial elements verified");
  console.log("Theme elements:", { 
    themeSelect: !!themeSelect, 
    themeLink: !!themeLink, 
    codeBlock: !!codeBlock,
    viewer: !!viewer,
    titleBar: !!titleBar,
    hljs: typeof hljs !== 'undefined'
  });
  
  // Function to update UI elements to match the theme
  const updateThemeUI = (themeName) => {
    // First, remove all theme classes from affected elements
    const themeClasses = [
      'theme-atom-one-dark', 
      'theme-github', 
      'theme-monokai', 
      'theme-androidstudio', 
      'theme-dracula'
    ];
    
    if (viewer) {
      themeClasses.forEach(cls => viewer.classList.remove(cls));
      viewer.classList.add(`theme-${themeName}`);
    }
    
    if (titleBar) {
      themeClasses.forEach(cls => titleBar.classList.remove(cls));
      titleBar.classList.add(`theme-${themeName}`);
    }
    
    // Add theme body class for global styles if needed
    document.body.classList.forEach(cls => {
      if (cls.startsWith('theme-')) {
        document.body.classList.remove(cls);
      }
    });
    document.body.classList.add(`theme-${themeName}`);
    
    console.log(`Updated UI elements for theme: ${themeName}`);
  };
  
  // Function to update the theme
  const changeTheme = (themeName) => {
    console.log(`Changing theme to: ${themeName}`);
    
    // Verify hljs is loaded
    if (typeof hljs === 'undefined') {
      console.error("highlight.js is not loaded when changing theme!");
      return;
    }
    
    // Create the correct URL for the theme
    const themeUrl = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${themeName}.min.css`;
    
    // Log the old and new URLs for debugging
    console.log(`Changing theme URL from: ${themeLink.getAttribute('href')} to: ${themeUrl}`);
    
    // Update the href attribute of the theme link
    themeLink.setAttribute('href', themeUrl);
    
    // Update UI elements to match the theme
    updateThemeUI(themeName);
    
    // Save the selected theme in localStorage
    localStorage.setItem('selectedTheme', themeName);
    
    // Re-apply highlighting with a slight delay to ensure the theme loads
    setTimeout(() => {
      console.log("Re-highlighting code with new theme");
      if (codeBlock) {
        // Make sure language class is added
        codeBlock.className = 'language-javascript';
        
        try {
          // IMPORTANT: Clear the data-highlighted attribute to allow re-highlighting
          codeBlock.removeAttribute('data-highlighted');
          
          // Force to refresh the styles by removing and re-adding the stylesheet
          const oldHref = themeLink.getAttribute('href');
          themeLink.setAttribute('href', '');
          
          // Force browser to acknowledge the change
          void themeLink.offsetWidth;
          
          // Set it back
          themeLink.setAttribute('href', oldHref);
          
          // Re-highlight the code block
          hljs.highlightElement(codeBlock);
          
          console.log("Theme refresh complete:", themeName);
        } catch (error) {
          console.error("Error when applying theme:", error);
        }
      } else {
        console.error("Code block not found when trying to re-highlight");
      }
    }, 100);
  };
  
  // Load theme from localStorage if available
  const savedTheme = localStorage.getItem('selectedTheme');
  if (savedTheme) {
    console.log(`Loading saved theme: ${savedTheme}`);
    themeSelect.value = savedTheme;
    changeTheme(savedTheme);
  } else {
    // Apply default theme background (typically atom-one-dark)
    updateThemeUI('atom-one-dark');
  }
  
  // Add event listener to theme selector
  themeSelect.addEventListener('change', (e) => {
    const selectedTheme = e.target.value;
    changeTheme(selectedTheme);
  });
  
  console.log("Theme selector setup complete");
  
  // Expose the changeTheme function to the window for debugging
  window.changeTheme = changeTheme;
  
  // Return the changeTheme function for use by other modules
  return {
    changeTheme
  };
} 