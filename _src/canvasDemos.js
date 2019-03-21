// const baseurl = 'https://chpmnrssll.github.io/advanced-static-site';
// const baseurl = '';

export default function runDemos() {
  const canvasDemos = document.querySelectorAll('.canvasDemo');

  canvasDemos.forEach((canvasDemo) => {
    switch (canvasDemo.getAttribute('demo')) {
      case 'Platformer':
      import(/* webpackChunkName: "Game" */ './platformer/game')
        .then(({ default: Game }) => {
          const baseurl = canvasDemo.getAttribute('baseurl');
          window.demo = new Game(1000, 1000, canvasDemo, { width: 640, height: 480 }, baseurl);
        });
        break;
      case 'Ascii':
      import(/* webpackChunkName: "Ascii" */ './canvasDemo/ascii')
        .then(({ default: Ascii }) => {
          const fontFamily = canvasDemo.getAttribute('fontfamily');
          const fontSize = parseInt(canvasDemo.getAttribute('fontsize'), 10);
          const scale = parseFloat(canvasDemo.getAttribute('scale'));
          const characters = canvasDemo.getAttribute('characters');
          const image = canvasDemo.getAttribute('image');
          return new Ascii(canvasDemo, image, fontFamily, fontSize, scale, characters);
        });
        break;
      case 'Fire':
      import(/* webpackChunkName: "Fire" */ './canvasDemo/fire')
        .then(({ default: Fire }) => {
          window.demo = new Fire(canvasDemo, 320, 180);
        });
        break;
      case 'NormalMapping':
      import(/* webpackChunkName: "NormalMap" */ './canvasDemo/normalMap')
        .then(({ default: NormalMap }) => {
          const image = canvasDemo.getAttribute('image');
          const normalMap = canvasDemo.getAttribute('normal-map');
          window.demo = new NormalMap(canvasDemo, 320, 180, image, normalMap);
        });
        break;
      case 'Plasma':
      import(/* webpackChunkName: "Plasma" */ './canvasDemo/plasma')
        .then(({ default: Plasma }) => {
          window.demo = new Plasma(canvasDemo, 320, 180);
        });
        break;
      case 'Static':
      import(/* webpackChunkName: "Static" */ './canvasDemo/static')
        .then(({ default: Static }) => {
          window.demo = new Static(canvasDemo, 320, 180);
        });
        break;
      case 'Isometric':
      import(/* webpackChunkName: "Heightmap" */ './canvasDemo/isometric')
        .then(({ default: Heightmap }) => {
          const heightMap = canvasDemo.getAttribute('height-map');
          window.demo = new Heightmap(canvasDemo, 512, 256, heightMap);
        });
        break;
      default:
        break;
    }
  });
}
