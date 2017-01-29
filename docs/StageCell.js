// fp.StageCell
var CELL_COLORS = [
  COLOR_RED,    // 赤
  COLOR_ORANGE, // 橙
  //COLOR_YELLOW, // 黄
  COLOR_GREEN,  // 緑
  COLOR_BLUE,   // 青
  //COLOR_INDIGO, // 藍
  //COLOR_PURPLE, // 紫
];
var DROP_COLOR = COLOR_GRAY;
var DROP_DURATION = 200;
var MOVE_DURATION = 400;

phina.define('fp.StageCell', {
  superClass: 'DisplayElement',
  init: function(stage, options) {
  	this.superInit();

  	this.col = options.col;
  	this.row = options.row;
  	this.color = CELL_COLORS.pickup();

  	this.stage = stage;
  	this.bomb = false;
  	this.bombColors = [];

  	if( Random.randint(0, 100) < this.stage.bombRatio ) {
  		var bombImage = Sprite('bomb');
  		bombImage.width = 44;
  		bombImage.height = 44;
  		this.color = COLOR_WHITE;
  		this.bomb = true;
  	}

  	options = ({}).$safe(options, {
      width:        40,
      height:       40,
      cornerRadius: 10,
      fill:         this.color,
      stroke:       null,
  	});
  	this.rectangleShape = RectangleShape(options).addChildTo(this);
  	if( this.bomb ) {
  		bombImage.addChildTo(this);
  	}
  	this.checked = false;
  	this.dropped = false;
  	this.alpha = 0;

  	this.tweener.clear()
  	.to({ alpha: 1 }, 200, "swing");
  },

  setColor: function(color) {
  	this.color = color;
  },

  drop: function(cells, first=false) {
  	if( this.checked ) {
  		return;
  	}
  	this.cells = cells;
  	this.checked = true; // チェック済みにする
  	this.dropCount = 1;

  	// 爆弾
  	this.bombColors = [];
  	if( this.bomb ) {
  		this.arroundColors();
  	}

  	// 上
  	this.checkDrop(this.col, this.row-1);
  	// 下
  	this.checkDrop(this.col, this.row+1);
  	// 左
  	this.checkDrop(this.col-1, this.row);
  	// 右
  	this.checkDrop(this.col+1, this.row);

  	if( first ) {
	  	this.cells.each(function(cells) {
	  		cells.each(function(cell) {
		  		if( this.bombColors.contains(cell.color) ) {
		  			this.dropCount += cell.drop(this.cells);
		  		}
	  		}, this);
	  	}, this);
	  	this.bombColors = [];
  	}

  	this.color = DROP_COLOR;
  	this.dropped = true;
  	this.fill = this.color;

  	return this.dropCount;
  },

  checkDrop: function(col, row) {
  	if( col < 0 || col >= this.cells.length ) {
  		return;
  	} else if( row < 0 || row >= this.cells[col].length ) {
  		return;
  	} else if( col == this.col && row == this.row ) {
  		return;
  	} else if( this.cells[col][row].bomb ) { // 爆弾
  		if(  this.cells[col][row].checked ) {
  			return; // チェック済みだったらスキップ
  		}
  		this.bombColors.push(this.cells[col][row].bombColors);
  		this.bombColors = this.bombColors.flatten().uniq();
  		this.dropCount += this.cells[col][row].drop(this.cells);
  	} else if( this.cells[col][row].color == this.color ) {
  		if(  this.cells[col][row].checked ) {
  			return; // チェック済みだったらスキップ
  		}
  		this.dropCount += this.cells[col][row].drop(this.cells);
  	}
  },

  // 周囲の色
  arroundColors: function() {
  	Array.range(this.col-1, this.col+1).each(function(c) {
  		Array.range(this.row-1, this.row+1).each(function(r) {
  			if( c == this.col && r == this.row ) {
  				// noop
  			} else if( c < 0 || c >= this.cells.length ) {
  				// noop
  			} else if( r < 0 || r >= this.cells[c].length ) {
  				// noop
  			} else {
	  			this.bombColors.push(this.cells[c][r].color);
	  		}
  		}, this);
  	}, this);
  	this.bombColors = this.bombColors.flatten().uniq();
  	this.bombColors.eraseIf(function(color) {
  		return color == COLOR_WHITE;
  	});
  	return this.bombColors;
  },

  // 消える
  dropAnimation: function(callback) {
  	this.tweener.clear()
  	.to({
  		alpha: 0
  	}, DROP_DURATION)
  	.call(function() {
    	callback();
    })
  },

  // 詰める
  moveAnimation: function(_y, callback, arg) {
  	cell = this;
  	this.tweener.clear()
  	.wait(DROP_DURATION + Random.randint(0, 100))
  	.to({
  		y: _y,
  		alpha: 1
  	}, MOVE_DURATION, "easeOutBounce")
  	.call(function() {
  		if( callback != null ) {
  			callback(arg);
  		}
  	})
  },
});
