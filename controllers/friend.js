const GlobalData = require('../models/GlobalData');
/**
 * GET /friend
 * Friend page.
 */
exports.getFriend = (req, res) => {
  let phone = req.query.phone;
  GlobalData.findOne({phone}, (err, obj)=> {
    const events = obj.events
    events.forEach(event => {
      let {from, to, flightRef} = event;
      event.link = `/api/skyscanner?outboundDate=${events.date}&originPlace=${from}&destinationPlace=${to}&flightRef=${flightRef}`;
    });
    res.render('friend', {
      name: obj.name,
      phone,
      email: obj.email,
      events
    });
  });

};
