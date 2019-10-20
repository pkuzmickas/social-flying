const GlobalData = require('../models/GlobalData');
/**
 * GET /friend
 * Friend page.
 */
exports.getFriend = (req, res) => {

  let phone = req.query.phone;
  GlobalData.findOne({phone}, (err, obj)=> {
    const events = obj.events
    res.render('friend', {
      name: obj.name,
      phone,
      email: obj.email,
      data: events
    });
  });

  
};
