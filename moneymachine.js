//price counting script
const moneymachine = {
	e : {
		cart : document.getElementById("cart"),
		total : document.getElementById("total")
	},
	//cart should hold IDs from elements!
	cart: [],
	//subtotal is the sum of parts with action "add"
	subtotal: 0,
	//total is the subtotal plus parts with action "percent"
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
			"action" : "percent",
			"type"   : "range",
			"min" : 0.00,
			"max" : 0.20
		}
	}
}

//to run on page load
console.log(prices);
//setPrice('digital', 'shading', 'simple');
setPrices();

function setPrices() {
	//digital
	setDigitalPrices();
}

function setDigitalPrices() {
	/*const categories = ['base', 'lineart', 'shading', 'backgrounds'];
	for (c of categories) {
		setPrice('digital',c);
	}*/
	
	//base
	//setPrice('digital', 'base', 'bust');
	//setPrice('digital', 'base', 'halfbody');
	//setPrice('digital', 'base', 'fullbody');
	//loops through the digital categories like 'base' and 'lineart'
	for (category in prices['digital']) {
		//loops through the items under that category
		for (value in prices['digital'][category]) {
			setPrice('digital', category, value);
		}
	}
}

function setPrice(artType, category, value) {
	if (document.getElementById(category + "-" + value) == null) {
		//skip over invalid values
		return;
	}
	document.getElementById(category + "-" + value).innerHTML = prices[artType][category][value];
}

//Returns the price of the selected item by looking it up from the price object
function getPrice(id) {
	const category = id.substr(0, id.indexOf('-'));
	const value = id.substr(id.indexOf('-') + 1);

	return prices['digital'][category][value];
}

//Returns the percentage value of this fee.
function getPercent(category) {
	const feeType = prices['digital'][category]['type'];

	if (feeType == 'range') {
		//calculate based on the maximum value for now, to make quotes less of a hassle
		return prices['digital'][id]['max'];
	}
	else {
		return prices['digital'][id]['value'];
	}
}

//Returns the price of this fee based on the subtotal. Should only be called once the subtotal is finalized.
function calculateFee(id) {
	return subtotal * getPrice(id);
}

//Returns the action (add or percent) of the given item by looking it up from the price object
function getAction(id) {
	const category = id.substr(0, id.indexOf('-'));
	return prices['digital'][category]['action'];
}

//Creates a friendly name for the item.
function getFriendlyName(id) {
	var category = id.substr(0, id.indexOf('-'));
	var value = id.substr(id.indexOf('-') + 1);

	if (category == "base") {
		//for base values, swap "base" for the level of finish to expect. For me that is "flatcolor"
		category = "flatcolor";
	}
	else if (category == "complexdesign") {
		//for complexdesign we want to split it into two words! also, it doesn't have a 'value', so let's just return it as is.
		return "complex design fee";
	}
	else if (category == "backgrounds") {
		//for backgrounds we remove the s
		category = "background";
	}

	if (value == "fullrender") {
		value = "fully rendered";
	}
	
	//otherwise, assume we can use the category and value
	return value + " " + category;
}

//Adds the selected item to the cart. If there is a matching category item already, it will remove it.
function addToCart(id) {
	//remove matching category items from cart
	moneymachine.cart = moneymachine.cart.filter(item => !item.includes(id.substr(0, id.indexOf('-'))));
	//add selected item to cart
	moneymachine.cart.push(id);
}

//Counts up the cart, and updates the elements to verify work.
function quote() {
	//create counting templates
	const quoteAdd = [];
	const quotePercent = [];

	//first, get our subtotal!
	for (item of moneymachine.cart) {
		if (getAction(item) == "add") {
			moneymachine.subtotal += getPrice(item);
			//pushes an array of 2 values like this: ["friendly name", "$.$$"]
			quoteAdd.push([getFriendlyName(item), getPrice(item)]);
		}
	}

	//now, count up our fees!
	for (item of moneymachine.cart) {
		if (getAction(item) == "percent") {
			moneymachine.total += calculateFee(item);
			//pushes an array of 3 values like this ["%.%%", "friendly name", "$.$$"]
			quotePercent.push([getPercent(item), getFriendlyName(item), calculateFee(item)]);
		}
	}

	//assemble counting strings
	var subtotalProof = "";
	for (line of quoteAdd) {
		//Friendlyname and price should be on opposite sides, seperated by a dotted line.
		subtotalProof += `<div class="quote-line"><span>${line[0]}</span><span>$${line[1]}</span></div>`;
	}
	var feesProof = "";
	for (line of quotePercent) {
		//% and friendlyname should be close together, no space between. Otherwise, same as above.
		feesProof += `<div class="quote-line"><span>${line[0]}% </span><span>${line[1]}</span><span>$${line[2]}</span></div>`;
	}

	//format entire innerHTML
	const proof = `<div class="quote-line">
	<span>Subtotal:</span>
	<span>$${moneymachine.subtotal}</span>
</div>
<div>${subtotalProof}</div>
<div class="quote-line">
	<span>Total:</span>
	<span>$${moneymachine.total}</span>
</div>
<div>${feesProof}</div>`

	moneymachine.e.total.innerHTML = proof;

	console.log("Calculated quote estimate");
}

/* ADDON/FEE TYPES
 * 
 * the "add" type is for basic addons such as lineart upgrades, shading, or backgrounds.
 * The value will be added onto the base as part of the subtotal.
 * 
 * the "percent" type will be for things that take a percentage of the subtotal
 * (before any "percent" values are applied), and add that percentage of the subtotal on to the total.
 * Percent types should not be added onto the subtotal.
*/