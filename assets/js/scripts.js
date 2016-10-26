$(document).ready(function() {

   // My channels array
  var name = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin"];

  //Variable to store element
  var queryMsgEl = $('p#queryMsg');
  var errorMsgEl = $('p#errorMsg');
  var streamsContainerEl = $('.streamsContainer');

  // Object containing all data user/channel/stream related
  var streamData = {
    id: '',
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

  // Contains the templated message
  var msg = function createContent(streamData){
    // basicInfo template
    var infoMsg = '<div class="basicInfos">'
    infoMsg += '<div class="logo"><img src="' + streamData.logo + '" alt="Logo of ' + streamData.userName + '"/></div>';
    infoMsg += '<div class="infos"><h2 class="userName">' + streamData.userName + '</h2>';
    infoMsg += '<p class="bio">' + streamData.bio + '</p>';
    infoMsg += '<div class="icons">';
    infoMsg += '<div class="views" title="Viewers"><span class="octicon octicon-eye"></span><span class="totalViews">' + streamData.views + '</span></div>';
    infoMsg += '<div class="followers" title="Followers"><span class="octicon octicon-person"></span><span class="totalFollowers">' + streamData.followers + '</span></div>';
    infoMsg += '<div class="link"><a class="linkOff" href="' + streamData.url + '" target="_blank" title="Watch on the official page on Twitch!"><span class="octicon octicon-link-external"></span>Watch on the official page on Twitch!</a></div>';
    infoMsg += '</div></div>'; // close icons and infos
    infoMsg += '<div class="status">';
    infoMsg += '<div class="indicator"><span class="octicon octicon-device-camera-video"></span></div> ';
    infoMsg += '<div class="moreInfo"><span class="octicon octicon-plus"></span><span class="octicon octicon-dash hide"></span></div>'
    infoMsg += '</div></div>'; // close status, basicInfos

    // streamingContainer template
    var streamingMsg = '<div class="streamingContainer">'
    streamingMsg += '<hr>';
    streamingMsg += '<div class="streaming">';
    streamingMsg += '<div class="banner"><img src="' + streamData.video_banner + '" alt="Video banner of "' + streamData.userName + '/></div>';
    // If the stream is offline
    if(streamData.streamStatus === false) {
      streamingMsg += '<div class="streamInfos">';
      streamingMsg += '<h4 class="previousStream">Last Stream: </h4>' ;
      streamingMsg += '<h4 class="statusName">' + streamData.status + '</h4>';
      streamingMsg += '<p class="game">in: ' + streamData.game + '</p>';
      streamingMsg += '</div></div></div>'; // close streamingContainer,streaming, streamInfos
    } else {
    // If the stream is online
      streamingMsg += '<div class="streamInfos"><h4 class="nowStreaming">Now streaming: </h4>' ;
      streamingMsg += '<h4 class="statusName">' + streamData.status + '</h4>';
      streamingMsg += '<p class="game">in: ' + streamData.game + '</p>';
      streamingMsg += '<div class="viewers" title="Viewers"> <span class="octicon octicon-octoface"></span><span class="totalViewers"> ' + streamData.viewers + ' </span></div>';
      streamingMsg += '</div></div></div>';
    }
    // streamContainer template
    var streamContainerMsg = '<div class="streamContainer">' + infoMsg + streamingMsg + '</div>';

    return streamContainerMsg;
  }

  // Contains the errorDiv template
  var errorDiv = function userError(queryName){
    var errorMessage = '<div class="errorContainer"><div class="errorMessage">Error: "' + queryName + '" channel doesn\'t exist or has been deleted.</div></div>';
    return errorMessage;
  }

  // Change the octicon-device-camera-video color
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

  // Hide/Show the Streaming Container and change the +/- button
  // Delegate the event to the static parent container streamsContainer
  $('.streamsContainer').on('click',$('.moreInfo'), function(event){
    var target = $(event.target);
    if (target.hasClass('octicon-plus')) {
      target.hide();
      target.next('.octicon-dash').show();
    } else if (target.hasClass('octicon-dash')) {
      target.hide();
      target.prev('.octicon-plus').show();
    }

    // Target the streaming container (by getting the streamContainer parent then children streamingContainer of the clicked button) and slideToggle it
    var streamingContainer = target.parents('div.streamContainer').children('.streamingContainer');

    // Toggle and slide the streaming container
    streamingContainer.slideToggle(500);
  });

  function queryUserInfo(queryName){
    $.ajax({
      method:'GET',
      url: 'https://api.twitch.tv/kraken/users/' + queryName + '?client_id=nlub2puh9ouq02ssgkc5oem66rw14ty',
      dataType:'jsonp',
      timeout: 2000,
      beforeSend: function(){
        queryMsgEl.text("Fetching data, please wait...");
      },
      complete: function(){
        queryMsgEl.text('');
      },
      success: function(data){
        console.log(data.bio);
        streamData.bio = data.bio;

        $.ajax({
          method:'GET',
          url: 'https://api.twitch.tv/kraken/streams/' + queryName + '?client_id=nlub2puh9ouq02ssgkc5oem66rw14ty',
          dataType:'jsonp',
          timeout: 2000,
          success: function(data){
            if (data.stream === null) {
              // Query in channels endpoint
              console.log('Stream is offline');
              streamData.streamStatus = false;

            } else if (data.status === 404) {
              // Stream Channel doesn't exist
              console.log('Stream Channel doesn\'t exist');
              streamsContainerEl.append(errorDiv(queryName));
            } else {
              //fetch data from the streams endpoint into the streamData object
              streamData.streamStatus = true;
              // User data
              streamData.userName = data.stream.channel.display_name;
              streamData.logo = data.stream.channel.logo;
              // Channel data
              streamData.views = data.stream.channel.views;
              streamData.followers = data.stream.channel.followers;
              streamData.video_banner = data.stream.preview.medium;
              streamData.url = data.stream.channel.url;
              // Stream data
              streamData.viewers = data.stream.viewers;
              streamData.game = data.stream.game;
              streamData.status = data.stream.channel.status;


              streamsContainerEl.append(msg(streamData));
              changeColor();
              //console.log(msg(streamData));
            } // end of else
          } // end of success
        }) // end of ajax
      } // end of success
    }) // end of ajax
  } // end of queryUserInfo



  queryUserInfo(name[0]);
  queryUserInfo(name[1]);
  queryUserInfo('ppd');
  queryUserInfo(name[3]);
  queryUserInfo('brunofin');
  /*queryUserInfo(name[4], 4);
  queryUserInfo(name[5], 5);
  queryUserInfo(name[6], 6);
  queryUserInfo(name[7], 7);
  queryUserInfo(name[8], 8);*/


});


/* */
