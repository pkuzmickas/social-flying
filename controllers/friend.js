const GlobalData = require('../models/GlobalData');
const moment = require('moment');
/**
 * GET /friend
 * Friend page.
 */
exports.getFriend = (req, res) => {
  let phone = req.query.phone;
  GlobalData.findOne({phone}, (err, obj)=> {
    const events = obj.events
    events.forEach(event => {
      let {from, to, flightRef, date} = event;
      event.link = `/api/skyscanner?outboundDate=${(new Date(date)).toISOString().split('T')[0]}&originPlace=${from}&destinationPlace=${to}&flightRef=${flightRef}`;
      // event.link = `/api/skyscanner?outboundDate=${moment(new Date(date)).format('yyyy-mm-dd')}&originPlace=${from}&destinationPlace=${to}&flightRef=${flightRef}`;
    });
    res.render('friend', {
      name: obj.name,
      phone,
      email: obj.email,
      events
    });
  });

};
