/**!
 Date: 2015-12-30 16:40 
*/
!function(){$("#submitBtn").on("click",function(){""==$(".filelist").text()&&""!=$("#twitterInput").val()?ajaxLoc({url:window.ipAddress+":8080/avmoments/addmoments?username="+window.username+"&time="+(new Date).getTime()+"&content="+$("#twitterInput").val()+"&image=&tempimage=",success:function(a){window.location.reload()},error:function(a){console.log(a)}}):""!=$(".filelist").text()&&""!=$("#twitterInput").val()&&$(".uploadBtn").click()})}();