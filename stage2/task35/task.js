function initial() {
	var lineNumber = document.getElementById("lineNumber"),
		lineNumberP = lineNumber.getElementsByTagName("p"),
		textarea = document.getElementsByTagName("textarea")[0];
	initialTextarea();
	document.getElementById("execute").onclick = function() {
		clearTimeout(timer);
		clearAllLineNumberP();
		var formatInputArr = document.getElementsByTagName("textarea")[0].value.replace(/\n/gi,"&#xe").split("&#xe"),
			commandRegExp = /(^TUN +(LEF|RIG|BAC)$)|(^GO *[0-9]*$)|(^(TRA|MOV) +(TOP|LEF|BOT|RIG) *[0-9]*$)/gi,
			trimString,numberIndex,commandArr = [],commandCount = 0,moveTimes,spendTime = 0;
		for (var i = 0; i < formatInputArr.length; i++) {
			trimString = formatInputArr[i].trim();
			if (trimString.length === 0) {
				if (formatInputArr[i+1] !== undefined) {
					continue;
				} else {
					break;
				}
			}
			if(commandRegExp.test(trimString)) {
				commandArr[commandCount] = [];
				trimString = trimString.replace(/ +/gi," ");
				
				numberIndex = trimString.search(/[0-9]+/gi);
				if (numberIndex !== -1) {
					commandArr[commandCount].push(trimString.slice(0,numberIndex - 1));
					commandArr[commandCount++].push(trimString.slice(numberIndex));
				} else {
					commandArr[commandCount++].push(trimString);
				}
				commandRegExp.lastIndex = 0;
			} else {
				lineNumber.getElementsByTagName("p")[i].style.backgroundColor = "red";
			}
		}

		for (var j = 0; j < commandArr.length; j++) {
			moveTimes = 0;
			switch(commandArr[j][0]) {
				case "TUN LEF" :
					timer = setTimeout(function () {
						turnLeft();
					},spendTime + 500);
					spendTime += 1000;
					break;

				case "TUN RIG" :
					timer = setTimeout(function () {
						turnRight();
					},spendTime + 500);
					spendTime += 1000;
					break;

				case "TUN BAC" :
					timer = setTimeout(function () {
						turnBack();
					},spendTime + 500);
					spendTime += 1000;
					break;

				case "GO" :
					commandArr[j][1] = commandArr[j][1] === undefined ? 1 : parseInt(commandArr[j][1]);
					while(moveTimes < commandArr[j][1]) {
						timer = setTimeout(function () {
							goForward();
						},spendTime + 500 * moveTimes);
						moveTimes++;
					}
					spendTime += commandArr[j][1] * 550;
					break;

				case "TRA LEF" :
					commandArr[j][1] = commandArr[j][1] === undefined ? 1 : parseInt(commandArr[j][1]);
					while(moveTimes < commandArr[j][1]) {
						timer = setTimeout(function () {
							goForward("left");
						},spendTime + 500 * moveTimes);
						moveTimes++;
					}
					spendTime += commandArr[j][1] * 550;
					break;

				case "TRA TOP" :
					commandArr[j][1] = commandArr[j][1] === undefined ? 1 : parseInt(commandArr[j][1]);
					while(moveTimes < commandArr[j][1]) {
						timer = setTimeout(function () {
							goForward("up");
						},spendTime + 500 * moveTimes);
						moveTimes++;
					}
					spendTime += commandArr[j][1] * 550;
					break;

				case "TRA RIG" :
					commandArr[j][1] = commandArr[j][1] === undefined ? 1 : parseInt(commandArr[j][1]);
					while(moveTimes < commandArr[j][1]) {
						timer = setTimeout(function () {
							goForward("right");
						},spendTime + 500 * moveTimes);
						moveTimes++;
					}
					spendTime += commandArr[j][1] * 550;
					break;

				case "TRA BOT" :
					commandArr[j][1] = commandArr[j][1] === undefined ? 1 : parseInt(commandArr[j][1]);
					while(moveTimes < commandArr[j][1]) {
						timer = setTimeout(function () {
							goForward("down");
						},spendTime + 500 * moveTimes);
						moveTimes++;
					}
					spendTime += commandArr[j][1] * 550;
					break;

				case "MOV LEF" :
					commandArr[j][1] = commandArr[j][1] === undefined ? 1 : parseInt(commandArr[j][1]);
					timer = setTimeout(function() {
						moveToDirection("left");
					},spendTime + 500);
					spendTime += 1000;
					while(moveTimes < commandArr[j][1]) {
						timer = setTimeout(function() {
							goForward();
						},spendTime + 500 * (moveTimes + 1));
						moveTimes++;
					}
					spendTime += commandArr[j][1] * 700;
					break;

				case "MOV TOP" :
					commandArr[j][1] = commandArr[j][1] === undefined ? 1 : parseInt(commandArr[j][1]);
					timer = setTimeout(function() {
						moveToDirection("up");
					},spendTime + 500);
					spendTime += 1000;
					while(moveTimes < commandArr[j][1]) {
						timer = setTimeout(function() {
							goForward();
						},spendTime + 500 * (moveTimes + 1));
						moveTimes++;
					}
					spendTime += commandArr[j][1] * 700;
					break;

				case "MOV RIG" :
					commandArr[j][1] = commandArr[j][1] === undefined ? 1 : parseInt(commandArr[j][1]);
					timer = setTimeout(function() {
						moveToDirection("right");
					},spendTime + 500);
					spendTime += 1000;
					while(moveTimes < commandArr[j][1]) {
						timer = setTimeout(function() {
							goForward();
						},spendTime + 500 * (moveTimes + 1));
						moveTimes++;
					}
					spendTime += commandArr[j][1] * 700;
					break;

				case "MOV BOT" :
					commandArr[j][1] = commandArr[j][1] === undefined ? 1 : parseInt(commandArr[j][1]);
					timer = setTimeout(function() {
						moveToDirection("down");
					},spendTime + 500);
					spendTime += 1000;
					while(moveTimes < commandArr[j][1]) {
						timer = setTimeout(function() {
							goForward();
						},spendTime + 500 * (moveTimes + 1));
						moveTimes++;
					}
					spendTime += commandArr[j][1] * 700;
					break;

				default:
					executeResult.innerHTML = "指令不存在！";
					executeResult.style.color = "red";
					break;
			}	
		}
	};
	document.getElementsByTagName("textarea")[0].onkeydown = function() {
		scrollLineNumber(lineNumber,textarea);
		clearAllLineNumberP();
	};
	document.getElementsByTagName("textarea")[0].onscroll = function() {
		scrollLineNumber(lineNumber,textarea);
	};
	
}

