import 'pathseg';
import * as Matter from 'matter-js';
// import { SVGPathDataParser } from 'svg-pathdata';
import { circles, rectangles } from './dummyAssets';

export default class SVGLevel {
  constructor(world, baseurl = '') {
    this.world = world;
    this.baseurl = baseurl;
    this.logos = [];
    this.lastShape = {};

    window.fetch(`${baseurl}/assets/images/level.svg`)
      .then(response => response.text())
      .then((data) => {
        const parser = new window.DOMParser();
        const doc = parser.parseFromString(data, 'image/svg+xml');
        const rects = doc.querySelectorAll('rect');
        // const paths = doc.querySelectorAll('path');
        // const svg = doc.querySelector('svg');
        // const svgWidth = parseInt(svg.getAttribute('width'), 10);
        // const svgHeight = parseInt(svg.getAttribute('height'), 10);

        const levelObjs = [];
        // const svgParser = new SVGPathDataParser();
        const colors = ['#1122ee', '#22ee11', '#ee1122'];

        rects.forEach((rect, index) => {
          const color = colors[index % colors.length];
          const x = rect.getAttribute('x');
          const y = rect.getAttribute('y');
          const width = rect.getAttribute('width');
          const height = rect.getAttribute('height');
          const options = {
            isStatic: true,
            render: {
              fillStyle: color,
            },
          };
          const body = Matter.Bodies.rectangle(x, y, width, height, options);
          // console.log(x, y, width, height);
          levelObjs.push(body);
        });
        // paths.forEach((path, index) => {
        //   // const color = Matter.Common.choose(colors);
        //   const color = colors[index % colors.length];
        //
        //   // const d = path.getAttribute('d');
        //   // const pathCommands = svgParser.parse(d);
        //   // const objX = pathCommands[0].x;
        //   // const objY = pathCommands[0].y;
        //   const vertices = Matter.Svg.pathToVertices(path, 10);
        //
        //   // Matter.Vertices.scale(vertices, 8, 8);
        //   const body = Matter.Bodies.fromVertices(
        //     vertices[0].x,
        //     vertices[0].y,
        //     vertices,
        //     {
        //       isStatic: true,
        //       render: {
        //         fillStyle: color,
        //         // strokeStyle: color,
        //         // lineWidth: 1,
        //       },
        //     },
        //     true,
        //   );
        //   // console.log(pathCommands);
        //   // console.log(vertices);
        //   // console.log(objX, objY);
        //   // console.log(body);
        //   const { min, max } = body.bounds;
        //   const hw = (max.x - min.x) / 2;
        //   const hh = (max.y - min.y) / 2;
        //   Matter.Body.translate(body, { x: hw, y: hh });
        //   // Matter.Body.scale(body, 2, 2);
        //   levelObjs.push(body);
        // });

        Matter.World.add(this.world, levelObjs);
        // setInterval(this.spawnLogos.bind(this), 500);
      });
  }

  spawnLogos() {
    const positions = [
      { x: 2000, y: 1500 },
      { x: 50, y: 1200 },
      { x: 2000, y: 500 },
      { x: 50, y: 200 },
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
      const scale = Matter.Common.random(0.75, 3);
      const logo = this.randomRectLogo(x, y, scale);
      return logo;
    }

    const scale = Matter.Common.random(0.75, 3);
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
