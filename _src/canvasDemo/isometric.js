import NoiseMap from 'noise-map';

const CONTROLS = {
  up: 'w',
  right: 'd',
  down: 's',
  left: 'a',
  rotateRight: 'e',
  rotateLeft: 'q',
  zoomOut: 'x',
  zoomIn: 'z',
};

function cartesianToIsometric(x, y) {
  const newX = x - y;
  const newY = (x + y) >> 1;
  return {
    x: newX,
    y: newY,
  };
}

// function isometricToCartesian(x, y) {
//   const newX = ((y + x) << 1) >> 1;
//   const newY = ((y - x) << 1) >> 1;
//   return {
//     x: newX,
//     y: newY,
//   };
// }

function coordinateToIndex(x, y, width) {
  return (y * (width << 2)) + (x << 2);
}

export default class Heightmap {
  constructor(canvas, width, height) {
    this.viewport = {
      angle: 0,
      scale: 1.25,
      heightScale: 0.25,
      x: 0,
      y: 0,
    };

    this.canvas = canvas;
    this.canvas.width = width;
    this.canvas.height = height;
    this.context2D = this.canvas.getContext('2d');
    this.context2D.imageSmoothingEnabled = false;

    // isometric canvas is twice as wide as map tile
    this.viewport.canvas = document.createElement('canvas');
    this.viewport.canvas.style.imageRendering = 'pixelated';
    this.viewport.canvas.width = width / 2;
    this.viewport.canvas.height = height;
    this.viewport.canvas.centerX = this.viewport.canvas.width / 2;
    this.viewport.canvas.centerY = this.viewport.canvas.height / 2;
    this.viewport.context2D = this.viewport.canvas.getContext('2d');
    this.viewport.context2D.imageSmoothingEnabled = false;

    // Un-comment to view to viewport canvas
    // this.canvas.parentElement.appendChild(this.viewport.canvas);

    this.buffer = this.context2D.createImageData(width, height);
    this.buffer.size = width * height * 4;
    this.buffer.lineHeight = width * 4;

    this.keyboard = {};
    document.addEventListener('keydown', this.keydownHandler.bind(this));
    document.addEventListener('keyup', this.keyupHandler.bind(this));

    this.generator = new NoiseMap.MapGenerator();
    this.noiseMap = this.generator.createMap(400, 200, {
      type: 'simplex',
      amplitude: 1,
      frequency: 0.5,
      amplitudeCoef: 0.5,
      frequencyCoef: 0.5,
      elevation: 0.5,
      step: false,
      stepValue: 30,
    });

    // this.noiseMap.stepValues(30);

    // draw the heights in B&W
    this.noiseMap.draw(
      this.viewport.context2D,
      this.viewport.canvas.width,
      this.viewport.canvas.height,
      NoiseMap.STYLE.GRAY,
    );

    const heightData = this.viewport.context2D.getImageData(
      0, 0, this.viewport.canvas.width, this.viewport.canvas.height,
    );

    // draw the colors
    this.noiseMap.draw(
      this.viewport.context2D,
      this.viewport.canvas.width,
      this.viewport.canvas.height,
      NoiseMap.STYLE.REALISTIC,
      true,
    );

    const colorData = this.viewport.context2D.getImageData(
      0, 0, this.viewport.canvas.width, this.viewport.canvas.height,
    );

    // merge the colorData and heightData with height stored in the aplha
    for (let i = 0; i < heightData.data.length; i += 4) {
      heightData.data[i + 3] = heightData.data[i];
      heightData.data[i + 2] = colorData.data[i + 2];
      heightData.data[i + 1] = colorData.data[i + 1];
      heightData.data[i] = colorData.data[i];
    }

    this.viewport.context2D.putImageData(heightData, 0, 0);

    this.heightmap = new window.Image();
    this.heightmap.src = this.viewport.canvas.toDataURL();

    this.running = true;
    this.updateViewport();
    this.update();
  }

  stop() {
    this.running = false;
    document.removeEventListener('keydown', this.keydownHandler);
    document.removeEventListener('keyup', this.keyupHandler);
  }

  keydownHandler(event) {
    if (!event.repeat) {
      this.keyboard[event.key] = true;
    }
  }

  keyupHandler(event) {
    this.keyboard[event.key] = false;
  }

  // Checks key buffers and moves/scales viewport
  checkKeys() {
    const speed = 2 / this.viewport.scale;
    let xVel = 0;
    let yVel = 0;

    if (this.keyboard[CONTROLS.right]) {
      xVel += speed;
      yVel -= speed;
    }
    if (this.keyboard[CONTROLS.left]) {
      xVel -= speed;
      yVel += speed;
    }
    if (this.keyboard[CONTROLS.down]) {
      xVel += speed;
      yVel += speed;
    }
    if (this.keyboard[CONTROLS.up]) {
      xVel -= speed;
      yVel -= speed;
    }
    if (this.keyboard[CONTROLS.zoomIn]) {
      this.viewport.scale += 0.0025;
      this.viewport.heightScale += 0.0005;
    }
    if (this.keyboard[CONTROLS.zoomOut]) {
      if (this.viewport.scale > 0) {
        this.viewport.scale -= 0.0025;
        this.viewport.heightScale -= 0.0005;
      }
    }
    if (this.keyboard[CONTROLS.rotateLeft]) {
      this.viewport.angle = (this.viewport.angle - 1) % 360;
    }
    if (this.keyboard[CONTROLS.rotateRight]) {
      this.viewport.angle = (this.viewport.angle + 1) % 360;
    }

    this.viewport.angle = (this.viewport.angle - 0.2) % 360;

    this.setViewport(this.viewport.x + xVel, this.viewport.y + yVel);
  }

