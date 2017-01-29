phina.globalize();

// assets定義
var ASSETS = {
  image: {
    'bomb': 'images/bomb.png',
  },
  font: {
    'JKG-M': 'fonts/JKG-M_3.ttf',
  },
  sound: {
    'move': 'sounds/se_maoudamashii_system05.mp3',
    'drop': 'sounds/se_maoudamashii_system10.mp3',
  },
};

// color定義
// TODO: あとでfp.Colorを定義したい
var COLOR_WHITE  = '#ffffff';
var COLOR_BLACK  = '#333333';
var COLOR_GRAY   = '#aaaaaa';
var COLOR_DGRAY  = '#444444';
var COLOR_RED    = '#ff7f7f';
var COLOR_ORANGE = '#ffbf7f';
var COLOR_YELLOW = '#ffff7f';
var COLOR_GREEN  = '#bfff7f';
var COLOR_BLUE   = '#7fbfff';
var COLOR_INDIGO = '#7f7fff';
var COLOR_PURPLE = '#bf7fff';

// メイン処理
var app;
phina.main(function() {
  app = GameApp({
    title: 'poyopoyo',
    assets: ASSETS,
  });

  var locked = true;
  var f = function(e){
    if(locked){
      var s = phina.asset.Sound();
      s.loadFromBuffer();
      s.play();
      s.volume=0;
      s.stop();
      locked=false;
      app.domElement.removeEventListener('touchend', f);
    }
  };
  app.domElement.addEventListener('touchend',f);

  app.replaceScene(fp.MainSequence());
  app.run();
});
