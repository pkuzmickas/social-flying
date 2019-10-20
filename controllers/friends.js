const GlobalData = require("../models/GlobalData");

/**
 * GET /friends
 * Friend page.
 */
exports.getFriends = (req, res) => {
  
    let data= [];

    GlobalData.find({}, function(err, obj) {
        data = obj;
        res.render("friends", {
            data
        });
    });

    
};
