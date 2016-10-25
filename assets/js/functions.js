$(document).ready(function() {
  //Variable to store element
  var queryMsgEl = $('p#queryMsg');
  var errorMsgEl = $('p#errorMsg');
  var streamsContainerEl = $('.streamsContainer');

  // Variables to store all the data
    // Object containing all data user/channel/stream related
    var streamData = {
      // User related data
      userName:'',
      bio: '',
      logo: '',
      // Channel related data
      streamStatus: '',
      views: '',
      followers: '',
      video_banner: '',
      url: '',
      // Stream related data
      viewers: '',
      game: '',
      status: ''
    };


  // Add the templated messages, toggle the +/- button, change the camera icon color
  function createContent(){
    // basicInfo template
    var infoMsg = '<div class="basicInfos">'
    infoMsg += '<div class="logo"><img src="' + streamData.logo + '" alt="Logo of' + streamData.userName + '"/></div>';
    infoMsg += '<div class="infos"><h2 class="userName">' + streamData.userName + '</h2><p class="bio">' + streamData.bio + '</p><div class="icons" title="Total Views"><div class="views"><span class="octicon octicon-eye"> </span><span>' + streamData.views + '</span></div>';
    infoMsg += '<div class="followers" title="Followers"> <span class="octicon octicon-person"></span><span>' + streamData.followers + '</span></div></div></div>';
    infoMsg += '<div class="status"><div class="indicator"><span class="octicon octicon-device-camera-video"></span></div> ';
    infoMsg += '<div class="moreInfo"><span class="octicon octicon-plus"></span><span class="octicon octicon-dash hide"></span></div></div></div>';

    // streamingContainer template
    var streamingMsg = '<div class="streamingContainer">'
    streamingMsg += '<hr>';
    streamingMsg += '<div class="streaming"><div class="banner"><img src="' + streamData.video_banner + '" alt="Video banner of "' + streamData.userName + '"/></div>';
    streamingMsg += '<div class="streamInfos"><h4 class="statusName">' + streamData.status + '</h4>';
    streamingMsg += '<p class="game">' + streamData.game + '</p>';
    streamingMsg += '<div class="viewers" title="Viewers"> <span class="octicon octicon-octoface"></span> <span> ' + streamData.viewers + ' </span></div>';
    streamingMsg += '</div></div></div></div>';

    // streamContainer template
    var streamContainerMsg = '<div class="streamContainer">' + infoMsg + streamingMsg + '</div>';

    streamsContainerEl.append(streamContainerMsg);

      // Change the octicon-device-camera-video color
    changeColor();
    function changeColor(){
      var cameraIcon = $('.octicon-device-camera-video');
      if (streamData.streamStatus === true) {
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

      streamingContainer.slideToggle(500); // Toggle and slide the streaming container*/
    })

  }

  // Variable to store element of the query url
  var category = ['users', 'streams', 'channels'];
  var name = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin"];


  // Prepare the function to query the data
  function queryData(name){
    console.log('tictac');
    //id = id;
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
        if(streamsContainerEl.hasClass('hide')){
          streamsContainerEl.removeClass('hide').hide().fadeIn(900);
        }
        // Get the data from the users endpoint
        streamData.userName = data.display_name;
        streamData.bio = data.bio;
        streamData.logo = data.logo;

        // Get the data from the streams endpoint
        $.getJSON('https://api.twitch.tv/kraken/' + category[1] + '/' + name + '?client_id=nlub2puh9ouq02ssgkc5oem66rw14ty&callback=?', function(data) {
          // Check if there is a stream object if there is none
          if (data.stream === null) {
            streamStatus = false;
            // Get the data from the channels endpoint
            $.getJSON('https://api.twitch.tv/kraken/' + category[2] + '/' + name + '?client_id=nlub2puh9ouq02ssgkc5oem66rw14ty&callback=?', function(data) {
              streamData.views = data.views;
              streamData.followers = data.followers;
              streamData.video_banner = data.video_banner;
              streamData.url = data.url;
              createContent(); // Call the content update function
            }) // end of $.getJSON()
          // If there is a streaming object
          } else {
            // Stay in the streams endpoint and fetch the data
            streamData.streamStatus = true;
            streamData.viewers = data.stream.viewers;
            streamData.game = data.stream.game;
            streamData.video_banner = data.stream.preview.medium;
            streamData.views = data.stream.channel.views;
            streamData.followers = data.stream.channel.followers;
            streamData.url = data.stream.channel.url;
            streamData.status = data.stream.channel.status;
            createContent();
          } // end of else
        }); // end of $.getJSON()
      } // end of success()
    }) // end of $.ajax()
  }

queryData('OgamingSC2');
queryData('freecodecamp');

//setInterval(function(){queryData('freecodecamp')}, 5000);
//setInterval(function(){ console.log("Hello"); }, 5000);



}); // End of ready()
