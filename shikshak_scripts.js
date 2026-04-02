
/* --- Script --- */



var url = 'https://gamerxyt.com/hubcloud.php?host=hubcloud&id=00ivf1b1ej39wmc&token=QWpobmlIMm05eEV3TzdUTzVmT3RhcDFNdEEySnlNRmwwQmRqUTI0TG84RT0=';

setTimeout(function(){
document.querySelector(".loading").classList.add("d-none");
document.querySelector(".vd").classList.remove("d-none");
if (!document.cookie.split(';').some(item => item.trim().startsWith('xlax='))) {
    stck('xlax',"s4t",1440);
    window.location.href = url;
}
}, 2000);  


var download = document.getElementById('download');
download.onclick = function() {
    if (this.classList.contains('disabled')) {
        event.preventDefault();
        return;
    } 
    window.location.href = url;
	download.classList.add('disabled');
	setTimeout(function() {
		download.classList.remove('disabled');
	}, 6000);
}
