// Content Script for Restore Link
if(window.document.getElementById("restoreLink") != null) {

    window.document.getElementById("restoreLink").addEventListener("click", function addModal() {
	
	//fire message for impression link clicked
	chrome.extension.sendRequest("linkClicked", function (response_str) {  });
	
    var modal = window.document.getElementById("disableModal");
    var span = window.document.getElementById("close");
    var yes = window.document.getElementById("yes");
    var no = window.document.getElementById("no");
    modal.style.display = "block";
    
    //hits 'x'
    span.onclick = function () {
        modal.style.display = "none";
    }

    //hits no
    no.onclick = function () {
        modal.style.display = "none";
    }

    //clicks out of modal
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    //hits yes on modal so sends request
    yes.onclick = function () {
        modal.style.display = "none";        
        //sends request to disable sends to background.js pg
        chrome.extension.sendRequest("restored", function (response_str) {  }); 
    }
});
}


