// Tab functionality with swipe support
const tabButtons: NodeListOf<HTMLElement> = document.querySelectorAll(".tab-button");
const tabContents: NodeListOf<HTMLElement> = document.querySelectorAll(".tab-content");
const tabsContainer: HTMLElement | null = document.querySelector(".tabs");

// Make tabs container horizontally scrollable
if (tabsContainer) {
  tabsContainer.style.overflowX = 'auto';
}

// Add hover effect to tab buttons
tabButtons.forEach(button => {
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'translateY(-3px)';
    button.style.boxShadow = '0 5px 15px rgba(0, 255, 0, 0.3)';
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translateY(0)';
    button.style.boxShadow = 'none';
  });
});

// Function to switch tabs with animation
function switchTab(targetTab: string): void {
  // Fade out current active content
  const currentActiveContent = document.querySelector('.tab-content.active');
  if (currentActiveContent) {
    currentActiveContent.classList.add('fade-out');
    setTimeout(() => {
      currentActiveContent.classList.remove('active', 'fade-out');
      
      // Fade in new content
      const targetContent = document.getElementById(targetTab);
      if (targetContent) {
        targetContent.classList.add('active', 'fade-in');
        setTimeout(() => {
          targetContent.classList.remove('fade-in');
        }, 300);
      }
    }, 300);
  }

  // Update tab buttons
  tabButtons.forEach(btn => btn.classList.remove("active"));
  const targetButton = document.querySelector(`[data-tab="${targetTab}"]`) as HTMLElement;
  if (targetButton) {
    targetButton.classList.add("active");
  }

  // Scroll the target button into view
  targetButton?.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center'
  });
}

// Add click event listeners to tab buttons
tabButtons.forEach(button => {
  button.addEventListener("click", () => {
    const tabName = button.getAttribute('data-tab');
    if (tabName) {
      switchTab(tabName);
    }
  });
});

// Swipe detection variables
let touchStartX: number = 0;
let touchEndX: number = 0;
const minSwipeDistance: number = 100;

// Get array of tab IDs in order
const tabOrder: string[] = Array.from(tabButtons).map(btn => btn.getAttribute('data-tab') || '');

// Function to get next/previous tab
function getAdjacentTab(direction: 'next' | 'prev'): string {
  const activeButton = document.querySelector('.tab-button.active') as HTMLElement;
  const currentTab = activeButton?.getAttribute('data-tab') || '';
  const currentIndex = tabOrder.indexOf(currentTab);
  
  if (direction === 'next') {
    return tabOrder[(currentIndex + 1) % tabOrder.length];
  } else {
    return tabOrder[(currentIndex - 1 + tabOrder.length) % tabOrder.length];
  }
}

// Touch event handlers
document.addEventListener('touchstart', (e: TouchEvent) => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e: TouchEvent) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

