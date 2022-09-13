var siteTheme;

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
		
		console.log(cookieValue);
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
	
	header_fill : "#ffffffff",
	pagecontainer_fill : "#ffffffc0",
	
	dropdown_fill: "#ffffff00",
	dropdownselected_fill: "#ffffffc0",
	
	textcolor: "#000000",
	acolor: "#0000ff",
	ahover: "#0088ff",
	warn_text: "#cc3300"
}

const themeHighContrast = {
	name: "highContrast",
	
	header_fill : "#ffffffff",
	pagecontainer_fill : "#ddddddff",
	
	dropdown_fill: "#ffffff00",
	dropdownselected_fill: "#ffffffff",
	
	textcolor: "#000000",
	acolor: "#0000ff",
	ahover: "#0088ff",
	warn_text: "#aa3300"
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
	console.log(checkThemePreference());
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
function showHide(divId) {
	toggleSelected(divId);
	//find out whether this is expanded or not
	if (document.getElementById(divId).classList.contains('selected')) {
		//this element is selected therefore we are expanded and the brackets should say 'hide'
		editBracketContent(divId+'-header', "hide");
	} else {
		editBracketContent(divId+'-header', "show");
	}
}

//edit bracket content in an element!
function editBracketContent(elementId, str = "null") {
	const textElement = document.getElementById(elementId);
	const openBracketIndex = textElement.innerHTML.indexOf('[');
	var content = textElement.innerHTML.substring(0, openBracketIndex+1);
	
	textElement.innerHTML = content + str + ']</button>';
	
}