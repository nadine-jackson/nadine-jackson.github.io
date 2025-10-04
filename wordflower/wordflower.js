IDLE = 0;
EDIT = 1;
IDLE_TO_EDIT = 2;
EDIT_TO_IDLE = 3;

function switch_to_idle() {
	paragraph.remove();
	input.remove();
	RESET_POINT = millis();
	I_AT_RESET = current_word;
	//find empty strings
	empty_loc = WORD_LIST.indexOf("");
	while (WORD_LIST.length > 1 && empty_loc != -1) {
		WORD_LIST.splice(empty_loc, 1);
		current_word = (current_word - 1 + WORD_LIST.length) % WORD_LIST.length;
		empty_loc = WORD_LIST.indexOf("");
	}
	paragraph.value(join(WORD_LIST, " "));
	MODE = IDLE;
}

function keyPressed() {
	if (keyCode == ENTER) {
		if (IGNORE_ENTER){
			IGNORE_ENTER == false;
		}
		else if (MODE == EDIT) {
			switch_to_idle();
		}
	} else if (key == " " && MODE == EDIT && WORD_LIST[current_word] != "" && RECENT_FOCUS == input) {
		add_word();
	}
}

function setup() {
	MODE = IDLE;
	RATE = 1000;
	RESET_POINT = 0;
	I_AT_RESET = 0;
	WORD_LIST = ["Click", "to", "edit."];
	IGNORE = false;
	IGNORE_ENTER = false;
	IDLE_COLOR = color(255, 90, 50);
	IDLE_BACKGROUND = color(255, 245, 170);
	textFont(font);
	FIRST_TIME = true;
}

function isLetter(str) {
	return str.length === 1 && str.match(/[a-z]/i);
}

function clean(t) {
	ret = "";
	t2 = t.toLowerCase();
	for (i = 0; i < t2.length; i++) {
		if (isLetter(t2[i])) {
			ret += t2[i];
		}
	}
	return ret;
}

function findX(word, i) {
	m = min(h, w) * 0.9;
	if (i == 0 || word.length == 0) {
		return 0;
	}
	l = word[word.length - 1];
	if (i <= word.length) {
		l = word[i - 1];
	}
	s = split("abcdefghijklmnopqrstuvwxyz", l);
	c = floor(m * s[0].length / 26 / 3) + m / 6;
	s = split("etaoinsrhdlucmfywgpbvkxqjz", l);
	r = floor(2 * PI * s[0].length / 26);
	x = cos(r) * c;
	return x;
}

function findY(word, i) {
	m = min(h, w) * 0.9;
	if (i == 0 || word.length == 0) {
		return 0;
	}
	l = word[word.length - 1];
	if (i <= word.length) {
		l = word[i - 1];
	}
	s = split("abcdefghijklmnopqrstuvwxyz", l);
	c = floor(m * s[0].length / 26 / 3) + m / 6;
	s = split("etaoinsrhdlucmfywgpbvkxqjz", l);
	r = floor(2 * PI * s[0].length / 26);
	y = sin(r) * c;
	return y;
}

function ignore_click() {
	IGNORE = true;
}

function drawWord(oldword, newword, ch) {
	strokeWeight(min(h, w) / 120);
	if (MODE == IDLE) {
		stroke(IDLE_COLOR);
	}
	if (MODE == EDIT) {
		stroke(color(0, 255, 0));
	}
	fill(0, 0, 0, 0);
	a = [];
	numpoints = max(oldword.length, newword.length) + 3;
	symmetry = 12; //12;
	translate(w / 2, h / 2);
	for (i = 0; i < numpoints; i++) {
		startx = findX(oldword, i);
		goalx = findX(newword, i);
		starty = findY(oldword, i);
		goaly = findY(newword, i);
		x = goalx * ch + startx * (1 - ch);
		y = goaly * ch + starty * (1 - ch);
		append(a, x);
		append(a, y);
	}
	for (j = 0; j < symmetry; j++) {
		//circle(0, 100, 10);
		beginShape();
		for (i = 0; i < numpoints; i++) {
			curveVertex(a[i * 2], a[i * 2 + 1]);
		}
		if (numpoints == 3) {
			curveVertex(0, 0);
		}
		endShape();
		rotate(2 * PI / symmetry);
	}
}

