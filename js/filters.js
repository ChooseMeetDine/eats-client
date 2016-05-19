
//Filter that returns all polls that are not yet expired
app.filter('expired', function() {
    return function(polls) {
        var filtered = [];
        var now = new Date();
        for (var index in polls) {
            var poll = polls[index];
            var expires = new Date(poll.raw.data.attributes.expires);
            if (expires > now) {
                filtered.push(poll);
            }
        }
        return filtered;
    };
});

//Filter that returns all polls that are not yet expired, and those that exipred for up to an hour ago
app.filter('activeAndRecentlyExpired', function() {
    return function(polls) {
        var filtered = [];
        var in1Hour = new Date(new Date().getTime() - 3600000);
        for (var index in polls) {
            var poll = polls[index];
            var expires = new Date(poll.raw.data.attributes.expires);
            if (expires > in1Hour) {
                filtered.push(poll);
            }
        }
        return filtered;
    };
});

//Filter that returns an array of integers in the range min to max, with increments based on the step-parameter
app.filter('range', function() {
  return function(input, min, max, step) {
    min = parseInt(min); //Make string input int
    max = parseInt(max);
    step = parseInt(step);
    for (var i=min; i<=max; i=i+step)
      if(i<10){
        input.push('0'+i);
      } else {
        input.push(''+i);
      }

    return input;
  };
});
