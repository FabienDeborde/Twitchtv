$(document).ready(function() {
  // Stuff to do as soon as the DOM is ready

  //Variable to store element
  var $queryMsg = $('p#queryMsg');
  var $userName  = $('.userName');
  var $bio  = $('.bio');
  var $logo  = $('.logo');
  var $status  = $('.status');
  var $views  = $('.views');
  var $followers  = $('.followers');
  var $game  = $('.game');
  var $viewers  = $('.viewers');
  var $preview  = $('.preview');





  $.ajax({
    method: "GET",
    url: "https://wind-bow.hyperdev.space/twitch-api/streams/superplay",
    dataType:'jsonp',
    timeout: 2000,
    beforeSend: function(){
      $queryMsg.text("Fetching data, please wait...");
    },
    complete: function(){
      $queryMsg.text('');
    },
    success: function(data){
      console.log(data);
      




    },
    error: function(data){
      $queryMsg.html('<p class="error">An error occured while trying to fetch data. Please try again later.</p>')
    }




  })





});
