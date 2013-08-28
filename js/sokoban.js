jQuery(function() {
    var SokobanGame = {
	baseWidth : 50,
	gameBoard : "",
	setTitle : function(val) {
	    document.title = val;
	},
	map : {
	    0 : "sokoban-wall-in",
	    1 : "sokoban-wall-out",
	    2 : "sokoban-wall",
	    3 : "sokoban-wall-to",
	    4 : "sokoban-box",
	    5 : "sokoban-person"
	},
	_map : {
	    "sokoban-wall-in" : 0,
	    "sokoban-wall-out" : 1,
	    "sokoban-wall" : 2,
	    "sokoban-wall-to" : 3,
	    "sokoban-box" : 4,
	    "sokoban-person" : 5
	},

	init : function(gameBoard) {
	    this.gameBoard = gameBoard;
	    this.createMap(0);
	    this.createBox();
	    this.createPerson();
	},

	getClass : function(elem) {
	    return this.map[elem];
	},

	nowJson : "",

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
		that.person.css('background-position', '100px 0');
		that.movePerson({
		    y : 1
		});
	    }
	},
	createMap : function(lev) {

	    this.gameBoard.empty();
	    this.setTitle('第' + (lev + 1) + '关');
	    this.nowJson = this.gk[lev];
	    this.width = this.nowJson.width;
	    this.height = this.nowJson.height;
	    var width = this.width * this.baseWidth;

	    this.gameBoard.css('margin-left',
		    (jQuery(".container").width() - width) >> 1);
	    this.gameBoard.css('width', width);

	    jQuery.each(this.nowJson.map, jQuery.proxy(function(i, elem) {
		if (i && i % this.width == 0) {
		    this.gameBoard.append('<div class="clearfix"></div>');
		}
		this.gameBoard.append('<div class="' + this.getClass(elem)
			+ '"></div>');
	    }, this));
	},
	createBox : function() {
	    $.each(this.nowJson.box, $.proxy(
		    function(i, elem) {
			var oBox = $('<div class="'
				+ this.getClass(this._map["sokoban-box"])
				+ '"></div>');
			oBox.css('left', elem.x * this.baseWidth);
			oBox.css('top', elem.y * this.baseWidth);
			this.gameBoard.append(oBox);
		    }, this));

	},
	createPerson : function() {

	    var person = $('<div class="'
		    + this.getClass(this._map["sokoban-person"]) + '"></div>');
	    
	    person.css('left', this.nowJson.person.x * this.baseWidth);
	    person.css('top', this.nowJson.person.y * this.baseWidth);

	    person.data('x', this.nowJson.person.x);
	    person.data('y', this.nowJson.person.y);

	    this.gameBoard.append(person);
	    this.person = person;
	    this.bindPerson();
	    
	    
	},
	bindPerson : function() {
	    $(document).keydown($.proxy(function(ev) {
		if(this.event[ev.which]){
		    this.event[ev.which](this);
		    ev.preventDefault();
		}
	    }, this));

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

	movePerson : function(opt) {
	    var person = this.person ;
	    var xValue = opt.x || 0;
	    var yValue = opt.y || 0;

	    if (this.nowJson.map[(person.data('y') + yValue)
		    * Math.sqrt(this.nowJson.map.length)
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

	    $('.' + this.getClass(4)).each($.proxy(function(i, elem) {

		$('.' + this.getClass(3)).each($.proxy(function(j, elem2) {

		    if (this.pz($(elem), $(elem2))) {
			iNum++;
		    }

		}, this));

	    }, this));
	    if (iNum == this.nowJson.box.length) {
		this.createMap(1);
	    }

	},
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
