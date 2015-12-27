(function() {
    $('#submitBtn').on('click', function() {
        if ($('.filelist').text() == '' && $('#twitterInput').val() != '') {
            ajaxLoc({
                url: window.ipAddress + ':8080/avmoments/addmoments?username=' + window.username + '&time=' + (new Date()).getTime() + '&content=' + $('#twitterInput').val() + '&image=&tempimage=',
                success: function(rst) {
                    window.location.reload();
                },
                error: function(e) {
                    console.log(e);
                }
            });
        } else if($('.filelist').text() != '' && $('#twitterInput').val() != ''){
            $('.uploadBtn').click();
        }
    });
})()