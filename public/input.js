
$(function () {

//ADDING OPTIONS:this click option works to render the button which gives you more options
    $("#add").click(function () {
        var fieldWrapper = $(' <label>Added Option:</label>');
        var fName = $(' <div class="input-group"> <input name="choice" type="text" class="form-control" >');
        var removeButton = $('<span class="input-group-btn"><button type="button" class="remove btn btn-danger" value= "x">x</button></span></div>');
        removeButton.click(function () {
            $(this).parent().parent().remove();
        });
         fieldWrapper.append(fName);
         fName.append(removeButton);
        $("#addpost").append(fieldWrapper);
    });

//VOTING RADIO BUTTON ACTION
    $("#btnVote").click(function () {
        var selected = $(".clsAnswer:checked");
        // var tested = this.attributes.id.baseURI;   //Gets the url from where the button click came from.
        // var lastPart = tested.split("/").pop();   //Isolates the poll.id to be sent out.
        if (!selected.val()) {
            alert("No Choice Was Made!");
        }
        else {
            var optionName = $('input[type=radio][name=Answer]:checked').attr('id');
            var selectedValue = selected.val();
            selectedValue = parseInt(selectedValue);
             //alert("Value: " + selectedValue + "  " + optionName);
            $.ajax({
                type: 'POST',
                url: '/vote/:id',
                dataType:'json',
                data: {'option': optionName, 'value':selectedValue},
                success: function(data){
                    alert(data);
                }
            });
            window.location.href = "/admin/polls";
        }
    });

//CHART DISPLAY
    $("#chartDisplay").click(function () {
        var selected = $(".clsAnswer:checked");
        var optionName = $('input[type=radio][name=Answer]:checked').attr('id');
        var selectedValue = selected.val();
    });

//URL SHORTEN: event listener added for url shortening clicks
    $('.btn-shorten').click(function(){
        var selected = $(".clsAnswer:checked");
        var selectedValue = selected.val();
        $.ajax({
            type: 'POST',
            url: '/shorten/api/shorten',  //Might need '/shorten/api/shorten'
            dataType: 'json',
            data: {url: selectedValue },
            success: function(data){
                // display the shortened URL to the user that is returned by the server
                var resultHTML = '<a class="result" href="' + data.shortUrl + '">'
                    + data.shortUrl + '</a>';
                $('#link').html(resultHTML);
                $('#link').hide().fadeIn('slow');

            }
        })
    });



});