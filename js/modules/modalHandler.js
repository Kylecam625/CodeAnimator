/**
 * Modal Handler Module
 * Manages info popup and modal interactions
 */

export function setupModals() {
  const infoBtn = document.getElementById("infoBtn");
  const infoModal = document.getElementById("infoModal");
  const closeInfoModalBtn = document.getElementById("closeInfoModalBtn");

  if (infoBtn && infoModal && closeInfoModalBtn) {
    // Show modal when info button is clicked
    infoBtn.addEventListener("click", () => {
      infoModal.style.display = "block";
    });

    // Hide modal when close button is clicked
    closeInfoModalBtn.addEventListener("click", () => {
      infoModal.style.display = "none";
    });

    // Close modal if user clicks outside of the modal content
    window.addEventListener("click", (event) => {
      if (event.target == infoModal) {
        infoModal.style.display = "none";
      }
    });
    
    console.log("Modal handlers initialized");
  } else {
    console.error("Info button or modal elements not found. Check IDs in HTML.");
  }
} 