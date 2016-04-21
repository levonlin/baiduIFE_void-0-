var currentRadioState = "student";
var currentSelectCity = "北京";
var cityandSchoolInfo = {
	"北京":["北京大学","清华大学","北京邮电大学","北京理工大学","华北电力大学","中国人民大学"],
	"上海":["上海交通大学","复旦大学","上海财经大学","同济大学"],
	"南京":["南京大学","东南大学","中国药科大学"],
	"广州":["中山大学","华南理工大学","暨南大学","广东外语外贸大学","广东工业大学","华南师范大学","华南农业大学"],
	"西安":["西安交通大学","西北工业大学","西安电子科技大学","西安邮电大学","西北大学"],
	"武汉":["武汉大学","华中科技大学"]
};
/*初始化单选框*/
function initialRadioes() {
	var studentForm = document.getElementById("studentForm"),
		notStudentForm = document.getElementById("notStudentForm");
	document.getElementById("student").onclick = function() {
		if(currentRadioState !== "student") {
			studentForm.style.display = "block";
			notStudentForm.style.display = "none";
			currentRadioState = "student";
		}
	};
	document.getElementById("notStudent").onclick = function() {
		if(currentRadioState !== "notStudent") {
			studentForm.style.display = "none";
			notStudentForm.style.display = "block";
			currentRadioState = "notStudent";
		}
	};
}
/*初始化下拉列表*/
function initialSelect() {
	var citySelect = document.getElementById("city"),
		schoolSelect = document.getElementById("school"),
		cityOption,schoolOption,school;
	/*进行初始化，将初始选项“北京”和“北京大学”作为默认选中的状态*/
	/*将cityandSchoolInfo中所有的城市填充到下拉列表中*/
	for(var city in cityandSchoolInfo) {
		cityOption = document.createElement("option");
		if (city === "北京") {
			cityOption.selected = "selected";
		}
		cityOption.innerHTML = city;
		cityOption.value = city;
		citySelect.appendChild(cityOption);
	}
	/*将北京所有的学校填充到学校的下拉列表中，这是初始状态*/
	for (var i = 0; i < cityandSchoolInfo[currentSelectCity].length; i++) {
		school = cityandSchoolInfo[currentSelectCity][i];
		schoolOption = document.createElement("option");
		schoolOption.innerHTML = school;
		if (school === "北京大学") {
			schoolOption.selected = "selected";
		}
		schoolOption.value = school;
		schoolSelect.appendChild(schoolOption);
	}

	var cityOptions = citySelect.childNodes;
	citySelect.onchange = function() {
		/*在城市下拉列表中找到当前选中的城市*/
		for (var i = 0; i < cityOptions.length; i++) {
			if(cityOptions[i].nodeType === 1) {
				if (cityOptions[i].selected) {
					currentSelectCity = cityOptions[i].value;
					break;
				}
			}
		}
		/*将学校列表内容清空*/
		schoolSelect.innerHTML = "";
		/*将用户选中的城市对应的所有学校填充到学校列表中，并将第一所学校设置为默认选中状态*/
		for (var j = 0; j < cityandSchoolInfo[currentSelectCity].length; j++) {
			school = cityandSchoolInfo[currentSelectCity][j];
			schoolOption = document.createElement("option");
			schoolOption.innerHTML = school;
			if (j === 0) {
				schoolOption.selected = "selected";
			}
			schoolOption.value = school;
			schoolSelect.appendChild(schoolOption);
		}
	};
}
/*整体初始化*/
function initial() {
	initialRadioes();
	initialSelect();
}

initial();