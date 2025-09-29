// Component to detect swipe gestures and scroll images
AFRAME.registerComponent('swipe-to-scroll', {
  schema: {
    swipeThreshold: { type: 'number', default: 50 }, // Swipe threshold in pixels
  },

  init: function () {
    this.startX = 0;
    this.endX = 0;

    // Bind touch events for swipe detection
    this.el.addEventListener('touchstart', (event) => {
      this.startX = event.touches[0].clientX;
    });

    this.el.addEventListener('touchmove', (event) => {
      this.endX = event.touches[0].clientX;
      this.handleSwipe();
    });
  },

  handleSwipe: function () {
    let swipeDistance = this.endX - this.startX;

    if (Math.abs(swipeDistance) > this.data.swipeThreshold) {
      if (swipeDistance > 0) {
        this.direction = 'right';
      } else {
        this.direction = 'left';
      }

      this.scrollImages(this.direction);
      this.startX = this.endX; // reset start position after swipe
    }
  },

  scrollImages: function (direction) {
    const images = [
      document.querySelector('#image1'),
      document.querySelector('#image2'),
      document.querySelector('#image3'),
      document.querySelector('#image4'),
      document.querySelector('#image5'),
      document.querySelector('#image6'),
      document.querySelector('#image7')
    ];

    let moveDistance = direction === 'right' ? 1 : -1;

    images.forEach(image => {
      let currentPosition = image.getAttribute('position').x;
      image.setAttribute('position', { x: currentPosition + moveDistance, y: image.getAttribute('position').y, z: image.getAttribute('position').z });
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Drawing functionality
  const canvas = document.getElementById("draw-canvas");
  const ctx = canvas.getContext("2d");

  let drawing = false;
  let lastX = 0;
  let lastY = 0;

  // Set canvas size to full screen
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Drawing style
  ctx.strokeStyle = "#BCB6FF";
  ctx.lineWidth = 3;

  // Start drawing
  canvas.addEventListener("touchstart", function (e) {
    drawing = true;
    const touch = e.touches[0];
    lastX = touch.clientX;
    lastY = touch.clientY;
  });

  // Draw on movement
  canvas.addEventListener("touchmove", function (e) {
    if (!drawing) return;

    const touch = e.touches[0];
    const currentX = touch.clientX;
    const currentY = touch.clientY;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    lastX = currentX;
    lastY = currentY;

    e.preventDefault(); // Prevent scrolling
  });

  // Stop drawing
  canvas.addEventListener("touchend", function () {
    drawing = false;
  });

  // Clear button functionality
  const clearBtn = document.getElementById("clear-button");
  clearBtn.addEventListener("click", function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  // Save drawing to local storage
  const saveDrawing = () => {
    const dataUrl = canvas.toDataURL();
    localStorage.setItem("drawingData", dataUrl); // Save the drawing as data URL
  };

  // Trigger save drawing when you need to (e.g., when navigating to Step 3)
  const nextButton = document.getElementById("next-button");
  nextButton.addEventListener("click", saveDrawing);
});

document.addEventListener("DOMContentLoaded", function () {
  // Image upload functionality
  const imageInput = document.getElementById("imageUpload");
  const uploadedImageWrapper = document.getElementById("uploadedImageWrapper");
  const changeImageButton = document.getElementById("change-image-button");
  const uploadLabel = document.getElementById("upload-label");

  // Initially hide the Change Image button
  changeImageButton.style.display = "none";

  // Handle image upload
  imageInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      // Create a new image element for the uploaded image
      const img = new Image();
      img.src = e.target.result;
      img.onload = function () {
        // Determine the size for cropping (square)
        const size = Math.min(img.width, img.height); // Use the smaller dimension

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set canvas size to the square size
        canvas.width = size;
        canvas.height = size;

        // Crop the image to a square (centered)
        ctx.drawImage(
          img,
          (img.width - size) / 2, // Crop the image from the center
          (img.height - size) / 2,
          size,
          size,
          0,
          0,
          size,
          size
        );

        // Create a new image element from the canvas
        const croppedImage = new Image();
        croppedImage.src = canvas.toDataURL(); // Convert canvas to image
        croppedImage.alt = "Uploaded Image";
        croppedImage.style.width = "90%"; // Adjust width as needed
        croppedImage.style.height = "auto"; // Maintain aspect ratio
        croppedImage.style.objectFit = "contain"; // Ensure it fits within the wrapper

        // Add the cropped image to the wrapper
        uploadedImageWrapper.innerHTML = ''; // Clear any previous images
        uploadedImageWrapper.appendChild(croppedImage);

        // Save the image data to localStorage for later use in Step 3
        localStorage.setItem("uploadedImage", croppedImage.src);

        // Hide the Upload Image button and show the Change Image button
        uploadLabel.style.display = "none";
        changeImageButton.style.display = "block"; // Show Change Image button
      };
    };
    reader.readAsDataURL(file);
  });

  // Change image functionality
  changeImageButton.addEventListener("click", function () {
    imageInput.click(); // Trigger the file input click event
  });

  // Trigger the file input click event when the upload button is clicked
  uploadLabel.addEventListener("click", function () {
    imageInput.click(); // Click the file input to open the file upload dialog
  });
});