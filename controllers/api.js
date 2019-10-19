const { promisify } = require('util');
const Twit = require('twit');
const stripe = require('stripe')(process.env.STRIPE_SKEY);
const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
const { google } = require('googleapis');
const validator = require('validator');

/**
 * GET /api/twitter
 * Twitter API example.
 */
exports.getTwitter = async (req, res, next) => {
  const token = req.user.tokens.find((token) => token.kind === 'twitter');
  const T = new Twit({
    consumer_key: process.env.TWITTER_KEY,
    consumer_secret: process.env.TWITTER_SECRET,
    access_token: token.accessToken,
    access_token_secret: token.tokenSecret
  });
  try {
    const { data: { statuses: tweets } } = await T.get('search/tweets', {
      q: 'nodejs since:2013-01-01',
      geocode: '40.71448,-74.00598,5mi',
      count: 10
    });
    res.render('api/twitter', {
      title: 'Twitter API',
      tweets
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/twitter
 * Post a tweet.
 */
exports.postTwitter = (req, res, next) => {
  const validationErrors = [];
  if (validator.isEmpty(req.body.tweet)) validationErrors.push({ msg: 'Tweet cannot be empty' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/api/twitter');
  }

  const token = req.user.tokens.find((token) => token.kind === 'twitter');
  const T = new Twit({
    consumer_key: process.env.TWITTER_KEY,
    consumer_secret: process.env.TWITTER_SECRET,
    access_token: token.accessToken,
    access_token_secret: token.tokenSecret
  });
  T.post('statuses/update', { status: req.body.tweet }, (err) => {
    if (err) { return next(err); }
    req.flash('success', { msg: 'Your tweet has been posted.' });
    res.redirect('/api/twitter');
  });
};

/**
 * GET /api/stripe
 * Stripe API example.
 */
exports.getStripe = (req, res) => {
  res.render('api/stripe', {
    title: 'Stripe API',
    publishableKey: process.env.STRIPE_PKEY
  });
};

/**
 * POST /api/stripe
 * Make a payment.
 */
exports.postStripe = (req, res) => {
  const { stripeToken, stripeEmail } = req.body;
  stripe.charges.create({
    amount: 395,
    currency: 'usd',
    source: stripeToken,
    description: stripeEmail
  }, (err) => {
    if (err && err.type === 'StripeCardError') {
      req.flash('errors', { msg: 'Your card has been declined.' });
      return res.redirect('/api/stripe');
    }
    req.flash('success', { msg: 'Your card has been successfully charged.' });
    res.redirect('/api/stripe');
  });
};

/**
 * GET /api/twilio
 * Twilio API example.
 */
exports.getTwilio = (req, res) => {
  res.render('api/twilio', {
    title: 'Twilio API'
  });
};

/**
 * POST /api/twilio
 * Send a text message using Twilio.
 */
exports.postTwilio = (req, res, next) => {
  const validationErrors = [];
  if (validator.isEmpty(req.body.number)) validationErrors.push({ msg: 'Phone number is required.' });
  if (validator.isEmpty(req.body.message)) validationErrors.push({ msg: 'Message cannot be blank.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/api/twilio');
  }

  const message = {
    to: req.body.number,
    from: '+13472235148',
    body: req.body.message
  };
  twilio.messages.create(message).then((sentMessage) => {
    req.flash('success', { msg: `Text send to ${sentMessage.to}` });
    res.redirect('/api/twilio');
  }).catch(next);
};



/**
 * GET /api/upload
 * File Upload API example.
 */

exports.getFileUpload = (req, res) => {
  res.render('api/upload', {
    title: 'File Upload'
  });
};

exports.postFileUpload = (req, res) => {
  req.flash('success', { msg: 'File was uploaded successfully.' });
  res.redirect('/api/upload');
};

exports.getContacts = (req, res) => {
  const token = req.user.tokens.find((token) => token.kind === 'google');
  
  const auth = new google.auth.OAuth2({
    access_type: 'offline'
  });

  auth.setCredentials({
    access_token: token.accessToken
  });

  const service = google.people({version: 'v1', auth});

  service.people.connections.list({
    resourceName: 'people/me',
    // pageSize: 10,
    personFields: 'names,emailAddresses',
  }, (err, gres) => {
    if (err) return console.error('The ctcts API returned an error: ' + err);
    const connections = gres.data.connections;
    if (connections) {
      console.log('Connections:');
      connections.forEach((person) => {
        if (person.names && person.names.length > 0) {
          console.log(person.names[0].displayName);
        } else {
          console.log('No display name found for connection.');
        }
      });
      res.render('api/contacts', {
        title: 'Contacts',
        contacts: connections.map(c => JSON.stringify(c))
      });
    } else {
      console.log('No connections found.');
    }
  });

}


exports.getEvents = (req, res) => {
  const token = req.user.tokens.find((token) => token.kind === 'google');
  
  const authObj = new google.auth.OAuth2({
    access_type: 'offline'
  });

  authObj.setCredentials({
    access_token: token.accessToken
  });
  const calendar = google.calendar({version:'v3', auth: authObj});





  const pugRes = res;
  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date('2019-10-18 00:00:00')).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    let events = res.data.items;
    if (events.length) {
      console.log('Upcoming 10 events:');
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
      });
      //customize the events
      console.log(events[0]);
      let newEvs = [];
      //checks for flights
      events.forEach(ev => {
        let splitSummary = ev.summary.split(' ');
        if(splitSummary[0]==='Flight') {
          let flightRef = ev.summary.split(/[()]+/).filter(function(e) { return e; })[1];
          let from = ev.location.split(' ')[0];
          let to = splitSummary[2]; // will fail with two piece names (New York will show only New)
          let date = new Date(ev.start.dateTime).toDateString();
          let departure = new Date(ev.start.dateTime).toTimeString();
          let arrival = new Date(ev.end.dateTime).toTimeString();
          let link = 'skyscannerNeedAPI';
          newEvs.push({
            flightRef,
            from,
            to,
            date,
            departure,
            arrival,
            link
          });
        }
      });      


      // UNCOMMENT THIS IF U WANT FLIGHTS ONLY
      if(newEvs.length>0)
      events = newEvs;
      //end customizing


      // pugRes.render('api/calendar', {
      //   title: 'Google Calendar API',
      //   events
      // });

      // UNCOMMENT THIS IF U WANT FLIGHTS ONLY
      pugRes.render('friend', {
        name: 'Paulius Kuzmickas',
        phone: '+447968086419',
        data: events
      });

      
    } else {
      console.log('No upcoming events found.');
    }
    
  });

};