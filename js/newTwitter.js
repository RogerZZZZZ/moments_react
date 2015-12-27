$('#submitBtn').on('click', function(){
	ajaxLoc({
		url: window.ipAddress + ':8080/avmoments/addmoments?username='+window.username+'&time='+(new Date()).getTime()+'&content='+$('#twitterInput').val()+'&image=123',
		success:function(rst){
			console.log(rst);
		}
	});
});