// Handle swipe gesture
function handleSwipe(): void {
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

// Matrix background animation
const canvas = document.getElementById('matrixCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops: number[] = [];

for (let i = 0; i < columns; i++) {
  drops[i] = 1;
}

function drawMatrix(): void {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#0F0';
  ctx.font = `${fontSize}px monospace`;
  
  for (let i = 0; i < drops.length; i++) {
    const text = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

setInterval(drawMatrix, 33);

// Add parallax effect to the welcome text
const welcomeText = document.querySelector('h1');
if (welcomeText) {
  window.addEventListener('mousemove', (e: MouseEvent) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    welcomeText.style.transform = `translate(${x * 20 - 10}px, ${y * 20 - 10}px)`;
    welcomeText.style.textShadow = `${x * 10}px ${y * 10}px 10px rgba(0, 255, 0, 0.5)`;
  });
}

// Add typing effect to the welcome text
function typeWriter(element: HTMLElement, text: string, i: number = 0): void {
  if (i < text.length) {
    element.innerHTML = text.substring(0, i + 1) + '<span class="cursor">|</span>';
    setTimeout(() => typeWriter(element, text, i + 1), 100);
  } else {
    element.innerHTML = text + '<span class="cursor">|</span>';
  }
}

if (welcomeText) {
  const originalText = welcomeText.textContent || '';
  welcomeText.textContent = '';
  setTimeout(() => {
    typeWriter(welcomeText as HTMLElement, originalText);
  }, 500);
}

// Swipe functionality for Imagegram with enhanced animations
document.querySelectorAll('.image-slider').forEach((slider) => {
  const htmlSlider = slider as HTMLElement;
  let isDown: boolean = false;
  let startX: number;
  let scrollLeft: number;

  htmlSlider.addEventListener('mousedown', (e: MouseEvent) => {
    isDown = true;
    startX = e.pageX - htmlSlider.offsetLeft;
    scrollLeft = htmlSlider.scrollLeft;
    htmlSlider.style.cursor = 'grabbing';
  });

  htmlSlider.addEventListener('mouseleave', () => {
    isDown = false;
    htmlSlider.style.cursor = 'grab';
  });
  
  htmlSlider.addEventListener('mouseup', () => {
    isDown = false;
    htmlSlider.style.cursor = 'grab';
  });

  htmlSlider.addEventListener('mousemove', (e: MouseEvent) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - htmlSlider.offsetLeft;
    const walk = (x - startX) * 2;
    htmlSlider.scrollLeft = scrollLeft - walk;
  });

  htmlSlider.addEventListener('touchstart', (e: TouchEvent) => {
    startX = e.touches[0].pageX;
    scrollLeft = htmlSlider.scrollLeft;
  });

  htmlSlider.addEventListener('touchmove', (e: TouchEvent) => {
    const x = e.touches[0].pageX;
    const walk = (x - startX) * 2;
    htmlSlider.scrollLeft = scrollLeft - walk;
  });
  
  // Add hover effect to slider images
  const sliderImages = htmlSlider.querySelectorAll('img');
  sliderImages.forEach(img => {
    img.addEventListener('mouseenter', () => {
      img.style.transform = 'scale(1.05)';
      img.style.transition = 'transform 0.3s ease';
    });
    
    img.addEventListener('mouseleave', () => {
      img.style.transform = 'scale(1)';
    });
  });
});

// Centering the image slider content
document.querySelectorAll('.image-slider').forEach((slider) => {
  const htmlSlider = slider as HTMLElement;
  const centerContent = (): void => {
    const sliderWidth = htmlSlider.offsetWidth;
    const scrollWidth = htmlSlider.scrollWidth;
    const centerOffset = (scrollWidth - sliderWidth) / 2;
    htmlSlider.scrollLeft = centerOffset;
  };

  // Center the content on load
  window.addEventListener('load', centerContent);

  // Re-center on window resize
  window.addEventListener('resize', centerContent);
});

// Scroll reveal animations
function revealOnScroll(): void {
  const elements = document.querySelectorAll('.project, .skill-item, .timeline-item, .education-item, .contact-item');
  
  elements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;
    
    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add('revealed');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);

// Create sustainable leaf animation
function createLeaves(): void {
  const leafContainer = document.createElement('div');
  leafContainer.className = 'leaves';
  document.body.appendChild(leafContainer);
  
  for (let i = 0; i < 15; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    
    // Random position
    leaf.style.left = `${Math.random() * 100}%`;
    leaf.style.top = `${Math.random() * 100}%`;
    
    // Random size
    const size = Math.random() * 15 + 10;
    leaf.style.width = `${size}px`;
    leaf.style.height = `${size}px`;
    
    // Random animation duration
    leaf.style.animationDuration = `${Math.random() * 20 + 15}s`;
    
    // Random animation delay
    leaf.style.animationDelay = `${Math.random() * 10}s`;
    
    leafContainer.appendChild(leaf);
  }
}

// Create solar panel element
function createSolarPanel(): void {
  const solarPanel = document.createElement('div');
  solarPanel.className = 'solar-panel';
  document.body.appendChild(solarPanel);
}

// Enhanced particle effect with sustainable theme
function createParticles(): void {
  const particleContainer = document.createElement('div');
  particleContainer.className = 'particles';
  document.body.appendChild(particleContainer);
  
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    
    // Random size
    const size = Math.random() * 5 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random animation duration
    particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
    
    // Random animation delay
    particle.style.animationDelay = `${Math.random() * 5}s`;
    
    particleContainer.appendChild(particle);
  }
}

function createWindTurbine() {
  const turbine = document.createElement('div');
  turbine.className = 'wind-turbine';
  
  const base = document.createElement('div');
  base.className = 'turbine-base';
  
  const blades = document.createElement('div');
  blades.className = 'turbine-blades';
  
  // Create three blades
  for (let i = 0; i < 3; i++) {
    const blade = document.createElement('div');
    blade.className = 'blade';
    blades.appendChild(blade);
  }
  
  turbine.appendChild(base);
  turbine.appendChild(blades);
  document.body.appendChild(turbine);
}

function createBinaryRain() {
  const binaryContainer = document.createElement('div');
  binaryContainer.className = 'binary-rain';
  document.body.appendChild(binaryContainer);
  
  const binaryChars = '01';
  const columns = Math.floor(window.innerWidth / 20);
  
  for (let i = 0; i < columns; i++) {
    const drop = document.createElement('div');
    drop.className = 'binary-drop';
    drop.style.left = `${i * 20}px`;
    drop.style.animationDelay = `${Math.random() * 5}s`;
    drop.textContent = binaryChars[Math.floor(Math.random() * binaryChars.length)];
    binaryContainer.appendChild(drop);
  }
}

function createCircuitBoard() {
  const circuitContainer = document.createElement('div');
  circuitContainer.className = 'circuit-board';
  document.body.appendChild(circuitContainer);
}

// Function to handle hover-based image cycling for sliders
function initializeHoverImageCycling() {
  // Find project cards that contain an image slider
  document.querySelectorAll('.project').forEach(projectCard => {
    const slider = projectCard.querySelector('.image-slider') as HTMLElement;
    // Only proceed if this project card actually has a slider
    if (!slider) return;

    const images = Array.from(slider.querySelectorAll('.slider-item')) as HTMLElement[];
    // Don't cycle if there's only one image or none
    if (images.length <= 1) return;

    let intervalId: number | null = null;
    let currentIndex = 0;
    const cycleDelay = 1800; // Time in milliseconds between image changes

    const startCycling = () => {
      // Clear any existing interval first
      if (intervalId) clearInterval(intervalId);

      intervalId = window.setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        const targetImage = images[currentIndex];

        // Calculate scroll position to center the target image in the slider view
        const scrollLeftTarget = targetImage.offsetLeft + targetImage.offsetWidth / 2 - slider.offsetWidth / 2;

        slider.scrollTo({
          left: scrollLeftTarget,
          behavior: 'smooth' // Use smooth scrolling animation
        });
      }, cycleDelay);
    };

    const stopCycling = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      // Optional: Reset slider to the first image when hover stops
      // slider.scrollTo({ left: 0, behavior: 'smooth' });
      // currentIndex = 0;
    };

    // Start cycling when mouse enters the project card
    projectCard.addEventListener('mouseenter', startCycling);
    // Stop cycling when mouse leaves the project card
    projectCard.addEventListener('mouseleave', stopCycling);

    // Also stop cycling if the user starts manually dragging the slider
    slider.addEventListener('mousedown', stopCycling);
    slider.addEventListener('touchstart', stopCycling);
  });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Tab management
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = (button as HTMLElement).dataset.tab;
      
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      document.getElementById(tabId!)?.classList.add('active');
      
      // Trigger scroll reveal for newly visible content
      revealOnScroll();
    });
  });
  
  // Initialize image sliders
  initializeImageSliders();
  
  // Initialize particle effects
  createParticles();
  
  // Initialize leaf animations
  createLeaves();
  
  // Initialize solar panel
  createSolarPanel();
  createWindTurbine();
  
  // Add hover effects to headings
  document.querySelectorAll('h3').forEach(heading => {
    heading.addEventListener('mouseenter', () => {
      heading.classList.add('hover');
    });
    
    heading.addEventListener('mouseleave', () => {
      heading.classList.remove('hover');
    });
  });
  
  // Add hover effects to skill items
  document.querySelectorAll('.skill-item').forEach(skill => {
    skill.addEventListener('mouseenter', () => {
      skill.classList.add('hover');
    });
    
    skill.addEventListener('mouseleave', () => {
      skill.classList.remove('hover');
    });
  });
  
  // Add hover effects to project links
  document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.classList.add('hover');
    });
    
    link.addEventListener('mouseleave', () => {
      link.classList.remove('hover');
    });
  });
  
  // Add hover effects to contact items
  document.querySelectorAll('.contact-item').forEach(contact => {
    contact.addEventListener('mouseenter', () => {
      contact.classList.add('hover');
    });
    
    contact.addEventListener('mouseleave', () => {
      contact.classList.remove('hover');
    });
  });
  
  // Initialize the new hover-based image cycling
  initializeHoverImageCycling();
  
  // Trigger initial scroll reveal
  revealOnScroll();
  
  createBinaryRain();
  createCircuitBoard();
});

