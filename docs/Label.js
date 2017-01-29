// fp.Label
phina.define('fp.Label', {
  superClass: 'Label',
  init: function(text, options) {
  	options = ({}).$safe(options, {
      fontSize:     40,
      fontFamily:   'JKG-M',
      cornerRadius: 10,
      fill:         COLOR_WHITE,
  	});
  	this.superInit(options);
    this.text = text;
    this.alpha = 0;
    this.tweener.clear()
    .to({ alpha: 1 }, 200, "swing");
  },

  moveScore: function(stage, score, callback) {
    this.x = stage.stageGridX.span(stage.currentCol + 1.3);
    this.y = stage.stageGridY.span(stage.currentRow) + 230;
    this.alpha = 1;
    Tweener()
    .to({ y: stage.player.y + 130 }, 700, "easeOutInCubic")
    .attachTo(this);
    Tweener()
    .to({ alpha: 0 }, 700, "easeInQuint")
    .call(function() {
      callback();
    })
    .attachTo(this);
    if( score >= 10000 ) {
      Tweener()
      .to({ rotation: 720 }, 360)
      .attachTo(this);
    } else if( score >= 1000 ) {
      Tweener()
      .to({ rotation: 360 }, 180)
      .attachTo(this);
    }
    this.tweener.clear();
  },
});
