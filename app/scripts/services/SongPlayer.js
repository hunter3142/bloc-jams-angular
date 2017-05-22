(function() {
    function SongPlayer($rootScope, Fixtures) {
        var SongPlayer = {};

        /**
		* @desc Sets currentAlbum to albumPicasso
		* @type {Object}
        */
        var currentAlbum = Fixtures.getAlbum();

        /**
 		* @desc Buzz object audio file
 		* @type {Object}
 		*/
     	var currentBuzzObject = null;

     	/**
 		* @function setSong
 		* @desc Stops currently playing song and loads new audio file as currentBuzzObject
 		* @param {Object} song
 		*/
     	var setSong = function(song) {
    		if (currentBuzzObject) {
        		stopSong(song);
    		}
 
    		currentBuzzObject = new buzz.sound(song.audioUrl, {
        		formats: ['mp3'],
        		preload: true
    		});

    		currentBuzzObject.bind('timeupdate', function() {
         		$rootScope.$apply(function() {
             		SongPlayer.currentTime = currentBuzzObject.getTime();
         		});
     		});
 
    		SongPlayer.currentSong = song;
 		};

 		/**
 		* @function playSong
 		* @desc Plays currentBuzzObject and sets playing to true
 		* @param {object} song
		*/
 		var playSong = function (song) {
 			currentBuzzObject.play();
 			song.playing = true
 		};

 		/**
 		* @function stopSong
 		* @desc Stop song and set playing to null
 		* @param {Object} song
 		*/
 		var stopSong = function(song) {
 			currentBuzzObject.stop();
 			SongPlayer.currentSong.playing = null;
 		}

 		/**
		* @desc return song index
		* type {Number}
 		*/
 		var getSongIndex = function(song) {
     		return currentAlbum.songs.indexOf(song);
 		};

 		/**
		* @desc Active song object from list of songs
		* @type {Object}
		*/
		SongPlayer.currentSong = null;

		/**
 		* @desc Current playback time (in seconds) of currently playing song
 		* @type {Number}
 		*/
 		SongPlayer.currentTime = null;

		/** 
		* @method .play
		* @desc Update currentSong and play or play paused song
		* @param song
		*/
        SongPlayer.play = function(song) {
        	song = song || SongPlayer.currentSong;
        	if (SongPlayer.currentSong !== song) {
             	setSong(song);
         		playSong(song);
         	} else if (SongPlayer.currentSong === song) {
         		if (currentBuzzObject.isPaused()) {
             	playSong(song);
         		}
     		}   
     	};

     	/**
     	* @method .pause
     	* @desc Pause currentBuzzObject and set song.playing to false
     	* @param song
     	*/
     	SongPlayer.pause = function(song) {
     		song = song || SongPlayer.currentSong;
     		currentBuzzObject.pause();
     		song.playing = false;
 		};

 		/**
 		* @function setCurrentTime
 		* @desc Set current time (in seconds) of currently playing song
 		* @param {Number} time
 		*/
 		SongPlayer.setCurrentTime = function(time) {
     		if (currentBuzzObject) {
         		currentBuzzObject.setTime(time);
     		}
 		};

 		/**
 		* @method .previous
 		* @desc Play previous song or stop player
 		* @param none
 		*/
 		SongPlayer.previous = function() {
     		var currentSongIndex = getSongIndex(SongPlayer.currentSong);
     		currentSongIndex--;
     		if (currentSongIndex < 0) {
         		stopSong(song);
     		} else {
         		var song = currentAlbum.songs[currentSongIndex];
         		setSong(song);
         		playSong(song);
     		}
 		};

 		/**
 		* @method .next
 		* @desc play next song or stop player
 		* @param none
 		*/
 		SongPlayer.next = function() {
 			var currentSongIndex = getSongIndex(SongPlayer.currentSong);
 			currentSongIndex++;
 			if (currentSongIndex >= 5) {
 				stopSong(song);
 			} else {
 				var song = currentAlbum.songs[currentSongIndex];
 				setSong(song);
 				playSong(song);
 			}
 		};

		return SongPlayer;
    }
 
    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();