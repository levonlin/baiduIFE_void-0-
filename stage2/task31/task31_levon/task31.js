var CAMPUS = {
	"北京": ["北京大学", "清华大学", "人大"],
	"上海": ["复旦", "上交"],
	"南京": ["南大", "南邮"]
};

function delegateEvent(delegateElement, targetTag, eventName, handler) {
	delegateElement.addEventListener(eventName, function (event) {
		var target = event.target;
		if (target.tagName.toLowerCase() === targetTag.toLowerCase()) {
			return handler(event);
		}
	} ,false);
}

function buildSubSelect(parentSelect, data) {
	var subSelect = document.createElement('select');
	var subSelectOptions = data[parentSelect.value];
	for (var i = 0; i < subSelectOptions.length; i++) {
		subSelect.add(new Option(subSelectOptions[i], subSelectOptions[i]));
	}
	parentSelect.addEventListener('change', function(e) {
		subSelect.options.length = 0;
		var subSelectOptions = data[parentSelect.value];
		for (var i = 0; i < subSelectOptions.length; i++) {
			subSelect.add(new Option(subSelectOptions[i], subSelectOptions[i]));
		}
	});
	return subSelect;
}

function renderCampusSelect(select) {
	select.innerHTML = '';
	var citySelect = document.createElement('select');
	for(var city in CAMPUS) {
		citySelect.add(new Option(city, city));
	}
	var campusSelect = buildSubSelect(citySelect, CAMPUS);
	select.appendChild(citySelect);
	select.appendChild(campusSelect);
}

function renderWorkPlaceSelect(select) {
	select.innerHTML = '';
	var workPlaceInput = document.createElement('input');
	workPlaceInput.type = 'text';
	workPlaceInput.name = 'workplace';
	select.appendChild(workPlaceInput);
}

function renderPlaceOption(status) {
	var placeOption = careerForm.getElementsByClassName('place')[0];
	var label = placeOption.getElementsByTagName('label')[0];
	var select = placeOption.getElementsByClassName('select')[0];
	switch (status) {
		case 'student': 
		label.textContent = '学校';
		renderCampusSelect(select);
		break;

		case 'not-student': 
		label.textContent = '就业单位';
		renderWorkPlaceSelect(select);
		break;
	}
}

var careerForm = document.getElementsByClassName('career-form')[0];
var statusOption = careerForm.getElementsByClassName('status')[0];

delegateEvent(statusOption, 'input', 'change', function (event) {
	var target = event.target;
	renderPlaceOption(target.value);
});
