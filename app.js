/* =====================================================================
 * Code Animation Program – main application logic
 * ===================================================================*/

// Elements ------------------------------------------------------------------
const viewer = document.getElementById("viewer");
const codeBlock = document.getElementById("codeBlock");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const speedSlider = document.getElementById("speedSlider");
const speedValue = document.getElementById("speedValue");
const downloadBtn = document.getElementById("downloadBtn");
const progressBar = document.getElementById("progressBar");
const codeInput = document.getElementById("codeInput");
const renderCodeBtn = document.getElementById("renderCodeBtn");
const infoBtn = document.getElementById("infoBtn");
const infoModal = document.getElementById("infoModal");
const closeInfoModalBtn = document.getElementById("closeInfoModalBtn");

// Config --------------------------------------------------------------------
let speed = Number(speedSlider.value); // pixels / second
let animationId = null;
let startTimestamp = null;

// ---------------------------------------------------------------------------
// Load the `code.js` file contents and render with highlight.js
// ---------------------------------------------------------------------------
// Initially disable buttons that require code
startBtn.disabled = true;
downloadBtn.disabled = true;

function loadCodeFromInput() {
  const codeText = codeInput.value;
  const titleBar = document.getElementById('titleBar');
  if (codeText.trim() === "") {
    codeBlock.textContent = "// Please paste some code into the input area above and click 'Load Code'.";
    hljs.highlightElement(codeBlock); // Apply styling to placeholder
    startBtn.disabled = true;
    downloadBtn.disabled = true;
    titleBar.textContent = "code.js"; // Reset title
  } else {
    codeBlock.textContent = codeText;
    hljs.highlightElement(codeBlock);
    startBtn.disabled = false;
    downloadBtn.disabled = false;
    viewer.scrollTop = 0; // Reset scroll position
    // Try to infer filename or use a default
    const firstLine = codeText.split('\n')[0];
    if (firstLine.includes("File:") || firstLine.includes("file:")) {
      titleBar.textContent = firstLine.split(':')[1].trim();
    } else {
      titleBar.textContent = "custom_code.js";
    }
  }
}

renderCodeBtn.addEventListener("click", loadCodeFromInput);

// ---------------------------------------------------------------------------
// Animation helpers
// ---------------------------------------------------------------------------
function step(timestamp) {
  if (!startTimestamp) startTimestamp = timestamp;
  const elapsed = timestamp - startTimestamp;
  viewer.scrollTop = (elapsed / 1000) * speed;

  // End when scrolled to bottom
  if (viewer.scrollTop + viewer.clientHeight >= viewer.scrollHeight) {
    stopAnimation();
    return;
  }

  animationId = requestAnimationFrame(step);
}

function startAnimation() {
  // Reset & UI state
  viewer.scrollTop = 0;
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

  // The following check seems more relevant to the download functionality or can be simplified.
  // For starting animation, the primary concern is whether code is loaded, which is handled by startBtn.disabled.
  // Removing this complex conditional block to simplify.
  /*
  if (downloadBtn.disabled && !startBtn.disabled) { // A bit of a hack to see if code was loaded
    // This state implies download was clicked before code was ready
  } else if (codeBlock.textContent.startsWith("// Please paste")) {
    alert("Please load some code first to download its animation.");
    // Re-enable buttons appropriately
    downloadBtn.disabled = false; // It was clicked, so re-enable
    // startBtn should remain disabled if no code, or enabled if there was code but not animating
    stopBtn.disabled = true;
    return;
  }
  */

  // The line below was moved to the beginning of the function.
  // if (animationId) cancelAnimationFrame(animationId);
}

function stopAnimation() {
  cancelAnimationFrame(animationId);
  animationId = null;
  startBtn.disabled = false;
  stopBtn.disabled = true;
  downloadBtn.disabled = false;
}

// ---------------------------------------------------------------------------
// Event listeners
// ---------------------------------------------------------------------------
startBtn.addEventListener("click", startAnimation);
stopBtn.addEventListener("click", stopAnimation);

speedSlider.addEventListener("input", (e) => {
  speed = Number(e.target.value);
  speedValue.textContent = `${speed} px/s`;
});

