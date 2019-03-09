import Ascii from './canvasDemo/ascii';
import Fire from './canvasDemo/fire';
import Game from './platformer/game';
import Heightmap from './canvasDemo/isometric';
import NormalMap from './canvasDemo/normalMap';
import Plasma from './canvasDemo/plasma';
import Static from './canvasDemo/static';

export default function runDemos({ pathname }) {
  switch (pathname) {
    case '/demo/2018/03/27/Platformer.html':
      window.demo = new Game(1000, 1000, document.querySelector('.canvasDemo'),
        { width: 640, height: 480 });
      break;
    case '/demo/2017/10/13/Ascii-Demo.html':
      document.querySelectorAll('.canvasDemo').forEach((canvasDemo) => {
        const fontFamily = canvasDemo.getAttribute('fontfamily');
        const fontSize = parseInt(canvasDemo.getAttribute('fontsize'), 10);
        const image = canvasDemo.getAttribute('image');
        const scale = parseFloat(canvasDemo.getAttribute('scale'));
        const characters = canvasDemo.getAttribute('characters');
        return new Ascii(canvasDemo, image, fontFamily, fontSize, scale, characters);
      });
      break;
    case '/demo/2017/10/18/Fire.html':
      window.demo = new Fire(320, 180);
      break;
    case '/demo/2018/03/26/NormalMapping.html':
      window.demo = new NormalMap(320, 180);
      break;
    case '/demo/2017/10/19/Plasma.html':
      window.demo = new Plasma(320, 180);
      break;
    case '/demo/2017/10/17/Static.html':
      window.demo = new Static(320, 180);
      break;
    case '/demo/2017/10/21/Isometric.html':
      window.demo = new Heightmap(512, 256);
      break;
    default:
      break;
  }
}
