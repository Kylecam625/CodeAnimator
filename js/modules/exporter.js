/**
 * Exporter Module
 * Handles video recording and download functionality
 */

export function setupExporter() {
  // Get DOM elements
  const codeBlock = document.getElementById("codeBlock");
  const viewer = document.getElementById("viewer");
  const downloadBtn = document.getElementById("downloadBtn");
  const progressBar = document.getElementById("progressBar");
  const startBtn = document.getElementById("startBtn");
  const stopBtn = document.getElementById("stopBtn");
  const speedSlider = document.getElementById("speedSlider");

  // Ensure necessary elements exist
  if (!downloadBtn || !codeBlock || !viewer || !progressBar) {
    console.error("Required elements for exporter not found");
    return;
  }

  // Get current speed setting
  const getSpeed = () => Number(speedSlider?.value || 100);

  // Recorder state
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
    const speed = getSpeed();
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
} 