function update_word() {
	if (input.value() == " ") {
		input.value("");
	}
	WORD_LIST[current_word] = input.value();
	paragraph.value(join(WORD_LIST, " "));
	if (input.value().includes(" ")){
		update_paragraph();
	}
}
function clean_paragraph(s){
	let ret = "";
	for (let i = 0; i < s.length; i++){
		if (s[i] != "\n" && s[i] != "\t"){
			ret += s[i];
		}
		else{
			ret += " ";
		}
	}
	return ret;
}
function update_paragraph(){
	WORD_LIST = split(clean_paragraph(paragraph.value()), " ");
	current_word = WORD_LIST.length - 1;
	input.value(WORD_LIST[current_word]);
}
function fix_paste(){
	update_word();
	update_paragraph();
}

function add_word() {
	if (WORD_LIST[current_word] != 0) {
		WORD_LIST.splice(current_word + 1, 0, "");
		current_word += 1;
		input.value("");
	}
	paragraph.value(join(WORD_LIST, " "));
}

function next_word() {
	if (WORD_LIST.length > 1) {
		if (WORD_LIST[current_word] == "") {
			WORD_LIST.splice(current_word, 1);
			current_word %= WORD_LIST.length;
			input.value(WORD_LIST[current_word]);
			paragraph.value(join(WORD_LIST, " "));
		}
		current_word += 1;
		current_word %= WORD_LIST.length;

		input.value(WORD_LIST[current_word]);
		//print(WORD_LIST[current_word]);
		//input.elt.focus();
	}
}

function prev_word() {
	if (WORD_LIST[current_word] == "") {
		remove_word();
	} else if (WORD_LIST.length > 1) {
		current_word -= 1 - WORD_LIST.length;
		current_word %= WORD_LIST.length;
		input.value(WORD_LIST[current_word]);
	}
}

