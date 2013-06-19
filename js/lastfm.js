(function($) {
	$.fn.lastFM = function(options) {
		var defaults = {
			number: 10,
			username: 'thlister',
			apikey: '',
			artSize: 'medium',
			noart: '../images/noartwork.png',
		},
		settings = $.extend({}, defaults, options);
		
		var lastUrl = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' + settings.username + '&api_key=' + settings.apikey + '&limit=' + settings.number + '&format=json&callback=?';
		
		if (settings.artSize == 'small') { imgSize = 0 }
		else if (settings.artSize == 'medium') { imgSize = 1 }
		else if (settings.artSize == 'large') { imgSize = 2 }
		
		this.each(function() {
    		$this = $(this);
			$.getJSON(lastUrl, function(data) {
    		    $this.children().remove();
    		    
				$.each(data.recenttracks.track, function(i, item) {
					if (item.image[1]['#text'] == '') {
						art = settings.noart;
					}
					else {
						art = stripslashes(item.image[imgSize]['#text']);
					}
					
					url = stripslashes(item.url);
					song = item.name;
					artist = item.artist['#text'];
					album = item.album['#text'];
					if (item.date) {
    					var timestamp = new Date(item.date['#text'] + ' UTC');
    					time = jQuery.timeago(timestamp);
					}
					else {
    					time = 'Listening Now';
					}
					
					var container = $('<div class="track" />');
					
					container.append('<div class="song">' + song + '</div>');
					container.append('<div class="artist">' + artist + '</div>');
					container.append('<div class="album">' + album + '</div>');
					container.append('<div class="time">' + time + '</div>');
					container.append('<div class="art">' + "<img src='" + art + "' />" + "<div class='gloss'/>" + '</div>');
					
					if (item['@attr'] && item['@attr']['nowplaying'] == "true") {
    					container.addClass('nowplaying');
    					container.append('<div class="nowplaying-banner">Now Playing</div>');
					}
					
					$this.append(container);
				});
			});
		});
	};
	
	function stripslashes(str) {	 
		return (str + '').replace(/\0/g, '0').replace(/\\([\\'"])/g, '$1');
	}
})(jQuery);