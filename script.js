class Canvas {

	constructor(canvas) {

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
		}

		this.canvas.addEventListener('mousedown', e => {
			this.figures.forEach(item => {
				if (this.pointInFigure(this.cursor.x, this.cursor.y, item.x, item.y)) {
					this.pressed = item;
				}
			})
		});

		this.canvas.addEventListener('mousemove', e => {
			this.cursor.x = e.pageX - this.canvas.getBoundingClientRect().left,
				this.cursor.y = e.pageY - this.canvas.getBoundingClientRect().top;
		})

		this.canvas.addEventListener('mouseup', () => {

			this.figures.forEach(item => item.fill = false);

			const figuresLength = this.figures.length;
			for (let i = 0; i < figuresLength; i++) {
				for (let j = i + 1; j < figuresLength; j++) {
					if (this.isIntersect(this.figures[i], this.figures[j]) ||
						this.isIntersect(this.figures[j], this.figures[i])) {
						this.figures[i].fill = this.figures[j].fill = true
					}
				}
			}

			this.pressed = null;
			this.cursor.offsetX = this.cursor.offsetY = null

		})

		this.pointInFigure = function(x, y, xp, yp) {

			const npol = xp.length;
			let j = npol - 1,
				c = 0;
			for (let i = 0; i < npol; i++) {
				if ((((yp[i] <= y) && (y < yp[j])) || ((yp[j] <= y) && (y < yp[i]))) &&
					(x > (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i])) {
					c = !c
				}
				j = i
			}
			return c
		}

		this.isIntersect = function(subject, clip) {

			const subjectPolygon = [],
				clipPolygon = [];
			for (let i = 0; i < subject.x.length; i++) {
				subjectPolygon.push([subject.x[i], subject.y[i]])
			}
			for (let i = 0; i < clip.x.length; i++) {
				clipPolygon.push([clip.x[i], clip.y[i]])
			}

			var cp1, cp2, s, e;
			var inside = function(p) {
				return (cp2[0] - cp1[0]) * (p[1] - cp1[1]) > (cp2[1] - cp1[1]) * (p[0] - cp1[0])
			};
			var intersection = function() {
				var dc = [cp1[0] - cp2[0], cp1[1] - cp2[1]],
					dp = [s[0] - e[0], s[1] - e[1]],
					n1 = cp1[0] * cp2[1] - cp1[1] * cp2[0],
					n2 = s[0] * e[1] - s[1] * e[0],
					n3 = 1.0 / (dc[0] * dp[1] - dc[1] * dp[0]);
				return [(n1 * dp[0] - n2 * dc[0]) * n3, (n1 * dp[1] - n2 * dc[1]) * n3]
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
							outputList.push(intersection())
						}
						outputList.push(e)
					} else if (inside(s)) {
						outputList.push(intersection());
					}
					s = e
				}
				cp1 = cp2
			}
			return Boolean(outputList.length)
		}

		this.drawFigures = function() {

			this.figures.forEach(item => {

				this.context.beginPath();
				this.context.moveTo(item.x[0], item.y[0]);

				const points = item.x.length;
				for (let i = 1; i < points; i++) {
					this.context.lineTo(item.x[i], item.y[i])
				}

				this.context.closePath();
				this.context.stroke();
				if (item.fill) this.context.fill()

			})

		}

	}

	start() {

		setInterval(() => {

			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.drawFigures();

			if (this.pressed) {

				if (!this.cursor.offsetX || !this.cursor.offsetY) {
					this.cursor.offsetX = this.cursor.x - this.pressed.x[0];
					this.cursor.offsetY = this.cursor.y - this.pressed.y[0]
				}

				const points = this.pressed.x.length;
				for (let i = 0; i < points; i++) {
					this.pressed.x[i] = this.cursor.x + this.pressed.byX1[i] - this.cursor.offsetX;
					this.pressed.y[i] = this.cursor.y + this.pressed.byY1[i] - this.cursor.offsetY;
				}

			}

		}, 1000 / this.fps);

	}

	addFigure() {

		const argumentsLength = arguments.length;

		let figure = {
			x: [],
			y: [],
			byX1: [],
			byY1: [],
			fill: false
		};

		if (!argumentsLength) return;
		if (argumentsLength % 2) {
			alert('Необходимо чётное число аргументов addFigure(x1, y1, x2, y2 ...)');
			return
		}

		const startX = this.maxX + this.spaceBetweenFigures,
			startY = this.maxY + this.spaceBetweenFigures;

		for (let i = 0; i < argumentsLength; i += 2) {
			const x = startX + arguments[i],
				y = startY + arguments[i + 1];

			// if(x > this.maxX) this.maxX = x;
			if (y > this.maxY) this.maxY = y;

			figure.x.push(x);
			figure.y.push(y);
			figure.byX1.push(x - startX);
			figure.byY1.push(y - startY)
		}

		this.figures.push(figure);

	}

}

const canvas = new Canvas(document.querySelector('canvas'));

canvas.addFigure(0, 0, 200, 10, 200, 55, 100, 100);
canvas.addFigure(0, 0, 140, 0, 10, 100, 50, 30);
canvas.addFigure(0, 0, 200, 75, 105, 140);
canvas.addFigure(0, 0, 120, 0, 120, 100, 0, 100);

canvas.start()