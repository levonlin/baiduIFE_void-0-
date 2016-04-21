function initial() {
	document.getElementById("execute").onclick = function() {
		clearTimeout(timer);
		switch(document.getElementById("command").value) {
			case "TUN LEF" :
				turnLeft();
				break;

			case "TUN RIG" :
				turnRight();
				break;

			case "TUN BAC" :
				turnBack();
				break;

			case "GO" :
				goForward();
				break;

			case "TRA LEF" :
				goForward("left");
				break;

			case "TRA TOP" :
				goForward("up");
				break;

			case "TRA RIG" :
				goForward("right");
				break;

			case "TRA BOT" :
				goForward("down");
				break;

			case "MOV LEF" :
				moveToDirection("left");
				timer = setTimeout(function() {
					goForward();
				},500);
				break;

			case "MOV TOP" :
				moveToDirection("up");
				timer = setTimeout(function() {
					goForward();
				},500);
				break;

			case "MOV RIG" :
				moveToDirection("right");
				timer = setTimeout(function() {
					goForward();
				},500);
				break;

			case "MOV BOT" :
				moveToDirection("down");
				timer = setTimeout(function() {
					goForward();
				},500);
				break;

			default:
				executeResult.innerHTML = "指令不存在！";
				executeResult.style.color = "red";
				break;
		}
	};
}

var currentState = "up",
	target = document.getElementById("target"),
	targetHeader = document.getElementById("targetHeader"),
	targetBody = document.getElementById("targetBody"),
	executeResult = document.getElementById("executeResult"),
	rotateAngle = 0,
	timer;

function goForward(state) {
	switch(state||currentState) {
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
	return true;
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