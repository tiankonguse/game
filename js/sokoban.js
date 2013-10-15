jQuery(function() {
    var SokobanGame = {
	baseWidth : 50,
	gameBoard : "",
	setTitle : function(val) {
	    document.title = val;
	},
	sokobanName : {
	    "sokoban-wall-in" : 0,
	    "sokoban-wall-out" : 1,
	    "sokoban-wall" : 2,
	    "sokoban-wall-to" : 3,
	    "sokoban-box" : 4,
	    "sokoban-person" : 5,
	    "sokoban-ok" : 6
	},
	className : {
	    0 : "sokoban-wall-in",
	    1 : "sokoban-wall-out",
	    2 : "sokoban-wall",
	    3 : "sokoban-wall-to",
	    4 : "sokoban-box",
	    5 : "sokoban-person"
	},
	getClass : function(elem) {
	    return this.className[elem];
	},
	sokobanVal : {
	    0 : 1,
	    1 : 0,
	    2 : 15,
	    3 : 2,
	    4 : 4,
	    5 : 12,
	    6 : 6
	},
	getVal : function(elem) {
	    return this.sokobanVal[elem];
	},
	sokobanMap : null,
	getLinePos : function(point) {
	    return point.y * this.width + point.x;
	},
	nowJson : "",
	boxs : null,
	person : null,
	lev : 0,
	width : 0,
	height : 0,
	containerWidth : 0,
	boardWidth : 0,
	length : 0,
	event : {
	    37 : function(that) {
		that.person.css('background-position', '-150px 0');
		that.movePerson({
		    x : -1,
		    y : 0
		});
	    },
	    38 : function(that) {
		that.person.css('background-position', '0 0');
		that.movePerson({
		    x : 0,
		    y : -1
		});
	    },
	    39 : function(that) {
		that.person.css('background-position', '-50px 0');
		that.movePerson({
		    x : 1,
		    y : 0
		});
	    },
	    40 : function(that) {
		that.person.css('background-position', '-100px 0');
		that.movePerson({
		    x : 0,
		    y : 1
		});
	    },
	    53 : function(that) {
		that.createMap(that.lev);
	    }
	},
	init : function(gameBoard, container) {
	    var that = this;

	    that.containerWidth = container.width();
	    that.length = that.gk.length;
	    that.gameBoard = gameBoard;
	    that.createMap(that.lev);
	    that.bindPerson();
	},
	createMap : function(lev) {
	    var that = this;

	    that.lev = lev % that.length;
	    that.gameBoard.empty();
	    that.setTitle('第' + (that.lev + 1) + '关');
	    var nowJson = that.gk[that.lev];
	    that.width = nowJson.width;
	    that.height = nowJson.height;
	    that.sokobanMap = [];
	    that.boardWidth = that.width * that.baseWidth;

	    that.gameBoard.css('margin-left',
		    (that.containerWidth - that.boardWidth) >> 1);
	    that.gameBoard.css('width', that.boardWidth);

	    jQuery.each(nowJson.map, function(i, elem) {
		that.sokobanMap.push(that.getVal(elem));
		that.gameBoard.append('<div class="' + that.getClass(elem)
			+ '"></div>');
	    });
	    this.createBox(nowJson.box);
	    this.createPerson(nowJson.person);
	},
	createBox : function(boxs) {
	    var that = this;
	    that.boxs = [];
	    $.each(boxs, function(i, elem) {
		var box = $('<div class="'
			+ that.getClass(that.sokobanName["sokoban-box"])
			+ '"></div>');
		box.point = {
		    x : elem.x,
		    y : elem.y
		};
//		box.setPoint = function(newPoint){
//		    point.x = newPoint.x;
//		    point.y = newPoint.y;
//		};
//		box.getPoint
		
		that.sokobanMap[that.getLinePos(box.point)] |= that
			.getVal(that.sokobanName["sokoban-box"]);
		box.css('left', box.point.x * that.baseWidth);
		box.css('top', box.point.y * that.baseWidth);
		that.boxs.push(box);
		that.gameBoard.append(box);
	    });
	},
	createPerson : function(person) {
	    var that = this;
	    that.person = $('<div class="'
		    + that.getClass(that.sokobanName["sokoban-person"])
		    + '"></div>');
	    that.person.point = {
		x : person.x,
		y : person.y
	    };

	    that.sokobanMap[that.getLinePos(that.person.point)] |= that
		    .getVal(that.sokobanName["sokoban-person"]);
	    that.person.css('left', that.person.point.x * that.baseWidth);
	    that.person.css('top', that.person.point.y * that.baseWidth);

	    that.gameBoard.append(that.person);
	},
	lock : false,
	bindPerson : function() {
	    var that = this;
	    $(document).keydown(function(ev) {
		if (!that.lock) {
		    that.lock = true;
		    if (that.event[ev.which]) {
			that.event[ev.which](that);
			ev.preventDefault();
		    }
		    that.lock = false;
		}
	    });
	},
	back : function(point, opt) {
	    point.x -= opt.x;
	    point.y -= opt.y;
	    return point;
	},
	run : function(point, opt) {
	    point.x += opt.x;
	    point.y += opt.y;
	    return point;
	},
	getBox : function(point) {
	    var that = this;
	    var i, boxNum;
	    var boxs = that.boxs;
	    boxNum = boxs.length;
	    for (i = 0; i < boxNum; i++) {
		if (boxs[i].point.x == point.x && boxs[i].point.y == point.y) {
		    return boxs[i];
		}
	    }
	    return null;
	},
	move : function(obj, opt, objVal) {
	    var that = this;
	    var nowPos = that.getLinePos(obj.point);
	    var nextPos = that.getLinePos(that.run(obj.point, opt));
	    that.sokobanMap[nowPos] ^= objVal;
	    that.sokobanMap[nextPos] ^= objVal;
	    obj.css('left', obj.point.x * that.baseWidth);
	    obj.css('top', obj.point.y * that.baseWidth);
	},
	movePerson : function(opt) {
	    var that = this;
	    var person = that.person;

	    var wallVal = that.getVal(that.sokobanName["sokoban-wall"]);
	    var boxVal = that.getVal(that.sokobanName["sokoban-box"]);
	    var personVal = that.getVal(that.sokobanName["sokoban-person"]);

	    var nowPoint = person.point;
	    var nowPos = that.getLinePos(nowPoint);

	    var nextPoint = {
		x : nowPoint.x + opt.x,
		y : nowPoint.y + opt.y
	    };
	    var nextVal = that.sokobanMap[that.getLinePos(nextPoint)];

	    if (nextVal != wallVal) {
		if ((nextVal & personVal) == 0) {
		    that.move(person, opt, personVal);
		} else {

		    var nextTwoVal = that.sokobanMap[that.getLinePos({
			x : nowPoint.x + opt.x * 2,
			y : nowPoint.y + opt.y * 2
		    })];

		    if ((nextTwoVal & boxVal) == 0) {
			var box = that.getBox(nextPoint);
			that.move(box, opt, boxVal);
			that.move(person, opt, personVal);
			console.log("try");
			this.nextShow();
		    } else {
			console.log("wall or box");
		    }
		}

	    } else {
		console.log("wall");
	    }
	    return;
	},
	nextShow : function() { // 下一关
	    var that = this;
	    var i, boxNum, pos;
	    var boxs = that.boxs;
	    var ok = that.getVal(that.sokobanName["sokoban-ok"]);
	    boxNum = boxs.length;
	    for (i = 0; i < boxNum; i++) {
		pos = that.getLinePos(boxs[i].point);
		if (that.sokobanMap[pos] != ok) {
		    return;
		}

	    }
	    this.createMap(this.lev + 1);
	},
	gk : [ // 关卡的数据
		{
		    map : [ 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 2, 3, 3, 2, 1, 1, 1,
			    2, 2, 0, 3, 2, 2, 1, 1, 2, 0, 0, 0, 3, 2, 1, 2, 2,
			    0, 0, 0, 0, 2, 2, 2, 0, 0, 2, 0, 0, 0, 2, 2, 0, 0,
			    0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2 ],
		    box : [ {
			x : 4,
			y : 3
		    }, {
			x : 3,
			y : 4
		    }, {
			x : 4,
			y : 5
		    }, {
			x : 5,
			y : 5
		    } ],
		    person : {
			x : 3,
			y : 6
		    },
		    width : 8,
		    height : 8

		},
		{
		    map : [ 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2,
			    0, 0, 2, 0, 0, 2, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0,
			    2, 1, 2, 2, 2, 2, 2, 0, 0, 2, 0, 0, 2, 1, 3, 3, 3,
			    2, 2, 2, 0, 2, 0, 0, 2, 2, 3, 0, 0, 2, 0, 0, 0, 0,
			    2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3,
			    0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 2, 3, 3, 3, 2, 2, 2,
			    0, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2,
			    1, 1, 1, 1, 1, 2, 0, 0, 2, 0, 0, 2, 1, 1, 1, 1, 1,
			    2, 2, 2, 2, 2, 2, 2, 1 ],
		    box : [ {
			x : 5,
			y : 6
		    }, {
			x : 6,
			y : 3
		    }, {
			x : 6,
			y : 5
		    }, {
			x : 6,
			y : 7
		    }, {
			x : 6,
			y : 9
		    }, {
			x : 7,
			y : 2
		    }, {
			x : 8,
			y : 2
		    }, {
			x : 9,
			y : 6
		    }, ],
		    person : {
			x : 5,
			y : 9
		    },
		    width : 12,
		    height : 12
		} ]
    };
    SokobanGame.init($('#game-board'), jQuery(".container"));

});