var currentState = "up",
	target = document.getElementById("target"),
	targetHeader = document.getElementById("targetHeader"),
	targetBody = document.getElementById("targetBody"),
	executeResult = document.getElementById("executeResult"),
	rotateAngle = 0,
	timer;

function initialTextarea() {
	var pTag,lineNumber = document.getElementById("lineNumber");
	for (var i = 1; i <= 100; i++) {
		pTag = document.createElement("p");
		pTag.innerHTML = i;
		lineNumber.appendChild(pTag);
	}
}
function clearAllLineNumberP() {
	var lineNumberP = document.getElementById("lineNumber").getElementsByTagName("p");
	for (var h = 0; h < lineNumberP.length; h++) {
		lineNumberP[h].style.backgroundColor = "#888";
	}
}
function scrollLineNumber(lineNumber,textarea) {
	lineNumber.style.top = -1 * textarea.scrollTop + "px";
}
function goForward(nextState) {
	switch(nextState||currentState) {
		case "up" :
			if (target.offsetTop >= 52) {
				target.style.top = target.offsetTop - 52 + "px";
				executeResult.innerHTML = "指令执行成功！";
				executeResult.style.color = "green";
			} else {
				executeResult.innerHTML = "已经到最顶端了！";
				executeResult.style.color = "red";
			}
			break;

		case "right" :
			if (target.offsetLeft <= 402) {
				target.style.left = target.offsetLeft + 48 + "px";
				executeResult.innerHTML = "指令执行成功！";
				executeResult.style.color = "green";
			} else {
				executeResult.innerHTML = "已经到最右端了！";
				executeResult.style.color = "red";
			}
			break;

		case "down" :
			if (target.offsetTop <= 402) {
				target.style.top = target.offsetTop + 48 + "px";
				executeResult.innerHTML = "指令执行成功！";
				executeResult.style.color = "green";
			} else {
				executeResult.innerHTML = "已经到最底端了！";
				executeResult.style.color = "red";
			}
			break;

		case "left" :
			if (target.offsetLeft >= 52) {
				target.style.left = target.offsetLeft - 52 + "px";
				executeResult.innerHTML = "指令执行成功！";
				executeResult.style.color = "green";
			} else {
				executeResult.innerHTML = "已经到最左端了！";
				executeResult.style.color = "red";
			}
			break;
	}
}
function turnLeft() {
	rotateAngle = rotateAngle - 90;
	target.style.transform = "rotate(" + rotateAngle + "deg)";
	target.style.mozTransform = "rotate(" + rotateAngle + "deg)";
	target.style.webkitTransform = "rotate(" + rotateAngle + "deg)";
	switch(currentState) {
		case "up" :
			currentState = "left";
			break;

		case "right" :
			currentState = "up";
			break;

		case "down" :
			currentState = "right";
			break;

		case "left" :
			currentState = "down";
			break;
	}
	executeResult.innerHTML = "指令执行成功！";
	executeResult.style.color = "green";
}
function turnRight() {
	rotateAngle = rotateAngle + 90;
	target.style.transform = "rotate(" + rotateAngle + "deg)";
	target.style.mozTransform = "rotate(" + rotateAngle + "deg)";
	target.style.webkitTransform = "rotate(" + rotateAngle + "deg)";
	switch(currentState) {
		case "up" :
			currentState = "right";
			break;

		case "right" :
			currentState = "down";
			break;

		case "down" :
			currentState = "left";
			break;

		case "left" :
			currentState = "up";
			break;
	}
	executeResult.innerHTML = "指令执行成功！";
	executeResult.style.color = "green";
}
function turnBack() {
	rotateAngle = rotateAngle + 180;
	target.style.transform = "rotate(" + rotateAngle + "deg)";
	target.style.mozTransform = "rotate(" + rotateAngle + "deg)";
	target.style.webkitTransform = "rotate(" + rotateAngle + "deg)";
	switch(currentState) {
		case "up" :
			currentState = "down";
			break;

		case "right" :
			currentState = "left";
			break;

		case "down" :
			currentState = "up";
			break;

		case "left" :
			currentState = "right";
			break;
	}
	executeResult.innerHTML = "指令执行成功！";
	executeResult.style.color = "green";
}

