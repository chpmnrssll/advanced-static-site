import * as Matter from 'matter-js';
import { circles, rectangles } from './dummyAssets';

export default class DummyLevel {
  constructor(world, baseurl = '') {
    this.world = world;
    this.baseurl = baseurl;
    this.logos = [];
    this.lastShape = {};
    this.createBounds(1000, 1000, 1000);
    this.createPlatforms();
    setInterval(this.spawnLogos.bind(this), 1000);
  }

  // create 4 rectangles just outside the width & height
  createBounds(width, height, thickness) {
    const halfW = width / 2;
    const halfH = height / 2;
    const halfT = thickness / 2;
    const doubleW = width * 2;
    const doubleH = height * 2;

    const options = {
      render: {
        fillStyle: '#224466',
      },
      isStatic: true,
    };

    const bounds = [
      Matter.Bodies.rectangle(halfW, -halfT, doubleW, thickness, options),
      Matter.Bodies.rectangle(width + halfT, halfH, thickness, doubleH, options),
      Matter.Bodies.rectangle(halfW, height + halfT, doubleW, thickness, options),
      Matter.Bodies.rectangle(-halfT, halfH, thickness, doubleH, options),
    ];

    Matter.World.add(this.world, bounds);
  }

  // ie: Donkey Kong
  createPlatforms() {
    const platforms = [
      Matter.Bodies.rectangle(
        1000 / 3, 1000 / 5,
        900, 50, {
          isStatic: true,
          angle: 0.075,
          render: {
            fillStyle: '#224466',
          },
        },
      ),
      Matter.Bodies.rectangle(
        1000 / 1.5, 1000 / 2,
        900, 50, {
          isStatic: true,
          angle: -0.075,
          render: {
            fillStyle: '#224466',
          },
        },
      ),
      Matter.Bodies.rectangle(
        1000 / 3, 1000 / 1.25,
        900, 50, {
          isStatic: true,
          angle: 0.075,
          render: {
            fillStyle: '#224466',
          },
        },
      ),
    ];

    Matter.World.add(this.world, platforms);
  }

  spawnLogos() {
    const positions = [
      { x: 750, y: 600 },
      { x: 600, y: 256 },
      { x: 60, y: 127 },
      { x: 600, y: 96 },
    ];

    if (this.logos.length < 20) {
      const randomPosition = parseInt(Math.random() * positions.length, 10);
      const logo = this.randomLogo(positions[randomPosition].x, positions[randomPosition].y);
      const randomForce = Math.random() - 0.5;
      const randomStrength = Math.random() * 2;
      this.logos.push(logo);
      Matter.World.add(this.world, logo);
      Matter.Body.applyForce(logo, logo.position, {
        x: randomForce * randomStrength,
        y: 0.05,
      });
      Matter.Body.setAngularVelocity(logo, randomForce * randomStrength);
    } else {
      Matter.World.remove(this.world, this.logos.shift());
    }
  }

  randomLogo(x, y) {
    if (this.lastShape.type === 'circle') {
      const scale = Matter.Common.random(0.5, 1.5);
      const logo = this.randomRectLogo(x, y, scale);
      return logo;
    }

    const scale = Matter.Common.random(0.5, 1.5);
    const logo = this.randomCircleLogo(x, y, scale);
    return logo;
  }

  randomRectLogo(x, y, scale) {
    let randomIndex = parseInt(Matter.Common.random(0, rectangles.length), 10);
    let shape = rectangles[randomIndex];
    while (shape === this.lastShape) {
      randomIndex = parseInt(Matter.Common.random(0, rectangles.length), 10);
      shape = rectangles[randomIndex];
    }
    this.lastShape = shape;

    return Matter.Bodies.rectangle(x, y, shape.width * scale, shape.height * scale, {
      density: shape.density * scale,
      friction: 0.5,
      render: {
        strokeStyle: '#fc4',
        wireframe: true,
        sprite: {
          texture: `${this.baseurl}${shape.url}`,
          xScale: shape.xScale * scale,
          yScale: shape.yScale * scale,
          xOffset: 0,
          yOffset: 0,
        },
      },
    });
  }

  randomCircleLogo(x, y, scale) {
    let randomIndex = parseInt(Matter.Common.random(0, circles.length), 10);
    let shape = circles[randomIndex];
    while (shape === this.lastShape) {
      randomIndex = parseInt(Matter.Common.random(0, circles.length), 10);
      shape = circles[randomIndex];
    }
    this.lastShape = shape;

    return Matter.Bodies.circle(x, y, shape.radius * scale, {
      density: shape.density * scale,
      friction: 0.5,
      render: {
        sprite: {
          texture: `${this.baseurl}${shape.url}`,
          xScale: shape.xScale * scale,
          yScale: shape.yScale * scale,
          xOffset: 0,
          yOffset: 0,
        },
      },
    });
  }
}
