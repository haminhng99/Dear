// cursor.js

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("draw-canvas");
  if (!canvas) return; // Only run on Step 1

  const ctx = canvas.getContext("2d");
  const undoBtn = document.getElementById("undo-button");
  const clearBtn = document.getElementById("clear-button");

  // Resize canvas for screen and DPR
  function resizeCanvas() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const { innerWidth: w, innerHeight: h } = window;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    redraw();
  }
  window.addEventListener("resize", resizeCanvas, { passive: true });
  resizeCanvas();

  // Stroke data
  const strokes = [];
  const redo = [];
  let drawing = false;
  let curr = null;

  const brush = { color: "#111", baseWidth: 3.0 };

  function pointerPos(e) {
    if (e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        p: e.touches[0].force || 0.5,
      };
    }
    return {
      x: e.clientX,
      y: e.clientY,
      p: e.pressure && e.pressure > 0 ? e.pressure : 0.5,
    };
  }

  function beginStroke(e) {
    e.preventDefault();
    const { x, y, p } = pointerPos(e);
    drawing = true;
    curr = {
      points: [{ x, y }],
      lineWidth: Math.max(1, brush.baseWidth * (0.7 + 0.6 * p)),
      color: brush.color,
    };
    ctx.beginPath();
    ctx.arc(x, y, curr.lineWidth * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = curr.color;
    ctx.fill();
  }

  function moveStroke(e) {
    if (!drawing || !curr) return;
    const { x, y, p } = pointerPos(e);
    const lw = Math.max(1, brush.baseWidth * (0.7 + 0.6 * p));
    const pts = curr.points;
    const prev = pts[pts.length - 1];
    if (!prev || Math.hypot(x - prev.x, y - prev.y) > 0.5) {
      pts.push({ x, y });
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(x, y);
      ctx.lineWidth = (lw + curr.lineWidth) / 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = curr.color;
      ctx.stroke();
      curr.lineWidth = lw;
    }
  }

  function endStroke() {
    if (!drawing || !curr) return;
    drawing = false;
    if (curr.points.length > 0) {
      strokes.push(curr);
      redo.length = 0;
    }
    curr = null;
  }

  function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of strokes) {
      ctx.strokeStyle = s.color;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (let i = 1; i < s.points.length; i++) {
        const a = s.points[i - 1],
          b = s.points[i];
        ctx.lineWidth = s.lineWidth;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      if (s.points.length === 1) {
        const p = s.points[0];
        ctx.beginPath();
        ctx.arc(p.x, p.y, s.lineWidth * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.fill();
      }
    }
  }

  // Events
  canvas.addEventListener("pointerdown", beginStroke);
  canvas.addEventListener("pointermove", moveStroke);
  window.addEventListener("pointerup", endStroke);
  canvas.addEventListener("touchstart", beginStroke, { passive: false });
  canvas.addEventListener("touchmove", moveStroke, { passive: false });
  window.addEventListener("touchend", endStroke);

  // Buttons
  if (undoBtn) {
    undoBtn.addEventListener("click", () => {
      if (strokes.length === 0) return;
      const popped = strokes.pop();
      redo.push(popped);
      redraw();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      strokes.length = 0;
      redo.length = 0;
      redraw();
    });
  }
});
