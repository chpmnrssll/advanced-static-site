import * as Matter from 'matter-js';

// create 4 rectangles just outside the width & height
function createBounds(width, height, thickness) {
  const halfW = width / 2;
  const halfH = height / 2;
  const halfT = thickness / 2;
  const doubleW = width * 2;
  const doubleH = height * 2;

  return [
    Matter.Bodies.rectangle(
      halfW, -halfT,
      doubleW, thickness, {
        render: {
          fillStyle: '#224466',
        },
        isStatic: true,
      },
    ),
    Matter.Bodies.rectangle(
      width + halfT, halfH,
      thickness, doubleH, {
        render: {
          fillStyle: '#224466',
        },
        isStatic: true,
      },
    ),
    Matter.Bodies.rectangle(
      halfW, height + halfT,
      doubleW, thickness, {
        render: {
          fillStyle: '#224466',
        },
        isStatic: true,
      },
    ),
    Matter.Bodies.rectangle(
      -halfT, halfH,
      thickness, doubleH, {
        render: {
          fillStyle: '#224466',
        },
        isStatic: true,
      },
    ),
  ];
}

// ie: Donkey Kong
function createPlatforms() {
  return [
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
}


const logos = [];
let lastShape = {};

function randomRectLogo(x, y, scale) {
  const rectangles = [
    {
      type: 'rectangle',
      density: 0.7,
      width: 55,
      height: 64,
      xScale: 0.25,
      yScale: 0.25,
      url: '/advanced-static-site/assets/images/logo/logoGrunt.png',
    },
    {
      type: 'rectangle',
      density: 0.8,
      width: 29,
      height: 64,
      xScale: 0.25,
      yScale: 0.25,
      url: '/advanced-static-site/assets/images/logo/logoGulp.png',
    },
    {
      type: 'rectangle',
      density: 0.8,
      width: 38,
      height: 64,
      xScale: 0.25,
      yScale: 0.25,
      url: '/advanced-static-site/assets/images/logo/logoHTML5.png',
    },
    {
      type: 'rectangle',
      density: 0.4,
      width: 50,
      height: 50,
      xScale: 0.25,
      yScale: 0.25,
      url: '/advanced-static-site/assets/images/logo/logoJavascript.png',
    },
    {
      type: 'rectangle',
      density: 0.5,
      width: 60,
      height: 22,
      xScale: 0.25,
      yScale: 0.25,
      url: '/advanced-static-site/assets/images/logo/logoJekyll.png',
    },
    {
      type: 'rectangle',
      density: 0.6,
      width: 50,
      height: 52,
      xScale: 0.25,
      yScale: 0.25,
      url: '/advanced-static-site/assets/images/logo/logoMarionette.png',
    },
    {
      type: 'rectangle',
      density: 0.7,
      width: 64,
      height: 18,
      xScale: 0.25,
      yScale: 0.25,
      url: '/advanced-static-site/assets/images/logo/logoMongoDB.png',
    },
    {
      type: 'rectangle',
      density: 0.8,
      width: 62,
      height: 32,
      xScale: 0.25,
      yScale: 0.25,
      url: '/advanced-static-site/assets/images/logo/logoMySQL.png',
    },
    {
      type: 'rectangle',
      density: 0.6,
      width: 52,
      height: 32,
      xScale: 0.25,
      yScale: 0.25,
      url: '/advanced-static-site/assets/images/logo/logoNodeJS.png',
    },
    {
      type: 'rectangle',
      density: 0.8,
      width: 60,
      height: 21,
      xScale: 0.25,
      yScale: 0.25,
      url: '/advanced-static-site/assets/images/logo/logoNpm.png',
    },
    {
      type: 'rectangle',
      density: 0.7,
      width: 60,
      height: 32,
      xScale: 0.25,
      yScale: 0.25,
      url: '/advanced-static-site/assets/images/logo/logoPHP.png',
    },
    {
      type: 'rectangle',
      density: 0.7,
      width: 49,
      height: 62,
      xScale: 0.25,
      yScale: 0.25,
      url: '/advanced-static-site/assets/images/logo/logoRubyOnRails.png',
    },
    {
      type: 'rectangle',
      density: 0.6,
      width: 62,
      height: 48,
      xScale: 0.25,
      yScale: 0.25,
      url: '/advanced-static-site/assets/images/logo/logoSass.png',
    },
  ];

  let shape = rectangles[parseInt(Matter.Common.random(0, rectangles.length), 10)];
  while (shape === lastShape) {
    shape = rectangles[parseInt(Matter.Common.random(0, rectangles.length), 10)];
  }
  lastShape = shape;

  return Matter.Bodies.rectangle(x, y, shape.width * scale, shape.height * scale, {
    density: shape.density * scale,
    friction: 0.5,
    render: {
      sprite: {
        texture: shape.url,
        xScale: shape.xScale * scale,
        yScale: shape.yScale * scale,
      },
    },
  });
}

function randomCircleLogo(x, y, scale) {
  const circles = [
    {
      type: 'circle',
      density: 0.025,
      radius: 30,
      xScale: 0.25,
      yScale: 0.25,
      url: '/advanced-static-site/assets/images/logo/logoAMP.png',
    },
    {
      type: 'circle',
      density: 0.05,
      radius: 30,
      xScale: 0.25,
      yScale: 0.25,
      url: '/advanced-static-site/assets/images/logo/logoAtom.png',
    },
    {
      type: 'circle',
      density: 0.015,
      radius: 31,
      xScale: 0.25,
      yScale: 0.25,
      url: '/advanced-static-site/assets/images/logo/logoBower.png',
    },
    {
      type: 'circle',
      density: 0.05,
      radius: 29,
      xScale: 0.25,
      yScale: 0.25,
      url: '/advanced-static-site/assets/images/logo/logoChrome.png',
    },
    {
      type: 'circle',
      density: 0.015,
      radius: 24,
      xScale: 0.25,
      yScale: 0.25,
      url: '/advanced-static-site/assets/images/logo/logoWordpress.png',
    },
    {
      type: 'circle',
      density: 0.05,
      radius: 28,
      xScale: 0.25,
      yScale: 0.25,
      url: '/advanced-static-site/assets/images/logo/logoYeoman.png',
    },
  ];

  let shape = circles[parseInt(Matter.Common.random(0, circles.length), 10)];
  while (shape === lastShape) {
    shape = circles[parseInt(Matter.Common.random(0, circles.length), 10)];
  }
  lastShape = shape;

  return Matter.Bodies.circle(x, y, shape.radius * scale, {
    density: shape.density * scale,
    friction: 0.5,
    render: {
      sprite: {
        texture: shape.url,
        xScale: shape.xScale * scale,
        yScale: shape.yScale * scale,
      },
    },
  });
}

function randomLogo(x, y) {
  if (lastShape.type === 'circle') {
    const scale = Matter.Common.random(0.5, 1.5);
    return randomRectLogo(x, y, scale);
  }

  const scale = Matter.Common.random(0.5, 1.5);
  return randomCircleLogo(x, y, scale);
}

function spawnLogos(world) {
  const positions = [
    { x: 750, y: 600 },
    { x: 600, y: 256 },
    { x: 60, y: 127 },
    { x: 600, y: 96 },
  ];

  if (logos.length < 20) {
    const randomPosition = parseInt(Math.random() * positions.length, 10);
    const logo = randomLogo(positions[randomPosition].x, positions[randomPosition].y);
    const r = Math.random() - 0.5;
    logos.push(logo);
    Matter.World.add(world, logo);
    Matter.Body.applyForce(logo, logo.position, {
      x: r * 2,
      y: 0.05,
    });
    Matter.Body.setAngularVelocity(logo, r * 2);
  } else {
    Matter.World.remove(world, logos.shift());
  }

  setTimeout(spawnLogos, 1000, world);
}

export default function startLevel(world) {
  Matter.World.add(world, createBounds(1000, 1000, 1000));
  Matter.World.add(world, createPlatforms());
  spawnLogos(world);
}
