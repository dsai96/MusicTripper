
var localStorage = {
  search: [],

  add: function(name, artists, durationText, durationValue) {
    this.search.push({name,artists,durationText, durationValue});
  },

  getMostRecentPlaylist: function() {
    console.log(this.search);
	    return this.search[this.search.length -1];
  	}

}

module.exports = localStorage;
