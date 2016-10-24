$(document).ready(function() {
  // Stuff to do as soon as the DOM is ready

  // Toggle the Streaming Container and the +/- button
  $('.moreInfo').on('click', function(){
    var streamingContainer = $(this).parents('div.basicInfos').next(); // target the basicInfos container of the clicked button
    var iconPlus = $(this).children('span.octicon-plus'); // target the + button
    var iconDash = $(this).children('span.octicon-dash'); // target the - button
    streamingContainer.slideToggle(500); // Toggle and slide the streaming container
    iconPlus.toggleClass('hide'); // Toggle the + button
    iconDash.toggleClass('hide'); // Toggle the - button
  })

  //Variable to store element
  var queryMsgEl = $('p#queryMsg');
  var errorMsgEl = $('p#errorMsg');
  var userNameEl  = $('.userName');
  var bioEl  = $('.bio');
  var logoEl  = $('.logo');
  var statusEl  = $('.status');
  var viewsEl  = $('.views');
  var followersEl  = $('.followers');
  var gameEl  = $('.game');
  var viewersEl  = $('.viewers');
  var previewEl  = $('.preview');

  // Variables to store all the data
    // User related data
  var username = '';
  var bio = '';
  var logo = '';
    // Channel related data
  var streamStatus = false;

  var views = '';
  var followers = '';
  var video_banner = '';
  var url = '';

    // Stream related data

  var viewers = '';
  var game = '';
  var status = '';

    // Templated message

  var infoMsg = '';
  var onlineMsg = '';
  var offlineMsg = '';


  // Variable to store element of the url
  var category = ['users', 'streams', 'channels'];
  var name = 'superplay';

  // Query all data
  $.ajax({
    method: "GET",
    url: 'https://api.twitch.tv/kraken/' + category[0] + '/' + name + '?client_id=nlub2puh9ouq02ssgkc5oem66rw14ty',
    dataType:'jsonp',
    timeout: 2000,
    beforeSend: function(){
      queryMsgEl.text("Fetching data, please wait...");
    },
    complete: function(){
      queryMsgEl.text('');
    },
    success: function(data){
      userName = data.display_name;
      bio = data.bio;
      logo = data.logo;

      // Update content
      userNameEl.text(userName);
      if (bio === '') {
          bioEl.text = '';
      } else {
        bioEl.html('<span class="octicon octicon-quote"></span><span class="bioText">' + bio + '<span class="octicon octicon-quote reverse"></span>');
      }
      logoEl.html('<img src="' + logo + '" alt="Twitch logo of' + userName + '"/>');

      $.getJSON('https://api.twitch.tv/kraken/' + category[1] + '/' + name + '?client_id=nlub2puh9ouq02ssgkc5oem66rw14ty&callback=?', function(data) {
        if (data.stream === null) {
          $.getJSON('https://api.twitch.tv/kraken/' + category[2] + '/' + name + '?client_id=nlub2puh9ouq02ssgkc5oem66rw14ty&callback=?', function(data) {
            views = data.views;
            followers = data.followers;
            video_banner = data.video_banner;
            url = data.url;
          })
        } else {
          console.log(data);
          viewers = data.stream.viewers;
          game = data.stream.game;
          video_banner = data.stream.preview;
          views = data.stream.channel.views;
          followers = data.stream.channel.followers;
          url = data.stream.channel.url;
          status = data.stream.channel.status;
        }

      });

    },
    error: function(data){
      errorMsgEl.text('An error occured while trying to fetch data. Please try again later.');
    }

  })

});
