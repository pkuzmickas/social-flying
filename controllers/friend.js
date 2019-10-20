const GlobalData = require('../models/GlobalData');
/**
 * GET /friend
 * Friend page.
 */
exports.getFriend = (req, res) => {
  let phone = req.query.phone;
  GlobalData.findOne({ phone }, (err, obj) => {
    const events = obj.events
    events.forEach(event => {
      let { from, to, flightRef, date } = event;
      date = (new Date(date)).toISOString().split('T')[0];
      event.link = `/api/skyscanner?outboundDate=${date}&originPlace=${from}&destinationPlace=${to}&flightRef=${flightRef}`;
    });
    res.render('friend', {
      name: obj.name,
      phone,
      email: obj.email,
      events
    });
  });

};
