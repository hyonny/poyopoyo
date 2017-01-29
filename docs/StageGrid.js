// fp.StageGrid
phina.define('fp.StageGridX', {
  superClass: 'Grid',
  init: function(options) {
    options = ({}).$safe(options, {
      width:   540,
      columns: 9,
      loop:    false,
      offset:  0,
    });
    this.superInit(options);
  },
});
phina.define('fp.StageGridY', {
  superClass: 'fp.StageGridX',
  init: function(options) {
    this.superInit(options);
  },
});