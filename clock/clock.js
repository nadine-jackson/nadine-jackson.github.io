function setup() {
	angleMode(DEGREES);
	rectMode(CENTER);
	createCanvas(windowWidth, windowHeight);
	background(0);
	resetpoint = 0;
}
function findx(m){
	return abs(m % 2000 - 1000) / 1000;
}
function findy(m){
	let x = (m % 2000 - 1000) / 1000;
	if (x >= 0){
		return 1.5 * x * x + -1 * x;
	}
	x = abs(x);
	return 1.5 * x * x + -2 * x + 1;
}
function makeSquare(x, y, n){
	push();
	let special = false;
	if (t_m >= (n + 1) * 5){
		fill(50);
	}
	else if (t_m >= n * 5){
		special = true;
		if (t_s == 59 && t_m % 5 == 4 && t_m != 59){	
			fill(50);
		}
		else{
			fill(0);
		}
		//fill(100, 0, 0);
	}
	else{
		fill(0);
	}
	if (t_h > n){
		stroke(80, 150, 250);
	}
	else{
		stroke(150);
	}
	strokeWeight(min(w, h) / 200);
	translate(x, y);
	let t = abs(m % 2000 - 1000) / 1000;
	//console.log("Hello");
	//console.log(t);
	if (t < 0.30){
		t *= 100;
	}
	else if (t < 0.7){
		t = (t - 0.3) * 300 + 30;
	}
	else{
		t = (t - 0.7) * 100 + 150;
	}
	//console.log(t);
	rotate(t / 2);
	
	rect(0, 0, sqsize, sqsize);
	if (special){
		if (t_s == 59){
			//console.log("hi");
			fill(0);
			rect(0, 0, (1000 - (m - resetpoint)) / 1000 * sqsize, (1000 - (m - resetpoint)) / 1000 * sqsize);
			push();
			rectMode(CORNER);
			fill(50);
			if(t_m % 5 == 4){
				for (let i = 0; i < 4; i++){
					rotate(90);
					let lsize = sqsize * 0.05 * (1000 - (m - resetpoint)) / 1000;
					rect(sqsize / 2, sqsize / 2, lsize, lsize);
				}
			}
			else{
				for (let i = 0; i < (t_m + 1) % 5; i++){
					rotate(90);
					let lsize = sqsize * 0.05 + 0.5  * sqsize - ((1000 - (m - resetpoint)) / 1000 * sqsize) / 2;
					rect(sqsize * -0.55, sqsize * -0.55, lsize, lsize);
				}
			}
			pop();
		}
		else{
			rect(0, 0, sqsize * t_s / 60, sqsize * t_s / 60);
			push();
			rectMode(CORNER);
			fill(50);
			for (let i = 0; i < t_m % 5; i++){
				rotate(90);
				let lsize = sqsize * 0.05 + 0.5  * sqsize - sqsize * t_s / 60 / 2;
				rect(sqsize * -0.55, sqsize * -0.55, lsize, lsize);
			}
			pop();
		}
		rectMode(CENTER);
	}
	else{
		if (t_s == 59 && t_m == 59){
			fill(0);
			rect(0, 0, sqsize, sqsize);
			fill(50);
			rect(0, 0, (1000 - (m - resetpoint)) / 1000 * sqsize, (1000 - (m - resetpoint)) / 1000 * sqsize);
		}
		else{
			rect(0, 0, sqsize, sqsize);
			rect(0, 0, sqsize * t_s / 60, sqsize * t_s / 60);
		}
	}
	pop();
}
function draw() {
	
	w = windowWidth;
	h = windowHeight;
	
	t_m = minute();
	t_h = hour() % 12;
	if (t_h == 0){
		t_h = 12;
	}
	t_s = second();
	sqsize = min(w / 8, h / 6);
	createCanvas(w, h);
	background(0);
	m = millis();
	if (t_s == 59){
		if (m - resetpoint > 2000){
			resetpoint = m;
		}
	}
	x0 = findx(m);
	y0 = findy(m);
	translate(x0 * w / 8 + w / 16, y0 * h / 3);
	for (let i = 0; i < 3; i++){
		for (let j = 0; j < 4; j++){
			push();
			translate(j * w / 4, i * h / 3);
			//console.log(int((m - 1000) / 2000));
			let offset = int((m + 1000) / 2000);
			//console.log(offset % 3);
			let n = j * 3 + (i + 3 - offset % 3) % 3;
			makeSquare(0, 0, n);
			makeSquare(-1 * w, 0, n);
			makeSquare(w, 0, n);
			makeSquare(0, h, n);
			makeSquare(w, h, n);
			makeSquare(w, -1 * h, n);
			makeSquare(0, -1 * h, n);
			pop();
		}
	}
}