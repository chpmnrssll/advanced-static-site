import * as Matter from 'matter-js';

export default function controls(keys, player, viewport) {
  if (keys.w && keys.w !== 'holding') {
    if (!player.onFloor) {
      if (player.onRight) {
        // walljump onRight
        Matter.Body.applyForce(
          player.composite,
          player.composite.position, {
            x: -(0.015 * player.composite.mass),
            y: -(0.045 * player.composite.mass),
          },
        );
        keys.w = false;
      } else if (player.onLeft) {
        // walljump onLeft
        Matter.Body.applyForce(
          player.composite,
          player.composite.position, {
            x: (0.015 * player.composite.mass),
            y: -(0.045 * player.composite.mass),
          },
        );
        keys.w = false;
      }
    } else if (player.onRight) {
      // wallrun onRight
      Matter.Body.applyForce(
        player.composite,
        player.composite.position, {
          x: 0,
          y: -(0.04 * player.composite.mass),
        },
      );
      keys.w = false;
    } else if (player.onLeft) {
      // wallrun onLeft
      Matter.Body.applyForce(
        player.composite,
        player.composite.position, {
          x: 0,
          y: -(0.04 * player.composite.mass),
        },
      );
      keys.w = false;
    } else {
      // jump
      Matter.Body.applyForce(
        player.composite,
        player.composite.position, {
          x: 0,
          y: -(0.05 * player.composite.mass),
        },
      );
      keys.w = false;
    }
  }

  if (keys.s && !player.onFloor) {
    // ground pound
    Matter.Body.applyForce(
      player.composite,
      player.composite.position, {
        x: 0,
        y: (0.005 * player.composite.mass),
      },
    );
  }

  if (keys.a) {
    // move left
    Matter.Body.applyForce(
      player.composite,
      player.composite.position, {
        x: -(0.001 * player.composite.mass),
        y: -(0.0005 * player.composite.mass),
      },
    );
  }

  if (keys.d) {
    // move right
    Matter.Body.applyForce(
      player.composite,
      player.composite.position, {
        x: (0.001 * player.composite.mass),
        y: -(0.0005 * player.composite.mass),
      },
    );
  }

  if (keys['+']) {
    viewport.scale -= 0.01;
  }

  if (keys['-']) {
    viewport.scale += 0.01;
  }
}
