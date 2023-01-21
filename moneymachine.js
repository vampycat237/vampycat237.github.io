//price counting script
const moneymachine = {
	e : {
		cart : document.getElementById("cart"),
		total : document.getElementById("total")
	},
	cart : [],
	total : 0
}

const prices = {
	"digital" : {
		"base" : {
			"action"   : "add",
			"bust"     : 20,
			"halfbody" : 30,
			"fullbody" : 50
		},
		"lineart" : {
			"action"      : "add",
			"fuzzy"       : 0,
			"cleansketch" : 0,
			"scratchy"    : 5,
			"tidy"        : 10
		},
		"shading" : {
			"action" : "add",
			"simple" : 10,
			"fullrender" : 35
		},
		"backgrounds" : {
			"action"  : "add",
			"simple"  : 0,
			"medium"  : 35,
			"complex" : 65
		},
		"complexdesign" : {
			"action" : "multiply",
			"type"   : "range",
			"min" : 0.00,
			"max" : 0.20
		}
	}
}

//to run on page load
console.log(prices.digital.shading);
setPrice('digital', 'shading', 'simple');

function setPrices() {
	//digital
	setPrice
}

function setDigitalPrices() {
	/*const categories = ['base', 'lineart', 'shading', 'backgrounds'];
	for (c of categories) {
		setPrice('digital',c);
	}*/
	
	//base
	setPrice('digital', 'base', 'bust');
	setPrice('digital', 'base', 'halfbody');
	setPrice('digital', 'base', 'fullbody');
	//others to come but probably not like this. this is wacky
}

function setPrice(artType, category, value) {
	document.getElementById(category + "-" + value).innerHTML = prices[artType][category][value];
}

function quote() {
	console.log("Calculated quote estimate");
}