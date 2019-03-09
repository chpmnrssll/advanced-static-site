import 'pathseg';
import 'poly-decomp';
import * as Matter from 'matter-js';
import Keyboard from './Keyboard';
import Player from './Player';
import Viewport from './Viewport';
import startLevel from './dummyLevel';
import controls from './controls';

export default class Game {
  constructor(width, height, canvas, resolution) {
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
    this.canvas = canvas;
    this.context2D = this.canvas.getContext('2d');
    this.context2D.imageSmoothingEnabled = false;

    this.viewport = new Viewport(
      parseInt(this.canvas.clientWidth / 2, 10),
      parseInt(this.canvas.clientHeight / 2, 10),
    );

    // create renderer
    this.render = Matter.Render.create({
      canvas: this.canvas,
      engine: this.engine,
      options: {
        background: '#112244',
        width: resolution.width,
        height: resolution.height,
        showAngleIndicator: false,
        wireframes: false,
      },
    });

    Matter.Render.run(this.render);
    this.runner = Matter.Runner.create();
    Matter.Runner.run(this.runner, this.engine);

    startLevel(this.world);

    // window.fetch('/assets/images/level.svg')
    //   .then(response => response.text())
    //   .then(data => {
    //     let parser = new window.DOMParser()
    //     let doc = parser.parseFromString(data, 'image/svg+xml')
    //     let paths = doc.querySelectorAll('path')
    //     let vertexSets = []
    //     let color = Matter.Common.choose(['#556270', '#4ECDC4', '#C7F464', '#FF6B6B', '#C44D58'])
    //     paths.forEach(path => {
    //       vertexSets.push(Matter.Svg.pathToVertices(path, 10))
    //     })
    //     let level = Matter.Bodies.fromVertices(0, 0, vertexSets, {
    //       isStatic: true,
    //       render: {
    //         fillStyle: color,
    //         strokeStyle: color,
    //         lineWidth: 1
    //       }
    //     }, true)
    //     // Matter.Body.scale(level, 10, 10)
    //     // Matter.Body.translate(level, { x: 50, y: 200 })
    //     Matter.World.add(this.world, level)
    //
    //     Matter.Engine.run(this.engine)
    //   })

    this.keyboard = new Keyboard();

    this.render.mouse = Matter.Mouse.create(this.render.canvas);
    Matter.World.add(this.world, Matter.MouseConstraint.create(this.engine, {
      mouse: this.render.mouse,
      constraint: {
        stiffness: 0.001,
        render: {
          visible: true,
        },
      },
    }));

    window.addEventListener('resize', this.resizeViewport.bind(this));
    Matter.Events.on(this.render, 'beforeRender', this.beforeRender.bind(this));
    Matter.Engine.run(this.engine);

    this.player = new Player(this.engine, 25, 850);
  }

  stop() {
    Matter.Events.off(this.render, 'beforeRender', this.beforeRender);
    Matter.Runner.stop(this.runner);
    this.keyboard.stop();
    this.player.stop();
  }

  resizeViewport() {
    this.viewport.width = parseInt(this.canvas.clientWidth / 2, 10);
    this.viewport.height = parseInt(this.canvas.clientHeight / 2, 10);
  }

  beforeRender() {
    if (!this.player) return;
    this.viewport.x = this.player.composite.position.x;
    this.viewport.y = this.player.composite.position.y;
    const scaledWidth = this.viewport.width * this.viewport.scale;
    const scaledHeight = this.viewport.height * this.viewport.scale;

    Matter.Render.lookAt(this.render, {
      min: {
        x: this.viewport.x - scaledWidth,
        y: this.viewport.y - scaledHeight,
      },
      max: {
        x: this.viewport.x + scaledWidth,
        y: this.viewport.y + scaledHeight,
      },
    });

    // limit rotation on the player
    // const step = 0.5;
    // if (this.player.composite.angle > 1) {
    //   Matter.Body.setAngle(this.player.composite, this.player.composite.angle - step);
    // } else if (this.player.composite.angle < -1) {
    //   Matter.Body.setAngle(this.player.composite, this.player.composite.angle + step);
    // }

    Matter.Body.setAngle(this.player.composite, this.player.composite.angle * 0.8);
    // match player rotation to composite
    Matter.Body.setAngle(this.player.body, this.player.composite.angle);

    controls(this.keyboard.keys, this.player, this.viewport);
  }
}
