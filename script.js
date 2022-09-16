var siteTheme = "default";

function siteIsHighContrast() {
	return siteTheme == "highContrast";
}

//COOKIE HANDLING
const cookies = document.cookie;

//Sets the siteTheme cookie
function setThemePreference(theme = siteTheme) {
	document.cookie = "siteTheme="+siteTheme+"; SameSite=Strict; path=/";
}

//Returns: string siteTheme
function checkThemePreference() {
	//check for new cookie
	if (cookies.includes("siteTheme")) {
		var cookieValue=cookies.substring(cookies.indexOf("siteTheme=")+"siteTheme".length+1);
		if(cookieValue.indexOf(";") !== -1) {
			cookieValue=cookieValue.substring(0,cookieValue.indexOf(";"))
		}
		
		//check for expected values
		if (cookieValue == "default" || cookieValue == "highContrast") {
			return cookieValue;
		} else {
			//it's something we don't support
			return "default";
		}
	}
	//check for old cookie
	else if (cookies.includes("siteIsHighContrast")) {
		//we have an old cookie, so now we extract the value and return it
		const cookieValue=cookies.substring(cookies.indexOf("siteIsHighContrast")+"siteIsHighContrast".length+1,cookies.indexOf(";"));
		if (cookieValue == "true") {
			return "highContrast";
		} else {
			return "default";
		}
	} else {
		//the cookie does not exist yet
		setThemePreference("default");
		return "default";
	}
}

const themeDefault = {
	name: "default",
	
	header_fill : "#fff",
	pagecontainer_fill : "#ffffffc0",
	
	dropdown_fill: "#ffffff00",
	dropdownselected_fill: "#ffffffa0",
	
	textcolor: "#000",
	acolor: "#50f",
	ahover: "#b4f",
	warn_text: "#d32"
}

const themeBlue = {
	name: "default_blue",
	
	header_fill : "#fff",
	pagecontainer_fill : "#ffffffc0",
	
	dropdown_fill: "#ffffff00",
	dropdownselected_fill: "#ffffffc0",
	
	textcolor: "#000",
	acolor: "#00f",
	ahover: "#08f",
	warn_text: "#c30"
}

const themeHighContrast = {
	name: "highContrast",
	
	header_fill : "#fff",
	pagecontainer_fill : "#e3daea",
	
	dropdown_fill: "#ffffff00",
	dropdownselected_fill: "#ffffffff",
	
	textcolor: "#000",
	acolor: "#50f",
	ahover: "#b4f",
	warn_text: "#d32"
}

const r = document.querySelector(':root');
const themebutton = document.getElementById('theme-button');

//put the site into high contrast mode and REMEMBER IT!!
function toggleHighContrast() {
	if (siteIsHighContrast()) {
		//site is high contrast already, we are turning it off.
		setTheme(themeDefault, "improve visibility");
		
	} else {
		//we are making site high contrast
		setTheme(themeHighContrast, "reset to default");
	}
}

//Parameters: object themeObject, string buttonText
function setTheme(themeObject = themeDefault, buttonText = "reset to default") {
	//set siteTheme variable
	siteTheme = themeObject.name;
	
	r.style.setProperty('--header_fill',        themeObject.header_fill);
	r.style.setProperty('--pagecontainer_fill', themeObject.pagecontainer_fill);
	
	r.style.setProperty('--dropdown_fill',         themeObject.dropdown_fill);
	r.style.setProperty('--dropdownselected_fill', themeObject.dropdownselected_fill);
	
	r.style.setProperty('--textcolor', themeObject.textcolor);
	r.style.setProperty('--acolor',    themeObject.acolor);
	r.style.setProperty('--ahover',    themeObject.ahover);
	r.style.setProperty('--warn_text', themeObject.warn_text);
	
	themebutton.innerHTML = buttonText;
	setThemePreference(themeObject.name);
}

//on load
function loadTheme() {
	siteTheme = checkThemePreference();
	if (siteIsHighContrast()) {
		setTheme(themeHighContrast, "reset to default");
	} else {
		setTheme(themeDefault, "improve visibility");
	}
}


/*END THEME STUFF!!*/

//assumes that the child is a div containing the contents with id divId-content
function confirmView(divId) {
	//confirm first
	if (!confirm("Are you 18+ and OK with viewing mature content?")) {
		//confirm returns true if user clicks OK, false otherwise. so if false we just stop running the script
		console.log('contents of '+divId+' not shown');
		return;
	}
	//implied else due to the return statement
	
	document.getElementById(divId+"-content").style.display = "block";
	//contents.style.display = 'block';
	
	console.log('contents of '+divId+' shown');
}

//lock open a dropdown
function toggleSelected(divId) {
	document.getElementById(divId).classList.toggle('selected');
}

//show/hide dropdowns
//target = addition to the divId we should add if it's not 'header'
function showHide(divId, target = 'header') {
	toggleSelected(divId);
	//find out whether this is expanded or not
	if (document.getElementById(divId).classList.contains('selected')) {
		//this element is selected therefore we are expanded and the brackets should say 'hide'
		editBracketContent(divId + '-' + target, "hide");
	} else {
		editBracketContent(divId + '-' + target, "show");
	}
}

//edit bracket content in an element!
function editBracketContent(elementId, str = "null") {
	const textElement = document.getElementById(elementId);
	const openBracketIndex = textElement.innerHTML.indexOf('[');
	var content = textElement.innerHTML.substring(0, openBracketIndex+1);
	
	textElement.innerHTML = content + str + ']</button>';
	
}

//filter functionality!
const filterMenu = document.getElementById('filter-menu');

//filters page content (by either collapsing or hiding it) based on the passed in attribute.
//param targetClass: string of the class we would be showing or hiding based on the filter
//param targetAttr: when this attribute is present we show its parent targetClass!
//NOTE: attributes are expected to be COMMA SEPERATED.
//param category: if applicable, the category this searches for
function filter(targetClass, targetAttr = "null") {
	//gather all targets
	const targetsToCheck = document.getElementsByClassName(targetClass);
	
	//if there are none, print an error
	if (isNaN(targetsToCheck.length) || targetsToCheck.length <= 0) {
		console.log("filtering failed. reason: could not find any members of class "+targetClass);
	}
	
	//if targetAttr is null or not given we assume we are to reset the filter
	else if (targetAttr == "null") {
		for (var i = 0; i < targetsToCheck.length; i++) {
			show(targetsToCheck[i]);
		}
	}
	
	//else we assume we are filtering
	else {
		for (var i = 0; i < targetsToCheck.length; i++) {
			var matchFound = false;
			const attr = targetsToCheck[i].getElementsByTagName('input')[0].value.split(',');
			//loop through the attributes/tags looking for our desired one
			for (var a in attr) {
				//if a match is found we show it, mark matchFound true, and stop looping
				if (attr[a] == targetAttr) {
					show(targetsToCheck[i]);
					matchFound = true;
					break;
				}
			}
			//we didn't find a match for this one
			if (!matchFound) {
				hide(targetsToCheck[i]);
			}
		}
	}
}

//SHOW AND HIDE METHODS. unrelated to showHide(). semi-ripped from my bayartcounter v2 (as in, they are basically the same but i copied from memory instead of with ctrl-c) but i mean it's MY code so literally who cares lol...
//param elmnt: HTML DOM element, NOT an id.
//param d: string, display type when shown. defaults to 'flex'
function show(elmnt, d = "flex") {
	elmnt.style.display = d;
}

function hide(elmnt) {
	elmnt.style.display = "none";
}