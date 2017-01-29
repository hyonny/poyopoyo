// fp.TitleScene
phina.define('fp.TitleScene', {
  superClass: 'fp.CommonScene',
  init: function() {
    this.superInit();

    this.label = fp.Label('PRESS ENTER').addChildTo(this);
    this.label.x = this.gridX.center();
    this.label.y = this.gridY.center();

    this.alphaD = 0.05;
  },

  update: function(app) {
    if( this.getKeyboardEvent(app) ) {
      // noop
    }

    this.label.alpha += this.alphaD;
    if( this.label.alpha >= 1 ) {
      this.label.alpha = 1;
      this.alphaD = -0.05;
    } else if( this.label.alpha <= 0.5 ) {
      this.label.alpha = 0.5;
      this.alphaD = 0.05;
    }
  },

  getKeyboardEvent: function(app) {
    var k = app.keyboard;

    // enterで開始
    if( k.getKeyDown('enter') ) {
      this.finish();
    } else {
      return false;
    }
    return true;
  },

  onclick: function() {
    this.finish();
  },

  finish: function() {
    this.exit();
  }
});