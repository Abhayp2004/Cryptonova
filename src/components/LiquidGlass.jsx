import React, { useEffect, useRef, useState } from 'react';

const LiquidGlass = () => {
  const containerRef = useRef(null);
  const shaderRef = useRef(null);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    if (!isEnabled) {
      // Clean up if disabled
      if (shaderRef.current) {
        shaderRef.current.destroy();
        shaderRef.current = null;
      }
      if (window.liquidGlass) {
        delete window.liquidGlass;
      }
      return;
    }

    // Check if liquid glass already exists and destroy it
    if (window.liquidGlass) {
      window.liquidGlass.destroy();
      console.log('Previous liquid glass effect removed.');
    }

    // Utility functions
    function smoothStep(a, b, t) {
      t = Math.max(0, Math.min(1, (t - a) / (b - a)));
      return t * t * (3 - 2 * t);
    }

    function length(x, y) {
      return Math.sqrt(x * x + y * y);
    }

    function roundedRectSDF(x, y, width, height, radius) {
      const qx = Math.abs(x) - width + radius;
      const qy = Math.abs(y) - height + radius;
      return Math.min(Math.max(qx, qy), 0) + length(Math.max(qx, 0), Math.max(qy, 0)) - radius;
    }

    function texture(x, y) {
      return { type: 't', x, y };
    }

    // Generate unique ID
    function generateId() {
      return 'liquid-glass-' + Math.random().toString(36).substr(2, 9);
    }

    // Main Shader class
    class Shader {
      constructor(options = {}) {
        this.width = options.width || 300;
        this.height = options.height || 200;
        this.fragment = options.fragment || ((uv) => texture(uv.x, uv.y));
        this.canvasDPI = 1;
        this.id = generateId();
        this.offset = 10; // Viewport boundary offset
        
        this.mouse = { x: 0, y: 0 };
        this.mouseUsed = false;
        
        this.createElement();
        this.setupEventListeners();
        this.updateShader();
      }

      createElement() {
        // Create container with light grey styling
        this.container = document.createElement('div');
        this.container.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: ${this.width}px;
          height: ${this.height}px;
          overflow: hidden;
          border-radius: 150px;
          background: rgba(200, 200, 200, 0.15);
          border: 2px solid rgba(180, 180, 180, 0.3);
          box-shadow: 
            0 8px 32px rgba(255, 255, 255, 0.1),
            0 4px 16px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1);
          cursor: grab;
          backdrop-filter: url(#${this.id}_filter) blur(0.25px) contrast(1.2) brightness(1.05) saturate(1.1);
          z-index: 9999;
          pointer-events: auto;
          transition: all 0.3s ease;
        `;

        // Create SVG filter
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        this.svg.setAttribute('width', '0');
        this.svg.setAttribute('height', '0');
        this.svg.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 9998;
        `;

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter.setAttribute('id', `${this.id}_filter`);
        filter.setAttribute('filterUnits', 'userSpaceOnUse');
        filter.setAttribute('colorInterpolationFilters', 'sRGB');
        filter.setAttribute('x', '0');
        filter.setAttribute('y', '0');
        filter.setAttribute('width', this.width.toString());
        filter.setAttribute('height', this.height.toString());

        this.feImage = document.createElementNS('http://www.w3.org/2000/svg', 'feImage');
        this.feImage.setAttribute('id', `${this.id}_map`);
        this.feImage.setAttribute('width', this.width.toString());
        this.feImage.setAttribute('height', this.height.toString());

        this.feDisplacementMap = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
        this.feDisplacementMap.setAttribute('in', 'SourceGraphic');
        this.feDisplacementMap.setAttribute('in2', `${this.id}_map`);
        this.feDisplacementMap.setAttribute('xChannelSelector', 'R');
        this.feDisplacementMap.setAttribute('yChannelSelector', 'G');

        filter.appendChild(this.feImage);
        filter.appendChild(this.feDisplacementMap);
        defs.appendChild(filter);
        this.svg.appendChild(defs);

        // Create canvas for displacement map (hidden)
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width * this.canvasDPI;
        this.canvas.height = this.height * this.canvasDPI;
        this.canvas.style.display = 'none';

        this.context = this.canvas.getContext('2d');
      }

      constrainPosition(x, y) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Calculate boundaries with offset
        const minX = this.offset;
        const maxX = viewportWidth - this.width - this.offset;
        const minY = this.offset;
        const maxY = viewportHeight - this.height - this.offset;
        
        // Constrain position
        const constrainedX = Math.max(minX, Math.min(maxX, x));
        const constrainedY = Math.max(minY, Math.min(maxY, y));
        
        return { x: constrainedX, y: constrainedY };
      }

      setupEventListeners() {
        let isDragging = false;
        let startX, startY, initialX, initialY;

        this.container.addEventListener('mousedown', (e) => {
          isDragging = true;
          this.container.style.cursor = 'grabbing';
          // Add hover effect when dragging
          this.container.style.background = 'rgba(220, 220, 220, 0.25)';
          this.container.style.boxShadow = `
            0 12px 40px rgba(255, 255, 255, 0.15),
            0 6px 20px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1)
          `;
          startX = e.clientX;
          startY = e.clientY;
          const rect = this.container.getBoundingClientRect();
          initialX = rect.left;
          initialY = rect.top;
          e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
          if (isDragging) {
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            // Calculate new position
            const newX = initialX + deltaX;
            const newY = initialY + deltaY;
            
            // Constrain position within viewport bounds
            const constrained = this.constrainPosition(newX, newY);
            
            this.container.style.left = constrained.x + 'px';
            this.container.style.top = constrained.y + 'px';
            this.container.style.transform = 'none';
          }

          // Update mouse position for shader
          const rect = this.container.getBoundingClientRect();
          this.mouse.x = (e.clientX - rect.left) / rect.width;
          this.mouse.y = (e.clientY - rect.top) / rect.height;
          
          if (this.mouseUsed) {
            this.updateShader();
          }
        });

        document.addEventListener('mouseup', () => {
          isDragging = false;
          this.container.style.cursor = 'grab';
          // Reset to normal state
          this.container.style.background = 'rgba(200, 200, 200, 0.15)';
          this.container.style.boxShadow = `
            0 8px 32px rgba(255, 255, 255, 0.1),
            0 4px 16px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1)
          `;
        });

        // Add hover effects
        this.container.addEventListener('mouseenter', () => {
          if (!isDragging) {
            this.container.style.background = 'rgba(210, 210, 210, 0.2)';
            this.container.style.boxShadow = `
              0 10px 36px rgba(255, 255, 255, 0.12),
              0 5px 18px rgba(0, 0, 0, 0.12),
              inset 0 1px 0 rgba(255, 255, 255, 0.25),
              inset 0 -1px 0 rgba(0, 0, 0, 0.1)
            `;
          }
        });

        this.container.addEventListener('mouseleave', () => {
          if (!isDragging) {
            this.container.style.background = 'rgba(200, 200, 200, 0.15)';
            this.container.style.boxShadow = `
              0 8px 32px rgba(255, 255, 255, 0.1),
              0 4px 16px rgba(0, 0, 0, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.2),
              inset 0 -1px 0 rgba(0, 0, 0, 0.1)
            `;
          }
        });

        // Handle window resize to maintain constraints
        window.addEventListener('resize', () => {
          const rect = this.container.getBoundingClientRect();
          const constrained = this.constrainPosition(rect.left, rect.top);
          
          if (rect.left !== constrained.x || rect.top !== constrained.y) {
            this.container.style.left = constrained.x + 'px';
            this.container.style.top = constrained.y + 'px';
            this.container.style.transform = 'none';
          }
        });
      }

      updateShader() {
        const mouseProxy = new Proxy(this.mouse, {
          get: (target, prop) => {
            this.mouseUsed = true;
            return target[prop];
          }
        });

        this.mouseUsed = false;

        const w = this.width * this.canvasDPI;
        const h = this.height * this.canvasDPI;
        const data = new Uint8ClampedArray(w * h * 4);

        let maxScale = 0;
        const rawValues = [];

        for (let i = 0; i < data.length; i += 4) {
          const x = (i / 4) % w;
          const y = Math.floor(i / 4 / w);
          const pos = this.fragment(
            { x: x / w, y: y / h },
            mouseProxy
          );
          const dx = pos.x * w - x;
          const dy = pos.y * h - y;
          maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy));
          rawValues.push(dx, dy);
        }

        maxScale *= 0.5;

        let index = 0;
        for (let i = 0; i < data.length; i += 4) {
          const r = rawValues[index++] / maxScale + 0.5;
          const g = rawValues[index++] / maxScale + 0.5;
          data[i] = r * 255;
          data[i + 1] = g * 255;
          data[i + 2] = 0;
          data[i + 3] = 255;
        }

        this.context.putImageData(new ImageData(data, w, h), 0, 0);
        this.feImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.canvas.toDataURL());
        this.feDisplacementMap.setAttribute('scale', (maxScale / this.canvasDPI).toString());
      }

      appendTo(parent) {
        parent.appendChild(this.svg);
        parent.appendChild(this.container);
      }

      destroy() {
        if (this.svg && this.svg.parentNode) {
          this.svg.remove();
        }
        if (this.container && this.container.parentNode) {
          this.container.remove();
        }
        if (this.canvas && this.canvas.parentNode) {
          this.canvas.remove();
        }
      }
    }

    // Create the liquid glass effect
    const shader = new Shader({
      width: 300,
      height: 200,
      fragment: (uv, mouse) => {
        const ix = uv.x - 0.5;
        const iy = uv.y - 0.5;
        const distanceToEdge = roundedRectSDF(
          ix,
          iy,
          0.3,
          0.2,
          0.6
        );
        const displacement = smoothStep(0.8, 0, distanceToEdge - 0.15);
        const scaled = smoothStep(0, 1, displacement);
        return texture(ix * scaled + 0.5, iy * scaled + 0.5);
      }
    });

    // Add to page
    shader.appendTo(document.body);

    console.log('Liquid Glass effect created! Drag the glass around the page.');
    
    // Store reference for cleanup
    shaderRef.current = shader;
    window.liquidGlass = shader;

    // Cleanup function
    return () => {
      if (shaderRef.current) {
        shaderRef.current.destroy();
        shaderRef.current = null;
      }
      if (window.liquidGlass) {
        delete window.liquidGlass;
      }
    };
  }, [isEnabled]);

  const toggleEffect = () => {
    setIsEnabled(!isEnabled);
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 10000,
      pointerEvents: 'auto'
    }}>
      <button
        onClick={toggleEffect}
        style={{
          padding: '10px 20px',
          backgroundColor: isEnabled ? '#6366f1' : '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'scale(1.05)';
          e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        }}
      >
        {isEnabled ? '🔍 Disable Glass' : '🔍 Enable Glass'}
      </button>
    </div>
  );
};

export default LiquidGlass; 