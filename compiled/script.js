"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Canvas =
/*#__PURE__*/
function () {
  function Canvas(canvas) {
    var _this = this;

    _classCallCheck(this, Canvas);

    this.canvas = canvas;
    this.canvas.width = document.documentElement.clientWidth - 50;
    this.canvas.height = document.documentElement.clientHeight - 50;
    this.context = canvas.getContext('2d');
    this.context.fillStyle = 'red';
    this.figures = [];
    this.pressed = null;
    this.maxX = 0;
    this.maxY = 0;
    this.spaceBetweenFigures = 10;
    this.fps = 60;
    this.cursor = {
      x: 0,
      y: 0,
      offsetX: null,
      offsetY: null
    };
    this.canvas.addEventListener('mousedown', function (e) {
      _this.figures.forEach(function (item) {
        if (_this.pointInFigure(_this.cursor.x, _this.cursor.y, item.x, item.y)) {
          _this.pressed = item;
        }
      });
    });
    this.canvas.addEventListener('mousemove', function (e) {
      _this.cursor.x = e.pageX - _this.canvas.getBoundingClientRect().left, _this.cursor.y = e.pageY - _this.canvas.getBoundingClientRect().top;
    });
    this.canvas.addEventListener('mouseup', function () {
      _this.figures.forEach(function (item) {
        return item.fill = false;
      });

      var figuresLength = _this.figures.length;

      for (var i = 0; i < figuresLength; i++) {
        for (var j = i + 1; j < figuresLength; j++) {
          if (_this.isIntersect(_this.figures[i], _this.figures[j])) {
            _this.figures[i].fill = _this.figures[j].fill = true;
          }
        }
      }

      _this.pressed = null;
      _this.cursor.offsetX = _this.cursor.offsetY = null;
    });

    this.pointInFigure = function (x, y, xp, yp) {
      var npol = xp.length;
      var j = npol - 1,
          c = 0;

      for (var i = 0; i < npol; i++) {
        if ((yp[i] <= y && y < yp[j] || yp[j] <= y && y < yp[i]) && x > (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i]) {
          c = !c;
        }

        j = i;
      }

      return c;
    };

    this.isIntersect = function (subject, clip) {
      var subjectPolygon = [],
          clipPolygon = [];

      for (var _i = 0; _i < subject.x.length; _i++) {
        subjectPolygon.push([subject.x[_i], subject.y[_i]]);
      }

      for (var _i2 = 0; _i2 < clip.x.length; _i2++) {
        clipPolygon.push([clip.x[_i2], clip.y[_i2]]);
      }

      var cp1, cp2, s, e;

      var inside = function inside(p) {
        return (cp2[0] - cp1[0]) * (p[1] - cp1[1]) > (cp2[1] - cp1[1]) * (p[0] - cp1[0]);
      };

      var intersection = function intersection() {
        var dc = [cp1[0] - cp2[0], cp1[1] - cp2[1]],
            dp = [s[0] - e[0], s[1] - e[1]],
            n1 = cp1[0] * cp2[1] - cp1[1] * cp2[0],
            n2 = s[0] * e[1] - s[1] * e[0],
            n3 = 1.0 / (dc[0] * dp[1] - dc[1] * dp[0]);
        return [(n1 * dp[0] - n2 * dc[0]) * n3, (n1 * dp[1] - n2 * dc[1]) * n3];
      };

      var outputList = subjectPolygon;
      cp1 = clipPolygon[clipPolygon.length - 1];

      for (var j in clipPolygon) {
        var cp2 = clipPolygon[j];
        var inputList = outputList;
        outputList = [];
        s = inputList[inputList.length - 1];

        for (var i in inputList) {
          var e = inputList[i];

          if (inside(e)) {
            if (!inside(s)) {
              outputList.push(intersection());
            }

            outputList.push(e);
          } else if (inside(s)) {
            outputList.push(intersection());
          }

          s = e;
        }

        cp1 = cp2;
      }

      return Boolean(outputList.length);
    };

    this.drawFigures = function () {
      var _this2 = this;

      this.figures.forEach(function (item) {
        _this2.context.beginPath();

        _this2.context.moveTo(item.x[0], item.y[0]);

        var points = item.x.length;

        for (var i = 1; i < points; i++) {
          _this2.context.lineTo(item.x[i], item.y[i]);
        }

        _this2.context.closePath();

        _this2.context.stroke();

        if (item.fill) _this2.context.fill();
      });
    };
  }

  _createClass(Canvas, [{
    key: "start",
    value: function start() {
      var _this3 = this;

      setInterval(function () {
        _this3.context.clearRect(0, 0, _this3.canvas.width, _this3.canvas.height);

        _this3.drawFigures();

        if (_this3.pressed) {
          if (!_this3.cursor.offsetX || !_this3.cursor.offsetY) {
            _this3.cursor.offsetX = _this3.cursor.x - _this3.pressed.x[0];
            _this3.cursor.offsetY = _this3.cursor.y - _this3.pressed.y[0];
          }

          var points = _this3.pressed.x.length;

          for (var i = 0; i < points; i++) {
            _this3.pressed.x[i] = _this3.cursor.x + _this3.pressed.byX1[i] - _this3.cursor.offsetX;
            _this3.pressed.y[i] = _this3.cursor.y + _this3.pressed.byY1[i] - _this3.cursor.offsetY;
          }
        }
      }, 1000 / this.fps);
    }
  }, {
    key: "addFigure",
    value: function addFigure() {
      var argumentsLength = arguments.length;
      var figure = {
        x: [],
        y: [],
        byX1: [],
        byY1: [],
        fill: false
      };
      if (!argumentsLength) return;

      if (argumentsLength % 2) {
        alert('Необходимо чётное число аргументов addFigure(x1, y1, x2, y2 ...)');
        return;
      }

      var startX = this.maxX + this.spaceBetweenFigures,
          startY = this.maxY + this.spaceBetweenFigures;

      for (var i = 0; i < argumentsLength; i += 2) {
        var x = startX + arguments[i],
            y = startY + arguments[i + 1]; // if(x > this.maxX) this.maxX = x;

        if (y > this.maxY) this.maxY = y;
        figure.x.push(x);
        figure.y.push(y);
        figure.byX1.push(x - startX);
        figure.byY1.push(y - startY);
      }

      this.figures.push(figure);
    }
  }]);

  return Canvas;
}();

var canvas = new Canvas(document.querySelector('canvas'));
canvas.addFigure(0, 0, 200, 10, 200, 55, 100, 100);
canvas.addFigure(0, 0, 140, 0, 10, 100, 50, 30);
canvas.addFigure(0, 0, 200, 75, 105, 140);
canvas.addFigure(0, 0, 120, 0, 120, 100, 0, 100);
canvas.start();