// fp.MainSequence
phina.define('fp.MainSequence', {
  superClass: 'ManagerScene',
  init: function() {
    this.superInit({
      scenes: [
      {
        label:     'title',
        className: 'fp.TitleScene',
      },
      {
        label:     'stage',
        className: 'fp.StageScene',
        nextLabel: 'stage',
      },
      ]
    });
  },
});