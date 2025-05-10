// Tab functionality with swipe support
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");
const tabsContainer = document.querySelector(".tabs");

// Make tabs container horizontally scrollable
tabsContainer.style.overflowX = 'auto';
tabsContainer.style.WebkitOverflowScrolling = 'touch';

// Function to switch tabs
function switchTab(targetTab) {
  tabButtons.forEach(btn => btn.classList.remove("active"));
  tabContents.forEach(content => content.classList.remove("active"));

  const targetButton = document.querySelector(`[data-tab="${targetTab}"]`);
  targetButton.classList.add("active");
  document.getElementById(targetTab).classList.add("active");

  // Scroll the target button into view
  targetButton.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center'
  });
}

// Add click event listeners to tab buttons
tabButtons.forEach(button => {
  button.addEventListener("click", () => {
    switchTab(button.dataset.tab);
  });
});

// Swipe detection variables
let touchStartX = 0;
let touchEndX = 0;
const minSwipeDistance = 100;

// Get array of tab IDs in order
const tabOrder = Array.from(tabButtons).map(btn => btn.dataset.tab);

// Function to get next/previous tab
function getAdjacentTab(direction) {
  const currentTab = document.querySelector('.tab-button.active').dataset.tab;
  const currentIndex = tabOrder.indexOf(currentTab);
  
  if (direction === 'next') {
    return tabOrder[(currentIndex + 1) % tabOrder.length];
  } else {
    return tabOrder[(currentIndex - 1 + tabOrder.length) % tabOrder.length];
  }
}

// Touch event handlers
document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

// Handle swipe gesture
function handleSwipe() {
  const swipeDistance = touchEndX - touchStartX;
  
  if (Math.abs(swipeDistance) > minSwipeDistance) {
    // Left swipe
    if (swipeDistance < 0) {
      switchTab(getAdjacentTab('next'));
    }
    // Right swipe
    else {
      switchTab(getAdjacentTab('prev'));
    }
  }
}

// Matrix animation
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.querySelector(".matrix-background").appendChild(canvas);

const ctx = canvas.getContext("2d");
const columns = canvas.width / 20;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00ff00";
  ctx.font = "20px monospace";

  drops.forEach((y, x) => {
    const text = String.fromCharCode(33 + Math.random() * 94);
    ctx.fillText(text, x * 20, y * 20);

    if (y * 20 > canvas.height && Math.random() > 0.975) {
      drops[x] = 0;
    }
    drops[x]++;
  });

  requestAnimationFrame(drawMatrix);
}

drawMatrix();

// Swipe functionality for Imagegram
document.querySelectorAll('.image-slider').forEach(slider => {
  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener('mouseleave', () => (isDown = false));
  slider.addEventListener('mouseup', () => (isDown = false));

  slider.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
  });

  slider.addEventListener('touchstart', e => {
    startX = e.touches[0].pageX;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener('touchmove', e => {
    const x = e.touches[0].pageX;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
  });
});

// Centering the image slider content
document.querySelectorAll('.image-slider').forEach(slider => {
  const centerContent = () => {
    const sliderWidth = slider.offsetWidth;
    const scrollWidth = slider.scrollWidth;
    const centerOffset = (scrollWidth - sliderWidth) / 2;
    slider.scrollLeft = centerOffset;
  };

  // Center the content on load
  window.addEventListener('load', centerContent);

  // Re-center on window resize
  window.addEventListener('resize', centerContent);
});

// Handle window resize for matrix canvas
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drops.length = Math.floor(canvas.width / 20);
  drops.fill(1);
});