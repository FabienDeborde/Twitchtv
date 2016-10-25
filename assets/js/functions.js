$(document).ready(function() {

  twitchQuery();

  function twitchQuery(){
    //Variable to store element
    var queryMsgEl = $('p#queryMsg');
    var errorMsgEl = $('p#errorMsg');
    var streamsContainerEl = $('.streamsContainer');

    // Variables to store all the data
      totalMsg = '';
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
      // Variable to store element of the query url
      var category = ['users', 'streams', 'channels'];
      var name = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];

    // Add the templated messages, toggle the +/- button, change the camera icon color
    function createContent(){
      // basicInfo template
      var infoMsg = '<div class="basicInfos">'
      infoMsg += '<div class="logo"><img src="' + logo + '" alt="Logo of ' + userName + '"/></div>';
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
      var streamContainerMsg = '<div class="streamContainer">' + infoMsg + streamingMsg + '</div>';

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
      $('.moreInfo').unbind("click").on('click', function(){
        // Target the children octicon + and - and toggle the hide class
        $(this).children('.octicon-plus').toggleClass('hide');
        $(this).children('.octicon-dash').toggleClass('hide');
        // Target the streaming container (by getting the streamContainer parent then children streamingContainer of the clicked button) and slideToggle it
        var streamingContainer = $(this).parents('div.streamContainer').children('.streamingContainer');
        // Toggle and slide the streaming container*/
        streamingContainer.slideToggle(500);
      })
      return streamContainerMsg;
    }

    function querySuccess(data, queryName){
      // Show/Hide the container
      if(streamsContainerEl.hasClass('hide')){
        streamsContainerEl.removeClass('hide').hide().fadeIn(1000);
      }
      // Get the data from the users endpoint
      userName = data.display_name;
      bio = data.bio;
      logo = data.logo;

      // Get the data from the streams endpoint
      $.ajax({
        method: 'GET',
        url: 'https://api.twitch.tv/kraken/' + category[1] + '/' + queryName + '?client_id=nlub2puh9ouq02ssgkc5oem66rw14ty',
        dataType: 'jsonp',
        timeout: 2000,
        success: function(data){
          // Check if there is a stream object if there is none
          if (data.stream === null) {
            streamStatus = false;
            // Get the data from the channels endpoint
            $.getJSON('https://api.twitch.tv/kraken/' + category[2] + '/' + queryName + '?client_id=nlub2puh9ouq02ssgkc5oem66rw14ty&callback=?').done(function(data) {
              views = data.views;
              followers = data.followers;
              video_banner = data.video_banner;
              url = data.url;
              createContent(); // Call the content creating function
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
            createContent(); // Call the content creating function
          } // end of else
        } // end of success
      }) // end of ajax()
    }

    // Prepare the function to query the data
    function queryData(queryName){
      $.ajax({
        method: "GET",
        url: 'https://api.twitch.tv/kraken/' + category[0] + '/' + queryName + '?client_id=nlub2puh9ouq02ssgkc5oem66rw14ty',
        dataType:'jsonp',
        async: false,
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
          querySuccess(data, queryName);
        } // end of success()
      }) // end of $.ajax()
    }

  /*  function insertData(streamContainerMsg){
      totalMsg += streamContainerMsg;
      streamsContainerEl.html(totalMsg);
    }
*/
  /*
   // Loop through all names in the array and
    for (var i = 0; i < name.length-5; i += 1) {
      queryData(name[i]);
    }
*/

  queryData(name[0]);
  queryData(name[1]);



  //setInterval(function(){queryData('freecodecamp')}, 5000);
  //setInterval(function(){ console.log("Hello"); }, 5000);

  } // end of twitchQuery()
}); // End of ready()
