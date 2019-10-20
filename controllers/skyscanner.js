const axios = require('axios');

const SKYSCANNER_KEY = process.env.SKYSCANNER_KEY;
const url = 'https://www.skyscanner.net/g/chiron/api/v1/flights/search/pricing/v1.0';
const options = {
    headers: {
        'api-key': SKYSCANNER_KEY
    }
};

const defaultParams = {
    country: 'UK',
    currency: 'GBP',
    locale: 'en-GB',
    locationSchema: 'iata',
    adults: 1
};

const pollInterval = 500;
let pollerObj;
let timerCleared = false;

exports.getFlights = (req, res) => {
    timerCleared = false;

    let q = {...defaultParams, ...req.query};
    q.flightRef = q.flightRef.split(' ')[1];
    q.originPlace = 'SXF';
    q.destinationPlace = 'GLA';
    q.outboundDate = '2019-10-21';

    axios.post(url, q, options)
        .then(response => {
            console.log(response.data);
            poll(res, response.data, q);
        })
        .catch(error => {
            console.log('error', 'could not subscribe');
            res.status(500).send({ error });
        });
}


poll = (ogRes, data, query) => {
    pollerObj = setInterval(() => { fetchCurrentStatus(ogRes, data, query) }, pollInterval);
}

fetchCurrentStatus = (res, data, query) => {
    if (timerCleared === true) {
        return;
    }

    axios.get(url + '?session_id=' + data.session_id, options)
        .then(response => {
            console.log((new Date()).getTime(), 'polled successfully');
            console.log('status is ' + response.data.Status)
            if (response.data.Status === 'UpdatesComplete') {
                clearInterval(pollerObj);
                timerCleared = true;
                let flight = extractFlight(response.data, query);
                // res.json(flight);
                res.render('skyscanner', {
                    title: 'Skyscanner',
                    flight
                });
            }
        })
        .catch(err => {
            console.log('error', 'polled failed');
            clearInterval(pollerObj);
            if (!timerCleared) {
                res.status(500).send({ error: err });
            }
            timerCleared = true;
        });
}

const extractFlight = (data, query) => {
    let { flightRef } = query;
    // let unique = [...new Set(myArray)]; 
    let oks = data.Legs
        .filter(({ FlightNumbers }) =>
            FlightNumbers.some(({ FlightNumber }) => FlightNumber === flightRef))
        .map(({ Id }) => Id);

    let itins = data.Itineraries
        .filter(({ OutboundLegId }) => oks.includes(OutboundLegId));
    let flight = {...query, query: data.Query, itins};
    return flight;
}

