// fp.StageScene
var ACTION_COUNT = 30;

phina.define('fp.StageScene', {
  superClass: 'fp.CommonScene',
  init: function() {
    this.superInit();

    // StageGridを作成
    this.stageGridX = fp.StageGridX();
    this.stageGridY = fp.StageGridY();

    // StageCellをまとめるGroupを作成
    this.cellGroup = DisplayElement().addChildTo(this);
    this.cellGroup.x = 80;
    this.cellGroup.y = 240;

    // Stageを作成（StageCellを生成）
    this.make();

    // 現在地を設定
    this.currentCol = 4;
    this.currentRow = 4;

    // playerを作成
    this.player = fp.Player().addChildTo(this.cellGroup);
    this.player.x = this.stageGridX.span(this.currentCol);
    this.player.y = this.stageGridY.span(this.currentRow);

    // 説明表示
    var description = fp.Label("十字キー or エンターキーで操作", { fontSize: 30, fill: COLOR_GRAY })
                      .addChildTo(this);
    description.x = this.gridX.center();
    description.y = this.gridY.span(1);

    // 残り回数表示
    var nokori = fp.Label("残り").addChildTo(this);
    nokori.x = this.gridX.span(5);
    nokori.y = this.gridY.span(2.5);
    this.actionCount = 0;
    this.remainCountLabel = fp.Label(ACTION_COUNT.toString(), { fontSize: 88 }).addChildTo(this);
    this.remainCountLabel.x = this.gridX.center();
    this.remainCountLabel.y = this.gridY.span(2.3);
    var kai = fp.Label("回").addChildTo(this);
    kai.x = this.gridX.span(11);
    kai.y = nokori.y;

    // 点数表示
    this.score = 0;
    this.bonusScore = 0;
    this.scoreLabel = fp.Label(this.score.toLocaleString(), { fontSize: 64 }).addChildTo(this);
    this.scoreLabel.x = this.gridX.center();
    this.scoreLabel.y = this.gridY.span(13.8);
    sukoa = fp.Label("SCORE").addChildTo(this);
    sukoa.x = this.gridX.center();
    sukoa.y = this.gridY.span(15);

    // カバーを追加
    this.stageCover = fp.StageCover(this).addChildTo(this);

    // 最終的なスコア
    this.lastScoreLabel = fp.Label("", { fontSize: 80, fill: COLOR_BLACK });
    this.lastScoreLabel.x = this.gridX.center();
    this.lastScoreLabel.y = this.gridY.center();

    // 音
    this.moveSound = AssetManager.get('sound', 'move');
    this.dropSound = AssetManager.get('sound', 'drop');

    this.bombRatio = 0;
    this.animationing = false;
    this.finished = false;
    this.starting = true;
  },

  update: function(app) {
    if( this.getKeyboardEvent(app) || this.getFlickEvent(app) ) {
      this.player.move(this);
      this.action();
    }
  },

  // キーボードイベント
  getKeyboardEvent: function(app) {
    if( this.animationing ) {
      // アニメーション中はキーボード操作無効
      return;
    }

    var k = app.keyboard;
    if( k.getKeyDown('left') ) {
      // 左
      this.ctrlLeft();
    } else if( k.getKeyDown('right') ) {
      // 右
      this.ctrlRight();
    } else if( k.getKeyDown('up') ) {
      // 上
      this.ctrlUp();
    } else if( k.getKeyDown('down') ) {
      // 下
      this.ctrlDown();
    } else if( k.getKeyDown('enter') ) {
      // Enter
      this.ctrlEnter();
      return false;
    } else {
      // そのほかのキーはなにもしない
      return false;
    }
    if( this.finished ) {
      return false;
    }
    return true;
  },

  // フリックイベント
  getFlickEvent: function(app) {
    if( this.starting ) {
      this.starting = false;
      return;
    }
    if( this.animationing ) {
      return false;
    }

    var pointer = app.pointer;
    if( !pointer.getPointingEnd() ) {
      return false;
    }
    var dir = Math.abs(pointer.fx) > Math.abs(pointer.fy); // 左右だったらtrue, 上下だったらfalse
    var d = dir ? pointer.fx : pointer.fy;
    if( d == 0 ) {
      this.ctrlEnter();
      return false;
    } else if( dir ) {
      // 左右
      if( d > 0 ) {
        // 右
        this.ctrlRight();
      } else {
        // 左
        this.ctrlLeft();
      }
    } else {
      // 上下
      if( d > 0 ) {
        // 下
        this.ctrlDown();
      } else {
        // 上
        this.ctrlUp();
      }
    }
    if( this.finished ) {
      return false;
    }
    return true;
  },

  onclick: function() {
    if( this.animationing ) {
      return;
    }
    if( this.finished ) {
      this.ctrlEnter();
    }
  },

  // Enter
  ctrlEnter: function() {
    if( this.finished ) {
      this.exit();
      return;
    }
    this.action();
  },
  // 左
  ctrlLeft: function() {
    this.currentCol -= 1;
    if( this.currentCol < 0 ) {
      this.currentCol = 0;
    }
  },
  // 右
  ctrlRight: function() {
    this.currentCol += 1;
    if( this.currentCol > this.stageGridX.columns ) {
      this.currentCol = this.stageGridX.columns;
    }
  },
  // 上
  ctrlUp: function() {
    this.currentRow -= 1;
    if( this.currentRow < 0 ) {
      this.currentRow = 0;
    }
  },
  // 下
  ctrlDown: function() {
    this.currentRow += 1;
    if( this.currentRow > this.stageGridY.columns ) {
      this.currentRow = this.stageGridY.columns;
    }
  },

  // ステージ作成
  make: function() {
    this.cellArray = new Array;
    this.stageGridX.columns.times(function(spanX) {
      this.cellArray[spanX] = new Array;
      this.stageGridY.columns.times(function(spanY) {
        var cell = fp.StageCell(this, {col: spanX, row: spanY}).addChildTo(this.cellGroup);
        cell.x = this.stageGridX.span(spanX);
        cell.y = this.stageGridY.span(spanY);
        this.cellArray[spanX][spanY] = cell;
      }, this)
    }, this)
  },

  action: function() {
    var count = this.cellArray[this.currentCol][this.currentRow].drop(this.cellArray, true);
    this.scoreAction(count);
    this.playActionSound();
    this.refresh();
    this.resetState();
  },

  playActionSound: function() {
    this.moveSound.play();
    this.tweener.clear()
    .wait(400)
    .call(function() {
      this.dropSound.play();
    }, this);
  },

  // ステージ整頓（新しいStageCellも作成）
  refresh: function() {
    col = 0;
    this.cellArray.each(function(cells) {
      this.animationing = true;
      var droppedCellsNum = 0;
      var nonDroppedCells = new Array;
      cells.each(function(cell) {
        if( cell.dropped ) {
          // 消えるcell
          self = this;
          cell.dropAnimation(function() {
            cell.remove();
          });
          droppedCellsNum ++;
        } else {
          nonDroppedCells.push(cell);
        }
      }, this)

      var row = 0;
      // 消えた分を新しく生成
      droppedCellsNum.times(function(_) {
        var cell = fp.StageCell(this, {col: col, row: row}).addChildTo(this.cellGroup);
        var cellHeight = this.stageGridY.width / this.stageGridY.columns
        cell.x = this.stageGridX.span(col);
        cell.y = this.stageGridY.span(row) - cellHeight * droppedCellsNum;
        cell.alpha = 0;
        cell.moveAnimation(this.stageGridY.span(row), function(stage) {
          stage.animationing = false;
        }, this);

        cells[row] = cell;
        row ++;
      }, this)
      // 下に落ちる
      nonDroppedCells.each(function(newCell) {
        newCell.col = col;
        newCell.row = row;
        newCell.moveAnimation(this.stageGridY.span(row), function(stage) {
          stage.animationing = false;
        }, this);

        cells[row] = newCell;
        row ++;
      }, this)
      col ++;
    }, this)
    // playerを一番上に表示しなおす
    this.player.remove();
    this.player.addChildTo(this.cellGroup);
  },

  // すべてのStageCellを未チェック状態にする
  resetState: function() {
    this.cellArray.each(function(cells) {
      cells.each(function(cell) {
        cell.checked = false;
      });
    });
  },

  // スコア計算
  // ついでに残り回数更新
  scoreAction: function(count) {
    var plus = count * count * count + this.bonusScore;
    this.bonusScore = Math.round(plus * 0.15);
    this.bombRatio = Math.min(plus / 1000, 10);

    // 数字を出す
    if( plus >= 10000 ) {
      var color = COLOR_RED;
    } else if( plus >= 1000 ) {
      color = COLOR_YELLOW;
    } else {
      color = COLOR_WHITE;
    }
    var plusLabel = fp.Label(plus.toLocaleString(), {
      fill: color,
      fontSize: Math.min(30 + Math.pow(plus, 1/3) * 5, 100),
      stroke: COLOR_DGRAY,
      strokeWidth: 8
    }).addChildTo(this);
    plusLabel.moveScore(this, plus, function() {
      plusLabel.remove();
    });
    //this.score += Math.round(Math.exp(count));
    this.score += plus;
    this.scoreLabel.text = this.score.toLocaleString();
    // 残り回数
    this.actionCount ++;
    this.remainCountLabel.text = ACTION_COUNT - this.actionCount;
    if( ACTION_COUNT - this.actionCount <= 5 ) {
      this.remainCountLabel.fill = COLOR_RED;
    }
    // 終了
    if( this.actionCount == ACTION_COUNT ) {
      this.finishAction();
    }
  },

  // 終了処理
  finishAction: function() {
    this.scoreLabel.fill = COLOR_YELLOW;
    this.remainCountLabel.fill = COLOR_WHITE;
    this.stageCover.show(function(stage) {
      stage.lastScoreLabel.text = stage.score.toLocaleString();
      stage.lastScoreLabel.addChildTo(stage);
      stage.lastScoreLabel.alpha = 0;
      stage.lastScoreLabel.tweener.clear()
      .to({ alpha: 1, }, 500, "swing");
    });
    this.finished = true;
  },
});
