/**
 * Animation Module
 * Handles animation and playback controls
 */

// Animation state
let animationId = null;
let startTimestamp = null;
let speed = 100; // pixels / second

export function setupAnimation() {
  // Get DOM elements
  const viewer = document.getElementById("viewer");
  const scrollContainer = document.getElementById("scrollContainer");
  const startBtn = document.getElementById("startBtn");
  const stopBtn = document.getElementById("stopBtn");
  const speedSlider = document.getElementById("speedSlider");
  const speedValue = document.getElementById("speedValue");
  const downloadBtn = document.getElementById("downloadBtn");
  const fullscreenBtn = document.getElementById("fullscreenBtn");

  // Initialize speed from slider
  if (speedSlider) {
    speed = Number(speedSlider.value);
  }

  /**
   * Animation step function - called by requestAnimationFrame
   */
  function step(timestamp) {
    if (!startTimestamp) startTimestamp = timestamp;
    const elapsed = timestamp - startTimestamp;
    
    // Use scrollContainer for animation
    if (scrollContainer) {
      scrollContainer.scrollTop = (elapsed / 1000) * speed;
      
      // End when scrolled to bottom, with a small buffer for better UX
      const isAtBottom = scrollContainer.scrollTop + scrollContainer.clientHeight >= 
                         scrollContainer.scrollHeight - 10;
      
      if (isAtBottom) {
        console.log("Reached bottom of code - stopping animation");
        stopAnimation();
        return;
      }
    } else {
      console.error("Scroll container not found");
      stopAnimation();
      return;
    }

    animationId = requestAnimationFrame(step);
  }

  /**
   * Start animation function
   */
  function startAnimation() {
    // Reset & UI state
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
    
    if (startBtn.disabled) { // Check if button is disabled (meaning no code loaded)
      alert("Please load some code first using the 'Load Code for Animation' button.");
      return;
    }

    // If an animation is already running, clear it before starting a new one.
    if (animationId) cancelAnimationFrame(animationId);

    startTimestamp = null;
    animationId = requestAnimationFrame(step);
    startBtn.disabled = true;
    stopBtn.disabled = false;
    downloadBtn.disabled = true;
  }

  /**
   * Stop animation function
   */
  function stopAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
      startBtn.disabled = false;
      stopBtn.disabled = true;
      downloadBtn.disabled = false;
    }
  }

  /**
   * Setup event listeners
   */
  if (startBtn) {
    startBtn.addEventListener("click", startAnimation);
  }

  if (stopBtn) {
    stopBtn.addEventListener("click", stopAnimation);
  }

  if (speedSlider) {
    speedSlider.addEventListener("input", (e) => {
      speed = Number(e.target.value);
      speedValue.textContent = `${speed} px/s`;
    });
  }

  /**
   * Fullscreen functionality
   */
  function enterCustomFullscreen() {
    // Add class to body for applying fullscreen styles
    document.body.classList.add("fullscreen-active");
    
    // Update fullscreen button title/tooltip
    if (fullscreenBtn) {
      fullscreenBtn.setAttribute('title', 'Exit fullscreen');
      fullscreenBtn.setAttribute('data-tooltip', 'Shortcuts: F - Exit fullscreen, R - Restart, ESC - Exit');
    }
    
    console.log("Entered custom fullscreen mode");
    return Promise.resolve();
  }
  
  function exitCustomFullscreen() {
    // Remove fullscreen class
    document.body.classList.remove("fullscreen-active");
    
    // Reset fullscreen button title/tooltip
    if (fullscreenBtn) {
      fullscreenBtn.setAttribute('title', 'Enter fullscreen');
      fullscreenBtn.setAttribute('data-tooltip', 'Shortcuts: F - Toggle fullscreen, R - Restart, G - Fullscreen & start');
    }
    
    console.log("Exited custom fullscreen mode");
    return Promise.resolve();
  }

  function go() {
    enterCustomFullscreen().then(() => {
      // Ensure starting from top
      startAnimation();
    });
  }

  function restart() {
    stopAnimation();
    startAnimation();
  }

  function toggleFullscreen() {
    if (document.body.classList.contains("fullscreen-active")) {
      exitCustomFullscreen();
      stopAnimation(); // Stop animation when exiting fullscreen
    } else {
      enterCustomFullscreen();
    }
  }
  
  /**
   * Setup fullscreen button if it exists in the HTML
   */
  if (fullscreenBtn) {
    // Add click event listener to the fullscreen button
    fullscreenBtn.addEventListener('click', () => {
      console.log('Fullscreen button clicked');
      
      // If already in fullscreen, exit it
      if (document.body.classList.contains("fullscreen-active")) {
        exitCustomFullscreen();
        stopAnimation();
      } else {
        // Otherwise enter fullscreen and start animation
        go();
      }
    });
    
    console.log('Fullscreen button initialized');
  } else {
    console.warn('Fullscreen button not found in the DOM');
  }

  // Keyboard shortcut listeners
  document.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    if (k === "g") {
      go();
    } else if (k === "r") {
      restart();
    } else if (k === "f") {
      toggleFullscreen();
    } else if (k === "escape" && document.body.classList.contains("fullscreen-active")) {
      exitCustomFullscreen();
      stopAnimation();
    }
  });
  
  // Power-saving: stop animation when user leaves page
  window.addEventListener("visibilitychange", () => {
    if (document.hidden && animationId) {
      stopAnimation();
    }
  });

  // Return animation control functions for external use
  return {
    start: startAnimation,
    stop: stopAnimation,
    restart,
    toggleFullscreen,
    enterFullscreen: enterCustomFullscreen,
    exitFullscreen: exitCustomFullscreen
  };
} 