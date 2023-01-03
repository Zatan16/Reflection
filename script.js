const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const source = vector(50, 50);
const mirrors = [mirror(vector(300, 300), 0, 100, 1)];
const newStraightMirror = document.getElementById("new-straight-mirror");

canvas.width = window.innerWidth-50;
canvas.height = window.innerHeight-50;

document.body.insertBefore(canvas, null);

newStraightMirror.addEventListener("click", e => {
	mirrors.push(mirror(vector(300, 300), 0, 100, mirrors.length+1));
});

function mirror(position, angle, length, index, inverted) {
	return new class Mirror {
		constructor() {
			this.position = position;
			this.angle = angle;
			this.length = length;
			this.inverted = !!inverted;

			let attributes = document.getElementById("attributes");
			attributes.innerHTML += `
				Mirror${index} X: <input type="text" value="50" class="mirror ${index} x-display" style="width:50;"> <input type="range" class="mirror ${index} x" value="50">
				&nbsp;Mirror${index} Y: <input type="text" value="50" class="mirror ${index} y-display" style="width:50;"> <input type="range" class="mirror ${index} y" value="50">
				&nbsp;Mirror${index} Angle: <input type="text" value="0" class="mirror ${index} angle-display" style="width:50;"> <input type="range" class="mirror ${index} angle" value="0"> <br>`;
		}
	}
}

function vector(x, y) {
	return new class Vector {
		constructor() {
			this.moveTo(x, y);
		}

		moveTo(x, y) {
			this.x = x;
			this.y = y;
		}
	}
}

function loop(cb) {
	requestAnimationFrame(() => {
		setInterval(() => {
			cb();
			loop(cb);
		}, 1000/30);
	});
}

function draw() {
	drawSource();
	drawMirrors();
}

function drawSource() {
	ctx.beginPath();
	ctx.fillStyle = "black";
	ctx.arc(source.x, source.y, 3, 0, 2*Math.PI);
	ctx.fill();
	ctx.closePath();
}

function drawMirrors() {
	for(let i = 0; i < mirrors.length; i++) {
		let mirror = mirrors[i];
		ctx.beginPath();
		ctx.strokeWidth = 5;
		ctx.moveTo(mirror.position.x, mirror.position.y);
		ctx.lineTo(parseInt(mirror.position.x)+mirror.length*Math.cos(mirror.angle*Math.PI/180), parseInt(mirror.position.y)-mirror.length*Math.sin(mirror.angle*Math.PI/180));
		ctx.stroke();
		ctx.closePath();
	}
}

function update() {
	let elementX = [...document.getElementsByTagName("input")].filter(v => v.classList.contains("x"));
	let elementY = [...document.getElementsByTagName("input")].filter(v => v.classList.contains("y"));
	let elementAngle = [...document.getElementsByTagName("input")].filter(v => v.classList.contains("angle"));
	elementX.forEach(v => {v.min = 0; v.max = canvas.width; v.style.width = 200});
	elementY.forEach(v => {v.min = 0; v.max = canvas.height; v.style.width = 200});
	elementAngle.forEach(v => {v.min = 0; v.max = 360});
	updateSource();
	updateMirrors();
}

function updateSource() {
	let element = document.getElementsByClassName("source");
	source.moveTo(element[1].value, element[3].value);
}

function updateMirrors() {
	for(let i = 0; i < mirrors.length; i++) {
		let mirror = mirrors[i];
		let elements = [...document.getElementsByClassName("mirror")];
		mirror.position.x = parseInt(elements.filter(v => v.classList.contains("x"))[i].value);
		mirror.position.y = parseInt(elements.filter(v => v.classList.contains("y"))[i].value);
		mirror.angle = parseInt(elements.filter(v => v.classList.contains("angle"))[i].value);
	}
}

loop(() => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	update();
	draw();
});

function distance(vector1, vector2) {
	return Math.sqrt((vector1.x-vector2.x)**2+(vector1.y-vector2.y)**2);
}

[...document.getElementsByTagName("input")].filter(v => v.type === "text").filter(v => v.classList.contains("x-display") || v.classList.contains("y-display") || v.classList.contains("angle-display")).forEach((v, i) => {
	v.addEventListener("change", e => {
		if(v.classList.contains()) {
			[...document.getElementsByTagName("input")].filter(v => v.type === "range")[i].value = v.value;
		}
	});
});

[...document.getElementsByTagName("input")].filter(v => v.type === "range").filter(v => v.classList.contains("x") || v.classList.contains("y") || v.classList.contains("angle")).forEach((v, i) => {
	v.addEventListener("change", e => {
		[...document.getElementsByTagName("input")].filter(v => v.type === "text")[i].value = v.value;
	});
});
