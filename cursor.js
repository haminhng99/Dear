<html>
  <head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Playwrite+MX+Guides&family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="style.css" />
  </head>

  <script src="https://aframe.io/releases/1.0.0/aframe.min.js"></script>
  <script src="https://raw.githack.com/jeromeetienne/AR.js/2.2.2/aframe/build/aframe-ar.min.js"></script>

  <script src="/components.js"></script>
  <script src="/cursor.js" defer></script>

  <body style="margin: 0px; overflow: hidden">
    <a-scene embedded arjs>
      <!-- AR Marker -->
      <a-marker preset="hiro" cursor="rayOrigin: mouse;">
        <a-image
          id="paperImage"
          src="https://cdn.glitch.global/d05931dc-b566-47cb-a189-db7a0c7310e1/paper-1.svg?v=1743792735960"
          scale="1 1.5 1"
          rotation="-90 0 0"
        >
        </a-image>
      </a-marker>

      <a-entity camera></a-entity>
    </a-scene>

    <!-- UI Container with Text Elements -->
    <div id="ui-container">
      <!-- Back Button (Icon) -->
      <a href="index.html">
        <button id="back-button">
          <img
            src="https://cdn.glitch.global/d05931dc-b566-47cb-a189-db7a0c7310e1/back-button.svg?v=1743734285937"
            alt="Back"
          />
        </button>
      </a>

      <h1>New Memory</h1>
      <h2>Step 1: Write a Note</h2>
    </div>

    <!-- Buttons Container -->
    <div id="button-container">
      <a href="step2.html">
        <button id="next-button">Next: Upload a video</button>
      </a>
      <button id="clear-button">Clear Drawing</button>
    </div>

    <style>
      /* Style for Back Button */
      #back-button {
        background: none;
        border: none;
        position: absolute;
        top: 20px;
        left: 20px;
        cursor: pointer;
      }

      #back-button img {
        width: 40px;
        height: auto;
      }
    </style>
    <canvas id="draw-canvas"></canvas>
  </body>
</html>
