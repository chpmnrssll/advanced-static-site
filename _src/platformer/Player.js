import * as Matter from 'matter-js';

export default class Player {
  constructor(engine, x, y, baseurl = '') {
    this.engine = engine;
    const width = 40;
    const height = 64;
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const sensorWidth = 4;
    const sensorLength = 0.65;

    this.sensors = {
      top: Matter.Bodies.rectangle(
        x, y - halfHeight - sensorWidth,
        width * sensorLength, sensorWidth,
        {
          isSensor: true,
          render: {
            visible: false,
          },
        },
      ),
      right: Matter.Bodies.rectangle(
        x + halfWidth + sensorWidth, y,
        sensorWidth, height * sensorLength,
        {
          isSensor: true,
          render: {
            visible: false,
          },
        },
      ),
      bottom: Matter.Bodies.rectangle(
        x, y + halfHeight + sensorWidth,
        width * sensorLength, sensorWidth,
        {
          density: 1.5,
          isSensor: true,
          render: {
            visible: false,
          },
        },
      ),
      left: Matter.Bodies.rectangle(
        x - halfWidth - sensorWidth, y,
        sensorWidth, height * sensorLength,
        {
          isSensor: true,
          render: {
            visible: false,
          },
        },
      ),
    };

    this.mass = Matter.Bodies.rectangle(x, y, width, height, {
      density: 1.0,
      render: {
        visible: false,
      },
    });

    this.body = Matter.Bodies.rectangle(x, y, width, height, {
      density: 1.0,
      render: {
        sprite: {
          texture: `${baseurl}/assets/images/sprite.png`,
          xOffset: 0,
          yOffset: 0,
        },
      },
    });

    // join body parts into one
    this.composite = Matter.Body.create({
      // density: 1.0,
      friction: 0.25,
      frictionStatic: 0.25,
      parts: [
        this.mass,
        this.body,
        this.sensors.top,
        this.sensors.right,
        this.sensors.bottom,
        this.sensors.left,
      ],
      restitution: 0.5,
    });

    Matter.Events.on(this.engine, 'collisionEnd', this.collisionEnd.bind(this));
    Matter.Events.on(this.engine, 'collisionActive', this.collisionActive.bind(this));
    Matter.World.add(this.engine.world, this.composite);
    return this;
  }

  stop() {
    Matter.Events.off(this.engine, 'collisionEnd', this.collisionEnd);
    Matter.Events.off(this.engine, 'collisionActive', this.collisionActive);
  }

  collisionEnd({ pairs }) {
    for (let i = 0, j = pairs.length; i !== j; ++i) {
      const pair = pairs[i];

      if (pair.bodyA === this.sensors.bottom
        || pair.bodyB === this.sensors.bottom) {
        this.onFloor = false;
      } else if (pair.bodyA === this.sensors.right
        || pair.bodyB === this.sensors.right) {
        this.onRight = false;
      } else if (pair.bodyA === this.sensors.left
        || pair.bodyB === this.sensors.left) {
        this.onLeft = false;
      }
    }
  }

  collisionActive({ pairs }) {
    for (let i = 0, j = pairs.length; i !== j; ++i) {
      const pair = pairs[i];

      if (pair.bodyA === this.sensors.bottom
        || pair.bodyB === this.sensors.bottom) {
        this.onFloor = true;
      } else if (pair.bodyA === this.sensors.right
        || pair.bodyB === this.sensors.right) {
        this.onRight = true;
      } else if (pair.bodyA === this.sensors.left
        || pair.bodyB === this.sensors.left) {
        this.onLeft = true;
      }
    }
    // console.log(this.onLeft, this.onFloor, this.onRight)
  }
}
