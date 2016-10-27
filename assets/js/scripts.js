$(document).ready(function() {

  // My channels array
  var names = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "comster404", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin"];

  //Variable to store element
  var queryMsgEl = $('p#queryMsg');
  var errorMsgEl = $('p#errorMsg');
  var streamsContainerEl = $('.streamsContainer');
  // Object containing all data user/channel/stream related
  var streamData = {
    id: '',
    // User related data
    name: '',
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
    infoMsg += '<div class="views" title="Total Views"><span class="octicon octicon-eye"></span><span class="totalViews">' + streamData.views + '</span></div>';
    infoMsg += '<div class="followers" title="Followers"><span class="octicon octicon-person"></span><span class="totalFollowers">' + streamData.followers + '</span></div>';
    infoMsg += '<div class="link"><a class="linkOfficial" href="' + streamData.url + '" target="_blank" title="Watch on the official page on Twitch!"><span class="octicon octicon-link-external"></span>Watch on the official page on Twitch!</a></div>';
    infoMsg += '</div></div>'; // close icons and infos
    infoMsg += '<div class="status">';
    if(streamData.streamStatus === false) {
      infoMsg += '<div class="indicator"><span class="octicon octicon-device-camera-video offline"></span></div> ';
    } else {
      infoMsg += '<div class="indicator"><span class="octicon octicon-device-camera-video online"></span></div> ';
    }
    infoMsg += '<div class="moreInfo"><span class="octicon octicon-plus"></span><span class="octicon octicon-dash hide"></span></div>'
    infoMsg += '</div></div>'; // close status, basicInfos

    // Cleaning the null / empty variables
    if (streamData.video_banner === null) {streamData.video_banner = 'assets/img/nopreview.png';}
    if (streamData.game === null) {streamData.game = '(No data)';}

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

    if (streamData.status === null) {
      streamingMsg = '<div class="streamingContainer"><h4 class="noStream"> No previous Stream data available.</h4></div>';
    }
    if(streamData.streamStatus === true){
      streamData.streamStatus = 'streamOnline';
    } else {
      streamData.streamStatus = 'streamOffline'
    }
    // streamContainer template
    var streamContainerMsg = '<div class="streamContainer ' + streamData.streamStatus +'" id="'+ streamData.name + '">' + infoMsg + streamingMsg + '</div>';

    return streamContainerMsg;
  }

  // Contains the errorDiv template
  var errorDiv = function userError(queryName){
    var errorMessage = '<div class="errorContainer streamContainer" id="' + queryName + '"><div class="errorMessage"><span class="octicon octicon-bug"></span>Oops... "' + queryName + '" channel doesn\'t exist or has been deleted.</div></div>';
    return errorMessage;
  }

  // Hide/Show the Streaming Container and change the +/- button
  function clickEvent(){
    $('.moreInfo').unbind('click').on('click',function(event){
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
  }

  // Get all the containers ids and put them in an array
  var idsArray = function getIds(){
    var containersId = [];
    streamsContainerEl.find('.streamContainer').each(function(){
      containersId.push(this.id);
    });
    return containersId;
  }

  // My main function, a bit of Ajax Hell in it (3 calls: users, channels, streams endpoints)
  function queryUserInfo(queryName){
    if (streamsContainerEl.hasClass('hide')) {
      streamsContainerEl.fadeIn(2000);
    }
    // Call the users endpoint
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
        // Storing these data in new var to pass it to the next ajax calls
        var bio = data.bio;
        var name = data.name;
        // Call the Streams endpoint
        $.ajax({
          method:'GET',
          url: 'https://api.twitch.tv/kraken/streams/' + queryName + '?client_id=nlub2puh9ouq02ssgkc5oem66rw14ty',
          dataType:'jsonp',
          timeout: 2000,
          success: function(data){
            if (data.status === 404) {
              // Stream Channel doesn't exist
              streamsContainerEl.append(errorDiv(queryName));
              // If there is no streaming now
            } else if (data.stream === null) {
              // Call the Channels endpoint
              $.ajax({
                method:'GET',
                url: 'https://api.twitch.tv/kraken/channels/' + queryName + '?client_id=nlub2puh9ouq02ssgkc5oem66rw14ty',
                dataType:'jsonp',
                timeout: 2000,
                success: function(data){
                  //fetch data from the channels endpoint into the streamData object
                  streamData.streamStatus = false;
                  // User data
                  streamData.userName = data.display_name;
                  streamData.logo = data.logo;
                  streamData.bio = bio;
                  streamData.name = name;
                  // Channel data
                  streamData.views = data.views;
                  streamData.followers = data.followers;
                  streamData.video_banner = data.video_banner;
                  streamData.url = data.url;
                  // Stream data
                  streamData.game = data.game;
                  streamData.status = data.status;

                  // Pass the fetched data to the createContent function and add the click event
                  streamsContainerEl.append(msg(streamData));
                  clickEvent();
                }
              })
            // If there is a streaming now
            } else {
              //fetch data from the streams endpoint into the streamData object
              streamData.streamStatus = true;
              // User data
              streamData.userName = data.stream.channel.display_name;
              streamData.logo = data.stream.channel.logo;
              streamData.bio = bio;
              streamData.name = name;
              // Channel data
              streamData.views = data.stream.channel.views;
              streamData.followers = data.stream.channel.followers;
              streamData.video_banner = data.stream.preview.medium;
              streamData.url = data.stream.channel.url;
              // Stream data
              streamData.viewers = data.stream.viewers;
              streamData.game = data.stream.game;
              streamData.status = data.stream.channel.status;

              // Pass the fetched data to the createContent function and add the click event
              streamsContainerEl.append(msg(streamData));
              clickEvent();
            } // end of else
          } // end of success
        }) // end of ajax
      } // end of success
    }) // end of ajax
  } // end of queryUserInfo

  // Loop through the names array and call the queryUserInfo function
  function updateContent(){
    streamsContainerEl.html('');
    // Loop trhough the names array and call the query function
    for (var i = 0; i < names.length; i++) {
      queryUserInfo(names[i]);
    }
  }

  // Call updateContent when the page loads
  updateContent();

  // Call updateContent when the user click the refresh button
  $('.refresh').on('click', function(){
    updateContent();
  })

  // Click event to filter the streams status
  $('.filter').on('click', function(event){
    // Get the value of the clicked button
    var target = $(event.target);
    var targetText = target.text();

    // Store the streamContainer depending of their status
    var offlineEl = streamsContainerEl.find('.streamOffline');
    var onlineEl = streamsContainerEl.find('.streamOnline');
    var allEl = streamsContainerEl.find('.streamContainer');
    var errorEl = streamsContainerEl.find('.errorContainer');

    // Compare the value of the button and hide/show the streamContainer
    if (targetText === 'Online') {
      onlineEl.show();
      offlineEl.hide();
      errorEl.hide();
    } else if (targetText === 'Offline') {
      onlineEl.hide();
      offlineEl.show();
      errorEl.hide();
    } else {
      onlineEl.show();
      offlineEl.show();
      errorEl.show();
    }
  })

  // Keyup event to filter the streams with text
  $('#filterTxt').on('keyup', function(event){
    var idList = idsArray(); // Store all the stream ids in an array
    var filteredIds = []; // Create an new empty array
    var textVal = ($('#filterTxt').val()); // Get the text value the user entered

    // If the user entered something
    if (textVal !== '') {
      $('.streamContainer').hide(); // Hide all streams
      // Filter the ids array, filteredIds contains now only the ids containing the text entered by the user
      filteredIds = $.grep(idList,function(item, index){
        if(item.indexOf(textVal) > -1){
          return true;
        } else {
          return false;
        }
      })

      // Show only the streams that have the same ids that those in filteredIds array
      for (var i = 0; i < filteredIds.length; i++) {
        $('#' + filteredIds[i]).show();
      }
    } else { // If the text is blank
      $('.streamContainer').show(); // Show all streams
    }
  })

});
