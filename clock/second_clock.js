function setup() {
	createCanvas(windowWidth, windowHeight);
	background(100);
	colorMode(HSB);
	c = 1/50;
	ctr = 60;
	strokeWeight(5);
	stroke(300, 50, 50);
	fill(0, 0, 0);
	//slider = createSlider(0, 23, hour(), 1);
  //slider.position(10, 10);
  //slider.style('width', '80px');
}


//second - motion
//minute - color
//hour - number

function findxy(x0, y0, y1, jumpht, first = true){
	a = millis() % 2000;
	l = a > 1000;
	y2 = y0 - jumpht;
	x2 = sqrt(jumpht / c) + x0;//x0 + sqrt(j);
	x1 = x2 + sqrt((y1 - y2) / c);//x2 + sqrt(y1 - y2);
	if (! first){
		x2 = -1 * sqrt(jumpht / c) + x0;
		x1 = x2 - sqrt((y1 - y2) / c);
	}
	if (l && first){
		return findxy(x1, y1 , y1 + windowHeight / 3, jumpht, false);
	}
	x = x0 + (x1 - x0) * a / 1000;
	y = c * sq(x - x2) + y2; //sq(x - x2) + sq(y0 - jumpht);
	if (! first){
		
		x = x0 + (x1 - x0) * (a - 1000) / 1000;
		y = c * sq(x - x2) + y2;
	}
	//m = PI * sin(PI * a / 2000);
	if (x > windowWidth + sqsize2){
			//x -= windowWidth;
		}
	if (y > windowHeight + sqsize2){
			//fill(100, 100, 100);
			//y -= windowHeight;
		}
	if (x < -1 * sqsize2){
			//x += windowWidth;
		}
	if (y < -1 * sqsize2){
			//fill(0, 0, 0);
			//y += windowHeight;
		}
	return [x, y];
}
function draw() {
	left = false;//millis() % 2000 > 1000;
	background(0);
	w = windowWidth;
	ht = windowHeight;
	hr = hour();//slider.value();
	if (hr == 0){
		hr = 12;
	}
	if (hr > 12){
		hr -= 12;
	}
	m = minute();
	s = second();
	sqsize = min(windowWidth / 10, windowHeight / 10);
	sqsize2 = 2 * min(windowWidth / 10, windowHeight / 10);
	jumpht = sqsize * 3;
	angle = PI * sin(PI * (millis() % 2000) / 2000);
	if (s == 59){
		sqsize *= 2 * ctr / 60;
		m += 1;
		ctr -= 1;
	}
	else{
		sqsize *= 2 * s / 60;
		ctr = 60;
	}
	for (i = 0; i < 6; i++){
		for (j = 0; j < 6; j++){
			x0 = (j - 1) * windowWidth / 4;
			y0 = ((i + 2 * int(millis() / 2000)) % 6 - 1) * windowHeight / 3 ;
			y1 = y0 + windowHeight / 3;
			coor = findxy(x0, y0, y1, jumpht);
			push();
			stroke(300, 40, 70);
			translate(coor[0], coor[1]);
			rotate(angle);
			n = ((i) % 3 + 3 * ((j + 3) % 4));
			//print(n);
			if (5 * (n + 1) <= m){
				fill(300, 20, 30);
				if (n < hr){
					fill(0, 0, 30);
				}
			}
			if (n < hr){
				stroke(150, 50, 50);
			}
			
			//fill(0,0,0);
			rect(-sqsize2 / 2, -sqsize2 / 2, sqsize2, sqsize2);
			rect(-sqsize / 2, -sqsize / 2, sqsize, sqsize);
			if (5 * n <= m && 5 * (n + 1) > m){
				for (q = 0; q < m % 5; q++){
					fill(300, 20, 30);
					rect(sqsize / 2, sqsize / 2, (sqsize2 - sqsize) / 2 + 10, (sqsize2 - sqsize) / 2 + 10);
					rotate(PI / 2);
				}
			}
			pop();
		}
	}
}