// Image slider functionality
function initializeImageSliders(): void {
  document.querySelectorAll('.image-slider').forEach((slider) => {
    const htmlSlider = slider as HTMLElement;
    let isDown = false;
    let startX: number;
    let scrollLeft: number;
    
    // Mouse events
    htmlSlider.addEventListener('mousedown', (e: MouseEvent) => {
      isDown = true;
      htmlSlider.style.cursor = 'grabbing';
      startX = e.pageX - htmlSlider.offsetLeft;
      scrollLeft = htmlSlider.scrollLeft;
    });
    
    htmlSlider.addEventListener('mouseleave', () => {
      isDown = false;
      htmlSlider.style.cursor = 'grab';
    });
    
    htmlSlider.addEventListener('mouseup', () => {
      isDown = false;
      htmlSlider.style.cursor = 'grab';
    });
    
    htmlSlider.addEventListener('mousemove', (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - htmlSlider.offsetLeft;
      const walk = (x - startX) * 2;
      htmlSlider.scrollLeft = scrollLeft - walk;
    });
    
    // Touch events
    htmlSlider.addEventListener('touchstart', (e: TouchEvent) => {
      isDown = true;
      startX = e.touches[0].pageX - htmlSlider.offsetLeft;
      scrollLeft = htmlSlider.scrollLeft;
    });
    
    htmlSlider.addEventListener('touchend', () => {
      isDown = false;
    });
    
    htmlSlider.addEventListener('touchmove', (e: TouchEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.touches[0].pageX - htmlSlider.offsetLeft;
      const walk = (x - startX) * 2;
      htmlSlider.scrollLeft = scrollLeft - walk;
    });
    
    // Add hover effect to slider images
    const sliderImages = htmlSlider.querySelectorAll('img');
    sliderImages.forEach(img => {
      img.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.05)';
        img.style.transition = 'transform 0.3s ease';
      });
      
      img.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
      });
    });
    
    // Center the content
    const centerContent = (): void => {
      const sliderWidth = htmlSlider.offsetWidth;
      const scrollWidth = htmlSlider.scrollWidth;
      const centerOffset = (scrollWidth - sliderWidth) / 2;
      htmlSlider.scrollLeft = centerOffset;
    };
    
    // Center on load and resize
    window.addEventListener('load', centerContent);
    window.addEventListener('resize', centerContent);
  });
}

// Handle window resize
window.addEventListener('resize', () => {
  // Update matrix canvas
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drops.length = Math.floor(canvas.width / fontSize);
  drops.fill(1);
  
  // Re-center image sliders
  document.querySelectorAll('.image-slider').forEach((slider) => {
    const htmlSlider = slider as HTMLElement;
    const sliderWidth = htmlSlider.offsetWidth;
    const scrollWidth = htmlSlider.scrollWidth;
    const centerOffset = (scrollWidth - sliderWidth) / 2;
    htmlSlider.scrollLeft = centerOffset;
  });
  
  // Re-run scroll reveal
  revealOnScroll();
}); 