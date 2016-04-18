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