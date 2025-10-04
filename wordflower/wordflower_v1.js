function clean(t){
	ret = "";
	t2 = t.toLowerCase();
	for (i = 0; i < t2.length; i++){
		if (isLetter(t2[i])){
			ret += t2[i];
		}
	}
	return ret;
}
function submitParagraph(){
	words = input.value();//whatever's in the box
	wordlist = split(words, " ");
	input.remove();
	button.remove();
	//paragraphMode = false;
	idleMode = true;
	idletime = millis();
	//print("done!");
	editing = 0;
	paragraphMode = false;
}
function mousePressed(){
	if (! paragraphMode){
		background(editBg);
		idleMode = false;
		paragraphMode = true;
		//print("test");
		input = createInput();
  	input.position(h / 10, w / 10);
		input.style('font-size', str(int(h / 30)) + 'px');
		input.value(wordlist.join(" "));
		button = createButton('submit');
		button.style('font-size', str(int(h / 30)) + 'px');
  	button.position(input.x, input.y + int(h / 30) * 2);
  	button.mouseClicked(submitParagraph);
		//print("oh no!");
	}
	else{
		//paragraphMode = false;
	}
}
function setup(){
	h = windowHeight;
	w = windowWidth;
	createCanvas(w, h);
	background(255);
	newWord = "";
	prevWord = "";
	prevtime = millis();
	change = 1;
	words = "Click to edit";
	wordlist = split(words, " ");
	idleMode = true;
	idletime = millis();
	wordtime = 800;
	transitiontime = 500;
	editing = 0;
	ins = false;
	up = false;
	down = false;
	del = false
	moveWords = false;
	idleBg = color(242, 237, 211); //white
	editBg = color(7, 16, 26);//dark blue color(242, 237, 211); //white
	idleHi = color(209, 48, 48); //reddish//color(7, 16, 26);//dark blue
	editHi = color(106, 171, 176); //light blue
	idleMid = color(77, 43, 67);//purple//color(106, 171, 176); //light blue
	editMid = color(77, 43, 67);//purple
	paragraphMode = false;
}
function findX(word, i){
	m = min(h, w);
	if (i == 0 || word.length == 0){
		return 0;
	}
	l = word[word.length - 1];
	if (i <= word.length){
		l = word[i - 1];
	}
	s = split("abcdefghijklmnopqrstuvwxyz", l);
	c = floor(m * s[0].length / 26 / 3) + m / 6;
	s = split("etaoinsrhdlucmfywgpbvkxqjz", l);
	r = floor(2 * PI * s[0].length / 26);
	x = cos(r) * c;
	return x;
}
function findY(word, i){
	m = min(h, w);
	if (i == 0 || word.length == 0){
		return 0;
	}
	l = word[word.length - 1];
	if (i <= word.length){
		l = word[i - 1];
	}
	s = split("abcdefghijklmnopqrstuvwxyz", l);
	c = floor(m * s[0].length / 26 / 3) + m / 6;
	s = split("etaoinsrhdlucmfywgpbvkxqjz", l);
	r = floor(2 * PI * s[0].length / 26);
	y = sin(r) * c;
	return y;
}
function drawWord(oldword, newword, ch){
	strokeWeight(min(h, w) / 120);
	if (idleMode){
		stroke(idleHi);
	}
	else{
		stroke(editHi);
	}
	fill(0, 0, 0, 0);
	a = [];
	numpoints = max(oldword.length, newword.length) + 3;
	symmetry = 12;//12;
	translate(w/2, h/2);
	for (i = 0; i < numpoints; i++){
		startx = findX(oldword, i);
		goalx = findX(newword, i);
		starty = findY(oldword, i);
		goaly = findY(newword, i);
		x = goalx * ch + startx * (1 - ch);
		y = goaly * ch + starty * (1 - ch);
		append(a, x);
		append(a, y);
	}
	for (j = 0; j < symmetry; j++){
		//circle(0, 100, 10);
		beginShape();
		for (i = 0; i < numpoints; i++){
			curveVertex(a[i * 2], a[i * 2 + 1]);
		}
		if (numpoints == 3){
		curveVertex(0, 0);
		}
		endShape();
		rotate(2 * PI / symmetry);
	}
}
function keyPressed(){
	if (keyCode == DELETE || keyCode == BACKSPACE){
		if (newWord.length > 0 && !idleMode){
			prevWord = newWord;
			newWord = newWord.substring(0, newWord.length - 1);
			change = 0;
			prevtime = millis();
			wordlist[editing] = newWord;
			moveWords = false;
		}
	}
	if (keyCode == ENTER && !paragraphMode){
		idleMode = !idleMode;

		if (!idleMode){
			editing = int((millis() - idletime) / (wordtime + transitiontime)) % wordlist.length;
		}
		else{
			idletime = millis();
		}
	}
	if ((keyCode == UP_ARROW || keyCode == LEFT_ARROW) && editing > 0){
		up = false;
		ins = false;
		moveWords = true;
		if (wordlist[editing] == ""){
			wordlist.splice(editing, 1);
			del = true;
		}
		else{
			del = false;
		}
		prevWord = newWord;
		editing -= 1;
		newWord = wordlist[editing];
		change = 0;
		prevtime = millis();
	}
	if ((keyCode == DOWN_ARROW || keyCode == RIGHT_ARROW) && editing < wordlist.length - 1){
		moveWords = true;
		prevWord = newWord;
		ins = false;
		up = true;
		if (wordlist[editing] == ""){
			wordlist.splice(editing, 1);
			del = true;
		}
		else{
			editing += 1;
			del = false;
		}
		newWord = wordlist[editing];
		change = 0;
		prevtime = millis();

	}
}
function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}
function addNewWord(i){
	if (wordlist[i] == ""){
		return;
	}
	s = wordlist.slice(0, i);
	e = wordlist.slice(i, wordlist.length);
	wordlist = s;
	wordlist.push("");
	for (j = 0; j < e.length; j++){
		wordlist.push(e[j]);
	}
}
function keyTyped(){
	if (!idleMode && (isLetter(key) || key == "'" || key == "-")){
		prevWord = newWord;
		newWord = newWord + key;
		moveWords = false;
		change = 0;
		prevtime = millis();
		wordlist[editing] = wordlist[editing] + key;
	}
	if (key == " " && !idleMode && wordlist[editing] != ""){
		ins = true;
		del = false;
		up = true;
		moveWords = true;
		prevWord = newWord;
		newWord = "";
		change = 0;
		prevtime = millis();
		editing += 1;
		addNewWord(editing);
	}
}
function drawWordAsText(word){
	textAlign(LEFT);
	textSize(h / 30);
	rectMode(CORNER);
	fill(255, 50);
	strokeWeight(0);
	fill(0);
	text(word, w/-2, h/-2, w);
}
function contextualizeCurrentWord(e){
	if (h < w){
		wordDistance = h / 3;
		textAlign(LEFT);
		textSize(h / 30);
		rectMode(CORNER);
		strokeWeight(0);
		if (idleMode){
			fill(idleHi);
		}
		else{
			fill(editHi);
		}
		wdc = wordDistance * (1 - change);
		if (moveWords && !ins && up){
			text(wordlist[e], 0, h/2 + wdc, w);
		}
		else if (moveWords && !ins && !up){
			text(wordlist[e], 0, h/2 - wdc, w);
		}
		else{
			text(wordlist[e], 0, h/2, w);
		}
		if (idleMode){
			fill(idleMid);
		}
		else{
			fill(editMid);
		}
		//top up
		if ( !del && up && moveWords){
			if (e > 0){
				text(wordlist[e - 1], 0, h / 2 - wordDistance + wdc, w);
				if (e > 1){
					text(wordlist[e - 2], 0, h / 2 - wordDistance * 2 + wdc, w);
				}
			}
		}
		//top down
		else if (!up && moveWords){
			if (e > 0){
				text(wordlist[e - 1], 0, h / 2 - wordDistance - wdc, w);
				if (e > 1){
					text(wordlist[e - 2], 0, h / 2 - wordDistance * 2 - wdc, w);
				}
			}
		}
		//top across
		else{
			if (e > 0){
				text(wordlist[e - 1], 0, h / 2 - wordDistance, w);
				if (e > 1){
					text(wordlist[e - 2], 0, h / 2 - wordDistance * 2, w);
				}
			}
		}
		//bottom up
		if(!ins && !del && up && moveWords || del && up && moveWords){
			if (e < wordlist.length - 1){
				text(wordlist[e + 1], 0, h/2 + wordDistance + wdc, w);
				if (e < wordlist.length - 2){
					text(wordlist[e + 2], 0, h/2 + wordDistance * 2 + wdc, w);
				}
			}
		}
		//bottom down
		else if(del == up && moveWords){
			if (e < wordlist.length - 1){
				text(wordlist[e + 1], 0, h/2 + wordDistance - wdc, w);
				if (e < wordlist.length - 2){
					text(wordlist[e + 2], 0, h/2 + wordDistance * 2 - wdc, w);
				}
			}
		}
		//bottom across
		else {
			if (e < wordlist.length - 1){
				text(wordlist[e + 1], 0, h/2 + wordDistance, w);
				if (e < wordlist.length - 2){
					text(wordlist[e + 2], 0, h/2 + wordDistance * 2, w);
				}
			}
		}
	}
	else{
		wordDistance = w / 3;
		textAlign(CENTER);
		textSize(h / 30);
		rectMode(CORNER);
		strokeWeight(0);
		if (idleMode){
			fill(idleHi);
		}
		else{
			fill(editHi);
		}
		defht = h / 10;
		wdc = wordDistance * (1 - change);
		if (moveWords && !ins && up){
			text(wordlist[e], 0 + wdc, defht, w);
		}
		else if (moveWords && !ins && !up){
			//text(wordlist[e], 0, h/2 - wdc, w);
			text(wordlist[e], 0 - wdc, defht, w);
		}
		else{
			//text(wordlist[e], 0, h/2, w);
			text(wordlist[e], 0, defht, w);
		}
		//circle(0, 0, 20);
		if (idleMode){
			fill(idleMid);
		}
		else{
			fill(editMid);
		}
		//left left
		if ( !del && up && moveWords){
			if (e > 0){
				//text(wordlist[e - 1], 0, h / 2 - wordDistance + wdc, w);
				text(wordlist[e - 1], 0 - wordDistance + wdc, defht, w);
				if (e > 1){
					//text(wordlist[e - 2], 0, h / 2 - wordDistance * 2 + wdc, w);
					text(wordlist[e - 2], 0 - wordDistance * 2 + wdc, defht, w);
				}
			}
		}
		//top down
		else if (!up && moveWords){
			if (e > 0){
				text(wordlist[e - 1], 0 - wordDistance - wdc, defht, w);
				if (e > 1){
					text(wordlist[e - 2], 0 - wordDistance * 2 - wdc, defht, w);
				}
			}
		}
		//top across
		else{
			if (e > 0){
				text(wordlist[e - 1], 0 - wordDistance, defht, w);
				if (e > 1){
					text(wordlist[e - 2], 0 - wordDistance * 2, defht, w);
				}
			}
		}
		//bottom up
		if(!ins && !del && up && moveWords|| del && up && moveWords){
			if (e < wordlist.length - 1){
				text(wordlist[e + 1], 0 + wordDistance + wdc, defht, w);
				if (e < wordlist.length - 2){
					text(wordlist[e + 2], 0 + wordDistance * 2 + wdc, defht, w);
				}
			}
		}
		//bottom down
		else if(del == up && moveWords){
			if (e < wordlist.length - 1){
				text(wordlist[e + 1], 0 + wordDistance - wdc, defht, w);
				if (e < wordlist.length - 2){
					text(wordlist[e + 2], 0 + wordDistance * 2 - wdc, defht, w);
				}
			}
		}
		//bottom across
		else {
			if (e < wordlist.length - 1){
				text(wordlist[e + 1], 0 + wordDistance, defht, w);
				if (e < wordlist.length - 2){
					text(wordlist[e + 2], 0 + wordDistance * 2, defht, w);
				}
			}
		}
	}
}
function draw(){
	//text()
	h = windowHeight;
	w = windowWidth;
	if (!paragraphMode){
		createCanvas(w, h);
	}
	if (idleMode){
		background(idleBg);
		up = true;
		ins = false;
		del = false;
		//print(int((millis() - idletime) / (wordtime + transitiontime)) % wordlist.length);
		n = millis() - idletime + transitiontime;
		change = min(1, (n % (wordtime + transitiontime)) / transitiontime);
		prevWord = wordlist[int(n / (wordtime + transitiontime) - 1) % wordlist.length];
		newWord = wordlist[int(n / (wordtime + transitiontime)) % wordlist.length];
		if (change < 1){
			moveWords = true;
		}
		editing = int(n / (wordtime + transitiontime)) % wordlist.length;
		//print(editing);
		contextualizeCurrentWord(int(n / (wordtime + transitiontime)) % wordlist.length);
	}
	else{
		background(editBg);
		if (change < 1){
			change = min((millis() - prevtime) / 100, 1);
		}
		//print(wordlist[editing]);
	}
	if (!paragraphMode){
		contextualizeCurrentWord(editing);
		drawWord(clean(prevWord), clean(newWord), change);
	}
}