if (infoBtn && infoModal && closeInfoModalBtn) {
  infoBtn.addEventListener("click", () => {
    infoModal.style.display = "block";
  });

  closeInfoModalBtn.addEventListener("click", () => {
    infoModal.style.display = "none";
  });

  // Close modal if user clicks outside of the modal content
  window.addEventListener("click", (event) => {
    if (event.target == infoModal) {
      infoModal.style.display = "none";
    }
  });
} else {
  console.error("Info button or modal elements not found. Check IDs in HTML.");
}

// ---------------------------------------------------------------------------
// Video recording & downloading
// ---------------------------------------------------------------------------
let mediaRecorder = null;
let recordedChunks = [];

downloadBtn.addEventListener("click", async () => {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    // Already recording; prevent double-click
    return;
  }
  // Disable controls during capture
  downloadBtn.disabled = true;
  startBtn.disabled = true;
  stopBtn.disabled = true;

  // Pause UI scroll animation (we'll generate our own frames)
  if (animationId) cancelAnimationFrame(animationId);

  // Capture the FULL code block (not just viewport) for higher-quality video
  const dpi = window.devicePixelRatio || 1;
  const snapshotCanvas = await html2canvas(codeBlock, {
    scale: dpi * 2, // higher quality
    backgroundColor: null,
    useCORS: true,
  });

  // Create an off-screen canvas sized to viewport (hi-DPI aware)
  const canvas = document.createElement("canvas");
  canvas.width = viewer.clientWidth * dpi;
  canvas.height = viewer.clientHeight * dpi;
  const ctx = canvas.getContext("2d");

  // Capture the canvas as a MediaStream & setup recorder
  const FPS = 60;
  const stream = canvas.captureStream(FPS);
  mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  recordedChunks = [];
  mediaRecorder.ondataavailable = (e) => e.data && recordedChunks.push(e.data);
  mediaRecorder.onstop = saveRecording;
  mediaRecorder.start();

  // Calculate animation duration
  const totalScroll = codeBlock.scrollHeight - viewer.clientHeight;
  const durationMs = (totalScroll / speed) * 1000;
  const start = performance.now();

  const drawFrame = (now) => {
    const progress = Math.min((now - start) / durationMs, 1);
    const offset = progress * totalScroll;

    // Update progress bar
    progressBar.value = progress * 100;

    // draw snapshot with offset
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      snapshotCanvas,
      0,
      -offset * dpi * 2, // multiply by scale used in html2canvas
    );

    if (progress < 1) {
      requestAnimationFrame(drawFrame);
    } else {
      progressBar.value = 100;
      mediaRecorder.stop();
    }
  };
  requestAnimationFrame(drawFrame);
});

function saveRecording() {
  const blob = new Blob(recordedChunks, { type: "video/webm" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "code_animation.webm";
  a.click();
  URL.revokeObjectURL(url);

  // Re-enable controls
  downloadBtn.disabled = false;
  stopBtn.disabled = true;
  startBtn.disabled = false;

  // Hide / reset progress bar after short delay
  setTimeout(() => {
    progressBar.value = 0;
  }, 800);
}

// ---------------------------------------------------------------------------
// Accessibility: stop animation when user leaves page (power saving)
// ---------------------------------------------------------------------------
window.addEventListener("visibilitychange", () => {
  if (document.hidden && animationId) {
    stopAnimation();
  }
});

/* --------------------------------------------------------------------------
 * Fullscreen & keyboard controls
 * ------------------------------------------------------------------------*/

function enterFullscreen() {
  if (!document.fullscreenElement) {
    return document.documentElement.requestFullscreen({ navigationUI: "hide" }).catch(() => {});
  }
  return Promise.resolve();
}

function go() {
  enterFullscreen().then(() => {
    document.body.classList.add("fullscreen-active");
    // Ensure starting from top
    startAnimation();
  });
}

function restart() {
  stopAnimation();
  startAnimation();
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    enterFullscreen().then(() => {
      document.body.classList.add("fullscreen-active");
    });
  } else {
    document.exitFullscreen();
  }
}

document.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();
  if (k === "g") {
    go();
  } else if (k === "r") {
    restart();
  } else if (k === "f") {
    toggleFullscreen();
  }
});

/* Remove fullscreen-active class when exiting FS */
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    document.body.classList.remove("fullscreen-active");
  }
}); 