// fp.StageCover
phina.define('fp.StageCover', {
  superClass: 'RectangleShape',
  init: function(stage, options) {
    this.stage = stage;
  	options = ({}).$safe(options, {
      width:  this.stage.width,
      height: this.stage.height,
      fill:   COLOR_WHITE,
      stroke: null,
  	});
  	this.superInit(options);
    this.x = this.stage.gridX.center();
    this.y = - this.stage.gridY.center();
    this.alpha = 0;
  },

  show: function(callback) {
    stage = this.stage;
    this.tweener.clear()
    .wait(300)
    .to({
      y: this.stage.gridY.center(),
      alpha: 0.8,
    }, 500, "easeOutBounce")
    .call(function() {
      callback(stage);
    });
  },
});
