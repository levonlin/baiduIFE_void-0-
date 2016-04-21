function checkName() {
	var resultP = document.getElementById("nameCheckResult"),
		name = document.getElementById("name").value.trim();

	var chinese = /[\u4E00-\u9FA5|，|。|？|、|；|：|“|”|‘|’|》|《|｛|｝|【|】|！|￥|……|（|）|——|·]/gi,
		ch_wordsNum = 0;

	while(chinese.test(name)){
		ch_wordsNum++;
	}
	if (name.length + ch_wordsNum < 4 || name.length + ch_wordsNum > 16) {
		resultP.innerHTML = "姓名长度必须在4-16位之间";
		resultP.style.color = "red";
	} else {
		resultP.innerHTML = "姓名格式正确！";
		resultP.style.color = "green";
	}
}
function initial() {

	document.getElementById("checkName").onclick = checkName;

}

initial();