function moveToDirection(direction) {
	if (direction === currentState) return;
	switch(currentState) {
		case "up" :
			switch(direction) {
				case "down" :
					rotateAngle = rotateAngle + 180;
					currentState = "down";
					break;
				case "left" :
					rotateAngle = rotateAngle - 90;
					currentState = "left";
					break;
				case "right" :
					rotateAngle = rotateAngle + 90;
					currentState = "right";
					break;
			}
			break;

		case "down" :
			switch(direction) {
				case "up" :
					rotateAngle = rotateAngle + 180;
					currentState = "up";
					break;
				case "left" :
					rotateAngle = rotateAngle + 90;
					currentState = "left";
					break;
				case "right" :
					rotateAngle = rotateAngle - 90;
					currentState = "right";
					break;
			}
			break;

		case "left" :
			switch(direction) {
				case "up" :
					rotateAngle = rotateAngle + 90;
					currentState = "up";
					break;
				case "down" :
					rotateAngle = rotateAngle - 90;
					currentState = "down";
					break;
				case "right" :
					rotateAngle = rotateAngle + 180;
					currentState = "right";
					break;
			}
			break;

		case "right" :
			switch(direction) {
				case "up" :
					rotateAngle = rotateAngle - 90;
					currentState = "up";
					break;
				case "down" :
					rotateAngle = rotateAngle + 90;
					currentState = "down";
					break;
				case "left" :
					rotateAngle = rotateAngle + 180;
					currentState = "left";
					break;
			}
			break;
	}
	target.style.transform = "rotate(" + rotateAngle + "deg)";
	target.style.mozTransform = "rotate(" + rotateAngle + "deg)";
	target.style.webkitTransform = "rotate(" + rotateAngle + "deg)";
}
initial();