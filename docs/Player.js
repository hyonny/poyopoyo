// fp.Player
phina.define('fp.Player', {
  superClass: 'RectangleShape',
  init: function(options) {
  	options = ({}).$safe(options, {
      width:        50,
      height:       50,
      fill:         null,
      stroke:       COLOR_WHITE,
      cornerRadius: 14,
  	});
  	this.superInit(options);
  },

  move: function(stage) {
    this.tweener.clear()
    .to({
      x: stage.stageGridX.span(stage.currentCol),
      y: stage.stageGridY.span(stage.currentRow),
    }, 50, "swing");
  },
});