function remove_word() {
	if (WORD_LIST.length > 1) {
		WORD_LIST.splice(current_word, 1);
		current_word = (current_word - 1 + WORD_LIST.length) % WORD_LIST.length;
		input.value(WORD_LIST[current_word]);
	} else {
		input.value("");
		update_word();
	}
	paragraph.value(join(WORD_LIST, " "));
}
function ignore_enter(){
	if (keyCode == ENTER){
		IGNORE_ENTER = true;
	}
}
function input_click(){
	ignore_click();
	RECENT_FOCUS = input;
}
function paragraph_click(){
	ignore_click();
	RECENT_FOCUS = paragraph;
}
function mousePressed() {
	//image(plus_sign, w / -2 + w / 30, h / 3, h / 20, h / 20);
	if (MODE == EDIT) {
		if (w > h){
		//bottom plus sign
		if (mouseX >= plus_left + w / 2 && mouseX <= plus_left + h / 20 + w / 2 && mouseY >= h / 2 + h / 3 && mouseY <= h / 2 + h / 3 + h / 20) {
			ignore_click();
			add_word();
		}
		//down arrow
		else if (mouseX >= down_arrow_left + w / 2 && mouseX <= down_arrow_left + h / 20 + w / 2 && mouseY >= h / 2 + h / 3 && mouseY <= h / 2 + h / 3 + h / 20) {
			ignore_click();
			next_word();
		}
		//up arrow
		else if (mouseX >= up_arrow_left + w / 2 && mouseX <= up_arrow_left + h / 20 + w / 2 && mouseY >= h / 2 - h / 3 - h / 20 && mouseY <= h / 2 - h / 3) {
			ignore_click();
			prev_word();
		}
		//minus sign
		//image(minus_sign,w / -2 + w / 30 + w / 5 + h / 20, h / -40, h / 20, h / 20);
		else if (mouseX >= w / 30 + w / 5 + h / 20 && mouseX <= w / 30 + w / 5 + h / 20 + h / 20 && mouseY >= h / 2 - h / 40 && mouseY <= h / 2 + h / 40) {
			ignore_click();
			remove_word();
		}
		}
		else{
			//left arrow
			let lal = h / 40;
			let lat = h / 6 + h / 40;
			let rat = h / 6 + h / 40;
			let ral = w - h / 40 - h / 20;
			let plt = h / 40;
			let pll = w / 2 + h / 40;
			let mst = h / 40;
			let msl = w / 2 - h / 40 - h / 20;
			
			if (mouseX >= lal && mouseX <= lal + h / 20 && mouseY >= lat && mouseY <= lat + h / 20){
				ignore_click();
				prev_word();
			}
			//right arrow
			
			else if (mouseX >= ral && mouseX <= ral + h / 20 && mouseY >= rat && mouseY <= rat + h / 20){
				ignore_click();
				next_word();
			}
			//plus sign
			
			else if (mouseX >= pll && mouseX <= pll + h / 20 && mouseY >= plt && mouseY <= plt + h / 20){
				ignore_click();
				add_word();
			}
			//minus sign
			
			else if (mouseX >= msl && mouseX <= msl + h / 20 && mouseY >= mst && mouseY <= mst + h / 20){
				ignore_click();
				remove_word();
			}
		}
	}
	if (IGNORE) {
		IGNORE = false;
		return;
	}
	if (MODE == IDLE) {
		if (FIRST_TIME){
			WORD_LIST = [""];
			current_word = 0;
			FIRST_TIME = false;
		}
		input = createInput();
		rectMode(CENTER);
		input.value(WORD_LIST[current_word]);
		input.style('color', '#00ff00');
		input.style('background-color', '#303030');
		input.elt.placeholder = "write a word";
		input.mousePressed(input_click);
		input.touchStarted(input_click);
		image(plus_sign, w / -2 + w / 30, h / 3, h / 20, h / 20);
		//print(plus_sign);
		//print(plus_sign.mousePressed());
		input.input(update_word);
		RECENT_FOCUS = input;
		
		paragraph = createElement('textarea');
		paragraph.elt.placeholder = "write more words";
		paragraph.value(join(WORD_LIST, " "));
		paragraph.style('color', '#00ff00');
		paragraph.style('background-color', '#303030');
		paragraph.mousePressed(paragraph_click);
		paragraph.touchStarted(paragraph_click);
		paragraph.input(update_paragraph);

		MODE = EDIT;
	} else if (MODE == EDIT) {
		switch_to_idle();

	}
}

function preload() {
	plus_sign = loadImage('./plus.png');
	arrow_sign = loadImage('./arrow.png');
	delete_sign = loadImage('./delete.png');
	minus_sign = loadImage('./minus.png');
	font = loadFont('AtkinsonHyperlegible-Regular.ttf');
}

