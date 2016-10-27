$(document).ready(function() {
  //Variable to store element
  var queryMsgEl = $('p#queryMsg');
  var errorMsgEl = $('p#errorMsg');
  var streamsContainerEl = $('.streamsContainer');

  // Variable to store element of the query url
  var name = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin"];

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
  var streamsContainerArr = [];
  var myVar='';

  // Add the templated messages, toggle the +/- button, change the camera icon color
  function createContent(streamData){
    // basicInfo template
    var infoMsg = '<div class="basicInfos">'
    infoMsg += '<div class="logo"><img src="' + streamData.logo + '" alt="Logo of' + streamData.userName + '"/></div>';
    infoMsg += '<div class="infos"><h2 class="userName">' + streamData.userName + '</h2><p class="bio">' + streamData.bio + '</p><div class="icons" title="Total Views"><div class="views"><span class="octicon octicon-eye"> </span><span class="totalViews">' + streamData.views + '</span></div>';
    infoMsg += '<div class="followers" title="Followers"><span class="octicon octicon-person"></span><span class="totalFollowers">' + streamData.followers + '</span></div>';
    infoMsg += '<div class="link"><a class="linkOff" href="' + streamData.url + '" target="_blank" title="Watch on the official page on Twitch!"><span class="octicon octicon-link-external"></span>Watch on the official page on Twitch!</a></div></div></div>';
    infoMsg += '<div class="status"><div class="indicator"><span class="octicon octicon-device-camera-video"></span></div> ';
    infoMsg += '<div class="moreInfo"><span class="octicon octicon-plus"></span><span class="octicon octicon-dash hide"></span></div></div></div>';
    // streamingContainer template
    var streamingMsg = '<div class="streamingContainer">'
    streamingMsg += '<hr>';
    streamingMsg += '<div class="streaming"><div class="banner"><img src="' + streamData.video_banner + '" alt="Video banner of "' + streamData.userName + '"/></div>';
    // If the stream is offline
    if(streamData.streamStatus === false) {
      streamingMsg += '<div class="streamInfos"><h4 class="previousStream">Last Stream: </h4>' ;
      streamingMsg += '<h4 class="statusName">' + streamData.status + '</h4>';
      streamingMsg += '<p class="game">in: ' + streamData.game + '</p>';
      streamingMsg += '</div></div></div></div>';
    } else {
    // If the stream is online
      streamingMsg += '<div class="streamInfos"><h4 class="nowStreaming">Now streaming: </h4>' ;
      streamingMsg += '<h4 class="statusName">' + streamData.status + '</h4>';
      streamingMsg += '<p class="game">in: ' + streamData.game + '</p>';
      streamingMsg += '<div class="viewers" title="Viewers"> <span class="octicon octicon-octoface"></span><span class="totalViewers"> ' + streamData.viewers + ' </span></div>';
      streamingMsg += '</div></div></div></div>';
    }
    // streamContainer template
    var streamContainerMsg = '<div class="streamContainer">' + infoMsg + streamingMsg + '</div>';

    streamsContainerEl.append(streamContainerMsg);



    // Call the changeColor function to change the camera icon color
    changeColor();

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

  // Update the already added content
  function updateContent(streamData){
    $('h2.userName').text(streamData.userName);
    $('p.bio').text(streamData.bio);
    $('.logo').html('<img src="' + streamData.logo + '" alt="Logo of' + streamData.userName + '"/>');
    streamData.streamStatus
    $('.totalViews').text(streamData.views);
    $('totalFollowers').text(streamData.followers);
    $('banner').html('<img src="' + streamData.video_banner + '" alt="Video banner of "' + streamData.userName + '"/>');
    $('.linkOff').attr('href', streamData.url);
    $('.totalViewers').text(streamData.viewers);
    $('.game').text('in: ' + streamData.game)
    $('.statusName').text(streamData.status);

    // Call the changeColor function to change the camera icon color
    changeColor();
  }

  // Prepare the function to query the data
  function queryData(name, id){
    for (var i = 0; i < 3; i++) {
      $.ajax({
        method: "GET",
        url: 'https://api.twitch.tv/kraken/users/' + name[i] + '?client_id=nlub2puh9ouq02ssgkc5oem66rw14ty',
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

          queryStreamData();
          function queryStreamData(){
            // Get the data from the streams endpoint
            $.ajax({
              method: "GET",
              url: 'https://api.twitch.tv/kraken/streams/' + name[i] + '?client_id=nlub2puh9ouq02ssgkc5oem66rw14ty',
              dataType:'jsonp',
              timeout: 2000,
              success: function(data){
                if (data.stream === null) {
                  streamData.streamStatus = false;
                  // Get the data from the channels endpoint
                  queryChannelData();
                  function queryChannelData(){
                    $.ajax({
                      method: "GET",
                      url: 'https://api.twitch.tv/kraken/channels/' + name[i] + '?client_id=nlub2puh9ouq02ssgkc5oem66rw14ty',
                      dataType:'jsonp',
                      timeout: 2000,
                      success: function(data){
                      // Fetch the data into the streamData object
                      streamData.views = data.views;
                      streamData.followers = data.followers;
                      streamData.video_banner = data.video_banner;
                      streamData.url = data.url;
                      streamData.game = data.game;
                      streamData.status = data.status;
                      // Call the content update function
                      createContent(streamData);
                      }
                    }) // end of $.ajax()
                  }

                // If there is a streaming object
                } else {
                  // // Fetch the data into the streamData object from the streams endpoint
                  streamData.streamStatus = true;
                  streamData.viewers = data.stream.viewers;
                  streamData.game = data.stream.game;
                  streamData.video_banner = data.stream.preview.medium;
                  streamData.views = data.stream.channel.views;
                  streamData.followers = data.stream.channel.followers;
                  streamData.url = data.stream.channel.url;
                  streamData.status = data.stream.channel.status;
                  // Call the content update function
                  createContent(streamData);
                } // end of else
              } // end of succes{}
            }); // end of $.ajax()
          } // end of queryStreamData()
        } // end of success()
      }) // end of $.ajax()
    }

  }

queryData(name,'1');
//queryData('freecodecamp');


//setInterval(function(){queryData('freecodecamp')}, 5000);
//setInterval(function(){ console.log("Hello"); }, 5000);



}); // End of ready()
