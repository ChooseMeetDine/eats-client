app.filter('expired', function() {
    return function(polls) {
        var filtered = [];
        var now = new Date();
        for (var index in polls) {
            var poll = polls[index];
            var expires = new Date(poll.data.attributes.expires);
            if (expires > now) {
                filtered.push(poll);
            }
        }
        return filtered;
    };
});


app.filter('activeAndRecentlyExpired', function() {
    return function(polls) {
        var filtered = [];
        var in1Hour = new Date(new Date().getTime() - 3600000);
        for (var index in polls) {
            var poll = polls[index];
            var expires = new Date(poll.data.attributes.expires);
            if (expires > in1Hour) {
                filtered.push(poll);
            }
        }
        return filtered;
    };
});


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
