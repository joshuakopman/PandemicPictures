function hbsHelpers(hbs) {
  return hbs.create({
    helpers: { // This was missing
      inc: function(value, options) {
        return parseInt(value) + 1;
      },
  	  json: function(context) {
  	    return JSON.stringify(context);
      }
    }
  });
}

module.exports = hbsHelpers;