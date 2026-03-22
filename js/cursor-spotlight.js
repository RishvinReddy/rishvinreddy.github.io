// Dynamic Lighting Effect for Premium Cards
document.addEventListener("DOMContentLoaded", () => {
  function applySpotlight() {
    const cards = document.querySelectorAll('.card-premium');
    
    // Create glow elements inside each card if they don't exist
    cards.forEach(card => {
      // Ensure the card can house the absolute glow
      if(getComputedStyle(card).position === 'static') {
        card.style.position = 'relative'; 
      }
      
      if(!card.querySelector('.card-premium-glow')) {
        const glowWrapper = document.createElement('div');
        glowWrapper.className = 'card-premium-glow';
        card.appendChild(glowWrapper);
      }
    });

    // Track mouse over cards for dynamic lighting
    document.addEventListener("mousemove", (e) => {
      for (const card of document.querySelectorAll(".card-premium")) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      }
    });
  }

  applySpotlight();
  
  // Also run it periodically in case new cards are injected or page transitions occur
  setInterval(applySpotlight, 2000);
});