function draw() {
	time_in_word = millis() - RESET_POINT;
	h = windowHeight;
	w = windowWidth;
	createCanvas(w, h);

	let ch = min(1.25 * (time_in_word % RATE) / RATE, 1);

	if (MODE == IDLE) {
		let i = int(I_AT_RESET + time_in_word / RATE) % WORD_LIST.length;
		let j = (i + 1) % WORD_LIST.length;
		if (ch > 0.5) {
			current_word = j;
		} else {
			current_word = i;
		}
		let k = (i - 1 + WORD_LIST.length) % WORD_LIST.length;
		background(IDLE_BACKGROUND);
		drawWord(clean(WORD_LIST[i]), clean(WORD_LIST[j]), ch);
		if (w > h) {
			textAlign(LEFT);
			textSize(h / 20);
			rectMode(CENTER);
			strokeWeight(0);
			fill(255, 90, 50, 255 - ch * 200);
			text(WORD_LIST[i], w / -2 + w / 30, 0 + h / 40 - ch * h / 3);
			fill(255, 90, 50, 200 * ch + 55);
			text(WORD_LIST[j], w / -2 + w / 30, h / 3 - ch * h / 3 + h / 40);
			fill(255, 90, 50, 55);
			text(WORD_LIST[(j + 1) % WORD_LIST.length], w / -2 + w / 30, 2 * h / 3 - ch * h / 3 + h / 40);
			text(WORD_LIST[k], w / -2 + w / 30, h / -3 - ch * h / 3 + h / 40);
		}
		else{
			textAlign(CENTER);
			textSize(w / 20);
			rectMode(CENTER);
			strokeWeight(0);
			fill(255, 90, 50, 255 - ch * 200);
			text(WORD_LIST[i], 0 - ch * w / 2, 0 - 2 * h / 5);
			fill(255, 90, 50, 200 * ch + 55);
			text(WORD_LIST[j], w / 2 - ch * w / 2, 0 - 2 * h / 5);
			fill(255, 90, 50, 55);
			text(WORD_LIST[(j + 1) % WORD_LIST.length], w - ch * w / 2, 0 - 2 * h / 5);
			text(WORD_LIST[k], w / -2  + ch * w / -2, 0 - 2 * h / 5);
		}
	} else if (MODE == EDIT) {
		background(0);
		drawWord(clean(WORD_LIST[current_word]), clean(WORD_LIST[current_word]), 1);
		if (true) {
			fill(color(0, 255, 0));
			/*textAlign(LEFT);
			textSize(h / 20);
			rectMode(CENTER);
			strokeWeight(0);*/

			//word
			input.style("font-size", "5vh");
			paragraph.style("font-size", "5vh");
			input.style("font-family", "'Courier New', monospace");
			textWrap(WORD);
			if (w > h){
				input.style("width", "20vw");
				input.position(w / 30, h / 2 - input.size().height / 2);
			}
			else{
				input.style("width", "80vw");
				input.position(w / 10, h / 10);
			}
			//input.elt.focus({focusVisible: true});
			//paragraph
			paragraph.style("font-family", "'Courier New', monospace");
			if (w > h){
				paragraph.style("height", "75vh");
				paragraph.style("font-family", "'Courier New', monospace");
				paragraph.style("width", "20vw");
				paragraph.position(w - w / 30 - w / 5, h / 2 - paragraph.size().height / 2);
			}
			else{
				paragraph.style("height", "20vh");
				paragraph.style("width", "80vw");
				paragraph.position(w / 10, h * 0.75);
			}
			RECENT_FOCUS.elt.focus({focusVisible: true});
			
			if (w > h){
				plus_left = w / -2 + w / 30 + input.size().width / 2 - h / 20 - h / 80;
				image(plus_sign, plus_left, h / 3, h / 20, h / 20);
				down_arrow_left = w / -2 + w / 30 + input.size().width / 2 + h / 80;
				image(arrow_sign, down_arrow_left, h / 3, h / 20, h / 20);
				up_arrow_left = w / -2 + w / 30 + input.size().width / 2 - h / 40;
				push();
				scale(1, -1);
				image(arrow_sign, up_arrow_left, h / 3, h / 20, h / 20);
				pop();
				image(minus_sign, w / -2 + w / 30 + w / 5 + h / 20, h / -40, h / 20, h / 20);
			}
			else{
				plus_left = h / 40;
				image(plus_sign, plus_left, h / 40 - h / 2, h / 20, h / 20);
				//left_arrow
				push();
				rotate(PI / 2);
				image(arrow_sign, h / -2 + h / 40 + h / 6, w / 2 - h / 20 - h / 40, h / 20, h / 20);
				pop();
				//right arrow
				push();
				rotate(PI / -2);
				image(arrow_sign, h / 2 - h / 40 - h / 6 - h / 20, w / 2 - h / 20 - h / 40, h / 20, h / 20);
				pop();
				minus_left = h / -40 - h / 20;
				image(minus_sign, minus_left, h / 40 - h / 2, h / 20, h / 20);
			}
		}

	}
}