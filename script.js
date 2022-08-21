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