  setViewport(x, y) {
    // Set viewport position clipped to heightmap dimensions
    if ((x > 0) && (x < this.heightmap.width - this.viewport.canvas.width)) {
      this.viewport.x = x;
    }

    if ((y > 0) && (y < this.heightmap.height - this.viewport.canvas.height)) {
      this.viewport.y = y;
    }

    this.updateViewport();
  }

  updateViewport() {
    this.viewport.context2D.clearRect(
      0, 0, this.viewport.canvas.width, this.viewport.canvas.height,
    );
    this.viewport.context2D.save();
    this.viewport.context2D.translate(this.viewport.canvas.centerX, this.viewport.canvas.centerY);
    this.viewport.context2D.scale(this.viewport.scale, this.viewport.scale);
    this.viewport.context2D.rotate(this.viewport.angle * Math.PI / 180);
    this.viewport.context2D.translate(-this.viewport.canvas.centerX, -this.viewport.canvas.centerY);

    this.viewport.context2D.drawImage(
      this.heightmap,
      this.viewport.x,
      this.viewport.y,
      this.viewport.canvas.width,
      this.viewport.canvas.height,
      0,
      0,
      this.viewport.canvas.width,
      this.viewport.canvas.height,
    );

    this.viewport.map = this.viewport.context2D.getImageData(
      0, 0, this.viewport.canvas.width, this.viewport.canvas.height,
    );

    // Scale heightmap (alpha channel) values to smaller range
    for (let i = 0; i < this.viewport.map.data.length; i += 4) {
      this.viewport.map.data[i + 3] *= this.viewport.heightScale;
    }

    this.viewport.context2D.restore();
  }


  update() {
    // clear buffer
    for (let i = 0; i < this.buffer.data.length; i += 4) {
      this.buffer.data[i] = 0;
      this.buffer.data[i + 1] = 0;
      this.buffer.data[i + 2] = 0;
      this.buffer.data[i + 3] = 0;
    }

    for (let y = this.viewport.map.height - 1; y > 0; y--) {
      for (let x = this.viewport.map.width - 1; x > 0; x--) {
        const mapIndex = coordinateToIndex(x, y, this.viewport.map.width);

        const r = this.viewport.map.data[mapIndex];
        const g = this.viewport.map.data[mapIndex + 1];
        const b = this.viewport.map.data[mapIndex + 2];
        let height = this.viewport.map.data[mapIndex + 3];

        const isoPos = cartesianToIsometric(x, y);
        let bufferIndex = coordinateToIndex(
          isoPos.x - this.viewport.canvas.width,
          isoPos.y - height + this.viewport.canvas.centerY / 4,
          this.buffer.width,
        );
        let fade = 0;

        while (height > 0) {
          // clip to viewport top & bottom
          if (bufferIndex > this.buffer.length || bufferIndex < this.buffer.lineHeight) {
            break;
          }

          // if ((this.buffer.data[bufferIndex] !== 0) &&
          //     (this.buffer.data[bufferIndex + 1] !== 0) &&
          //     (this.buffer.data[bufferIndex + 2] !== 0)) {
          if (this.buffer.data[bufferIndex + 3] !== 0) {
            // stop here, no overdraw
            break;
          }

          this.buffer.data[bufferIndex] = r - fade;
          this.buffer.data[bufferIndex + 1] = g - fade;
          this.buffer.data[bufferIndex + 2] = b - fade;
          this.buffer.data[bufferIndex + 3] = 255 - (fade << 1);

          bufferIndex += this.buffer.lineHeight;
          height--;
          if (fade < 255) {
            fade += 4;
          }
        }
      }
    }

    // Flip buffer to canvas
    this.context2D.putImageData(this.buffer, 0, 0);

    const w16 = this.canvas.width / 16;
    const h9 = this.canvas.height / 9;
    const overlay = {
      x: this.canvas.centerX + w16,
      y: this.canvas.centerY + h9,
      w: w16,
      h: h9,
    };

    this.context2D.drawImage(
      this.heightmap,
      overlay.x,
      overlay.y,
      overlay.w,
      overlay.h,
      0,
      0,
      this.viewport.canvas.width,
      this.viewport.canvas.height,
    );

    this.checkKeys();

    if (this.running) {
      window.requestAnimationFrame(this.update.bind(this));
    }
  }
}
