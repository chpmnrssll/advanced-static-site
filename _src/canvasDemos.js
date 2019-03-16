// const baseurl = 'https://chpmnrssll.github.io/advanced-static-site/';
const baseurl = '/advanced-static-site';

export default function runDemos({ pathname }) {
  switch (pathname) {
    case `${baseurl}/demo/2018/03/27/Platformer.html`:
      import(/* webpackChunkName: "Game" */ './platformer/game')
        .then(({ default: Game }) => {
          window.demo = new Game(
            1000,
            1000,
            document.querySelector('.canvasDemo'),
            { width: 640, height: 480 },
          );
        });
      break;
    case `${baseurl}/demo/2017/10/13/Ascii-Demo.html`:
      import(/* webpackChunkName: "Ascii" */ './canvasDemo/ascii')
        .then(({ default: Ascii }) => {
          document.querySelectorAll('.canvasDemo').forEach((canvasDemo) => {
            const fontFamily = canvasDemo.getAttribute('fontfamily');
            const fontSize = parseInt(canvasDemo.getAttribute('fontsize'), 10);
            const image = canvasDemo.getAttribute('image');
            const scale = parseFloat(canvasDemo.getAttribute('scale'));
            const characters = canvasDemo.getAttribute('characters');
            return new Ascii(canvasDemo, image, fontFamily, fontSize, scale, characters);
          });
        }).catch(() => 'An error occurred while loading the component');
      break;
    case `${baseurl}/demo/2017/10/18/Fire.html`:
      import(/* webpackChunkName: "Fire" */ './canvasDemo/fire')
        .then(({ default: Fire }) => {
          window.demo = new Fire(320, 180);
        });
      break;
    case `${baseurl}/demo/2018/03/26/NormalMapping.html`:
      import(/* webpackChunkName: "NormalMap" */ './canvasDemo/normalMap')
        .then(({ default: NormalMap }) => {
          window.demo = new NormalMap(320, 180);
        });
      break;
    case `${baseurl}/demo/2017/10/19/Plasma.html`:
      import(/* webpackChunkName: "Plasma" */ './canvasDemo/plasma')
        .then(({ default: Plasma }) => {
          window.demo = new Plasma(320, 180);
        });
      break;
    case `${baseurl}/demo/2017/10/17/Static.html`:
      import(/* webpackChunkName: "Static" */ './canvasDemo/static')
        .then(({ default: Static }) => {
          window.demo = new Static(320, 180);
        });
      break;
    case `${baseurl}/demo/2017/10/21/Isometric.html`:
      import(/* webpackChunkName: "Heightmap" */ './canvasDemo/isometric')
        .then(({ default: Heightmap }) => {
          window.demo = new Heightmap(512, 256);
        });
      break;
    default:
      break;
  }
}
