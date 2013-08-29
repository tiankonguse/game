jQuery(function() {
    var SokobanGame = {
	baseWidth : 50,
	gameBoard : "",
	setTitle : function(val) {
	    document.title = val;
	},
	className : {
	    0 : "sokoban-wall-in",
	    1 : "sokoban-wall-out",
	    2 : "sokoban-wall",
	    3 : "sokoban-wall-to",
	    4 : "sokoban-box",
	    5 : "sokoban-person"
	},
	sokobanName : {
	    "sokoban-wall-in" : 0,
	    "sokoban-wall-out" : 1,
	    "sokoban-wall" : 2,
	    "sokoban-wall-to" : 3,
	    "sokoban-box" : 4,
	    "sokoban-person" : 5
	},
	sokobanVal : {
	    0 : 1,
	    1 : 0,
	    2 : 15,
	    3 : 2,
	    4 : 4,
	    5 : 12
	},
	move : function(name, from, to) {
	},
	sokobanMap : null,
	init : function(gameBoard) {
	    var that = this;
	    that.gameBoard = gameBoard;
	    that.createMap(that.lev);
	},
	getClass : function(elem) {
	    return this.className[elem];
	},
	getVal : function(elem) {
	    return this.sokobanVal[elem];
	},
	getLinePos : function(point) {
	    return point.y * this.width + point.x;
	},
	nowJson : "",
	lev : 0,
	width : 0,
	person : null,
	height : 0,
	event : {
	    37 : function(that) {
		that.person.css('background-position', '-150px 0');
		that.movePerson({
		    x : -1
		});
	    },
	    38 : function(that) {
		that.person.css('background-position', '0 0');
		that.movePerson({
		    y : -1
		});
	    },
	    39 : function(that) {
		that.person.css('background-position', '-50px 0');
		that.movePerson({
		    x : 1
		});
	    },
	    40 : function(that) {
		that.person.css('background-position', '-100px 0');
		that.movePerson({
		    y : 1
		});
	    }
	},
	createMap : function(lev) {
	    var that = this;

	    that.lev = lev % that.gk.length;
	    that.gameBoard.empty();
	    that.setTitle('第' + (lev + 1) + '关');
	    that.nowJson = that.gk[lev];
	    that.width = that.nowJson.width;
	    that.height = that.nowJson.height;
	    that.sokobanMap = [];
	    var boardWidth = that.width * that.baseWidth;

	    that.gameBoard.css('margin-left',
		    (jQuery(".container").width() - boardWidth) >> 1);
	    that.gameBoard.css('width', boardWidth);

	    jQuery.each(that.nowJson.map, jQuery.proxy(function(i, elem) {
		if (i && i % that.width == 0) {
		    that.gameBoard.append('<div class="clearfix"></div>');
		}
		that.sokobanMap.push(that.getVal(elem));
		that.gameBoard.append('<div class="' + that.getClass(elem)
			+ '"></div>');
	    }, that));
	    this.createBox();
	    this.createPerson();
	},
	createBox : function() {
	    var that = this;
	    $.each(that.nowJson.box, $.proxy(function(i, elem) {
		var oBox = $('<div class="'
			+ that.getClass(that.sokobanName["sokoban-box"])
			+ '"></div>');
		that.sokobanMap[that.getLinePos(elem)] |= that
			.getVal(that.sokobanName["sokoban-box"]);
		oBox.css('left', elem.x * that.baseWidth);
		oBox.css('top', elem.y * that.baseWidth);
		that.gameBoard.append(oBox);
	    }, that));
	},
	createPerson : function() {
	    var that = this;
	    var person = that.person = $('<div class="'
		    + that.getClass(that.sokobanName["sokoban-person"])
		    + '"></div>');
	    person.point = that.nowJson.person;

	    that.sokobanMap[that.getLinePos(person.point)] |= that
		    .getVal(that.sokobanName["sokoban-person"]);
	    person.css('left', person.point.x * that.baseWidth);
	    person.css('top', person.point.y * that.baseWidth);

	    person.data('x', person.point.x);
	    person.data('y', person.point.y);

	    that.gameBoard.append(person);
	    that.bindPerson();
	},
	bindPerson : function() {
	    var that = this;
	    $(document).keydown($.proxy(function(ev) {
		if (that.event[ev.which]) {
		    that.event[ev.which](that);
		    ev.preventDefault();
		}
	    }, that));
	},
	movePerson : function(opt) {
	    var that = this;
	    var person = that.person;
	    var point = person.point;

	    opt.x || (opt.x = 0);
	    opt.y || (opt.y = 0);

	    var xValue = opt.x || 0;
	    var yValue = opt.y || 0;

	    if (that.sokobanMap[that.getLinePos({
		x : point.x + opt.x,
		y : point.y + opt.y
	    })] != that.getVal(that.sokobanName["sokoban-wall"])) {
		console.log("try");
	    }else{
		console.log("wall");
	    }

	    if (this.nowJson.map[(person.data('y') + yValue) * this.width
		    + (person.data('x') + xValue)] != 2) {

		person.data('x', person.data('x') + xValue);
		person.data('y', person.data('y') + yValue);

		person.css('left', person.data('x') * 50);
		person.css('top', person.data('y') * 50);

		$('.' + this.getClass(4))
			.each(
				$
					.proxy(
						function(i, elem) {

						    if (this
							    .pz(person, $(elem))
							    && this.nowJson.map[(person
								    .data('y') + yValue)
								    * Math
									    .sqrt(this.nowJson.map.length)
								    + (person
									    .data('x') + xValue)] != 2) {

							$(elem)
								.css(
									'left',
									(person
										.data('x') + xValue) * 50);
							$(elem)
								.css(
									'top',
									(person
										.data('y') + yValue) * 50);

							$(
								'.'
									+ this
										.getClass(4))
								.each(
									$
										.proxy(
											function(
												j,
												elem2) {

											    if (this
												    .pz(
													    $(elem),
													    $(elem2))
												    && elem != elem2) {

												$(
													elem)
													.css(
														'left',
														person
															.data('x') * 50);
												$(
													elem)
													.css(
														'top',
														person
															.data('y') * 50);

												person
													.data(
														'x',
														person
															.data('x')
															- xValue);
												person
													.data(
														'y',
														person
															.data('y')
															- yValue);

												person
													.css(
														'left',
														person
															.data('x') * 50);
												person
													.css(
														'top',
														person
															.data('y') * 50);

											    }

											},
											this));

						    } else if (this.pz(person,
							    $(elem))) {

							person.data('x', person
								.data('x')
								- xValue);
							person.data('y', person
								.data('y')
								- yValue);

							person
								.css(
									'left',
									person
										.data('x') * 50);
							person
								.css(
									'top',
									person
										.data('y') * 50);

						    }

						}, this));

	    }

	    this.nextShow();

	},
	nextShow : function() { // 下一关
	    var iNum = 0;
	    $('.' + this.getClass(this.sokobanName["sokoban-box"]))
		    .each(
			    $
				    .proxy(
					    function(i, elem) {

						$(
							'.'
								+ this
									.getClass(this.sokobanName["sokoban-wall-to"]))
							.each(
								$
									.proxy(
										function(
											j,
											elem2) {
										    if (this
											    .pz(
												    $(elem),
												    $(elem2))) {
											iNum++;
										    }
										},
										this));

					    }, this));
	    if (iNum == this.nowJson.box.length) {
		this.createMap(this.lev + 1);
	    }

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
			    2, 0, 0, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3,
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
		} ],
	pz : function(obj1, obj2) { // 碰撞检测
	    var L1 = obj1.offset().left;
	    var R1 = obj1.offset().left + obj1.width();
	    var T1 = obj1.offset().top;
	    var B1 = obj1.offset().top + obj1.height();

	    var L2 = obj2.offset().left;
	    var R2 = obj2.offset().left + obj2.width();
	    var T2 = obj2.offset().top;
	    var B2 = obj2.offset().top + obj2.height();

	    if (R1 <= L2 || L1 >= R2 || T1 >= B2 || B1 <= T2) {
		return false;
	    } else {
		return true;
	    }

	}
    };
    SokobanGame.init($('#game-board'));

});
