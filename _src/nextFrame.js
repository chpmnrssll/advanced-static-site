/* Returns a promise that will resolve on the next AnimationFrame */
export default function nextFrame() {
  return new Promise((resolve) => {
    window.requestAnimationFrame(resolve);
  });
}

/* Applies `fn` to each element of `collection`, iterating once per frame */
export function mapInFrames(collection, fn) {
  let queue = Promise.resolve();
  const values = [];
  collection.forEach((item) => {
    queue = queue.then(() => nextFrame().then(() => values.push(fn(item))));
  });

  return queue.then(() => values);
}
