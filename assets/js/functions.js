$(document).ready(function() {
  //Variable to store element
  var queryMsgEl = $('p#queryMsg');
  var errorMsgEl = $('p#errorMsg');
  var streamsContainerEl = $('.streamsContainer');

  // Variables to store all the data
    var id = '';
    // User related data
    var userName = '';
    var bio = '';
    var logo = '';
    // Channel related data
    var streamStatus = '';
    var views = '';
    var followers = '';
    var video_banner = '';
    var url = '';
    // Stream related data
    var viewers = '';
    var game = '';
    var status = '';

  // Add the templated messages, toggle the +/- button, change the camera icon color
  function updateContent(id){
    // basicInfo template
    var infoMsg = '<div class="basicInfos">'
    infoMsg += '<div class="logo"><img src="' + logo + '" alt="Logo of' + userName + '"/></div>';
    infoMsg += '<div class="infos"><h2 class="userName">' + userName + '</h2><p class="bio">' + bio + '</p><div class="icons" title="Total Views"><div class="views"><span class="octicon octicon-eye"> </span><span>' + views + '</span></div>';
    infoMsg += '<div class="followers" title="Followers"> <span class="octicon octicon-person"></span><span>' + followers + '</span></div></div></div>';
    infoMsg += '<div class="status"><div class="indicator"><span class="octicon octicon-device-camera-video"></span></div> ';
    infoMsg += '<div class="moreInfo"><span class="octicon octicon-plus"></span><span class="octicon octicon-dash hide"></span></div></div></div>';

    // streamingContainer template
    var streamingMsg = '<div class="streamingContainer">'
    streamingMsg += '<hr>';
    streamingMsg += '<div class="streaming"><div class="banner"><img src="' + video_banner + '" alt="Video banner of "' + userName + '"/></div>';
    streamingMsg += '<div class="streamInfos"><h4 class="statusName">' + status + '</h4>';
    streamingMsg += '<p class="game">' + game + '</p>';
    streamingMsg += '<div class="viewers" title="Viewers"> <span class="octicon octicon-octoface"></span> <span> ' + viewers + ' </span></div>';
    streamingMsg += '</div></div></div></div>';

    // streamContainer template
    var streamContainerMsg = '<div class="streamContainer" id="' + id + '" >' + infoMsg + streamingMsg + '</div>';

    streamsContainerEl.append(streamContainerMsg);

      // Change the octicon-device-camera-video color
    changeColor();
    function changeColor(){
      var cameraIcon = $('.octicon-device-camera-video');
      if (streamStatus === true) {
        cameraIcon.removeClass('offline online');
        cameraIcon.addClass('online');
      } else {
        cameraIcon.removeClass('offline online');
        cameraIcon.addClass('offline');
      }
    }

    // Toggle the Streaming Container and the +/- button
    $('.moreInfo').on('click', function(){
      console.log($(this).parents('.streamContainer'));
    })

  }

  // Variable to store element of the query url
  var category = ['users', 'streams', 'channels'];
  var name = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin"];


  // Prepare the function to query the data
  function queryData(name, id){
    id = id;
    $.ajax({
      method: "GET",
      url: 'https://api.twitch.tv/kraken/' + category[0] + '/' + name + '?client_id=nlub2puh9ouq02ssgkc5oem66rw14ty',
      dataType:'jsonp',
      timeout: 2000,
      beforeSend: function(){
        queryMsgEl.text("Fetching data, please wait...");
      },
      error: function(data){
        errorMsgEl.text('An error occured while trying to fetch data. Please try again later.');
      },
      complete: function(){
        queryMsgEl.text('');
      },
      success: function(data){
        // Show the container
        $('.streamsContainer').removeClass('hide');
        // Get the data from the users endpoint
        userName = data.display_name;
        bio = data.bio;
        logo = data.logo;

        // Get the data from the streams endpoint
        $.getJSON('https://api.twitch.tv/kraken/' + category[1] + '/' + name + '?client_id=nlub2puh9ouq02ssgkc5oem66rw14ty&callback=?', function(data) {
          // Check if there is a stream object if there is none
          if (data.stream === null) {
            streamStatus = false;
            // Get the data from the channels endpoint
            $.getJSON('https://api.twitch.tv/kraken/' + category[2] + '/' + name + '?client_id=nlub2puh9ouq02ssgkc5oem66rw14ty&callback=?', function(data) {
              views = data.views;
              followers = data.followers;
              video_banner = data.video_banner;
              url = data.url;
              updateContent(); // Call the content update function
            }) // end of $.getJSON()
          // If there is a streaming object
          } else {
            // Stay in the streams endpoint and fetch the data
            streamStatus = true;
            viewers = data.stream.viewers;
            game = data.stream.game;
            video_banner = data.stream.preview.medium;
            views = data.stream.channel.views;
            followers = data.stream.channel.followers;
            url = data.stream.channel.url;
            status = data.stream.channel.status;
            updateContent(id);
          } // end of else
        }); // end of $.getJSON()
      } // end of success()
    }) // end of $.ajax()
  }

queryData(name[0], '0');
queryData(name[0], '1');
queryData(name[0], '2');
queryData(name[0], '3');
queryData(name[0], '4');
queryData(name[0], '5');
queryData(name[0], '6');
queryData(name[0], '7');


}); // End of ready()

/*
// target the basicInfos container of the clicked button
var streamContainer = $(this).parents('div.streamContainer');
var parentID = streamContainer.attr('id');
var streamingContainer = streamContainer.children('.streamingContainer');
streamingContainer.slideToggle(500); // Toggle and slide the streaming container*/
