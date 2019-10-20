const axios = require('axios');

const SKYSCANNER_KEY = process.env.SKYSCANNER_KEY;

const rootUrl = 'https://www.skyscanner.net/g/chiron/api/v1'
const url = rootUrl + '/flights/search/pricing/v1.0';

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

const f = (url, q, key) => {
    const u = url + q[key];
    return axios.get(u, options)
        .then(response => {
            const { Places } = response.data;
            if (Places && Places.length > 0) {
                q[key] = Places[0].CityId;
            }
        })
        .catch(err => {
            console.log('failed to to destination place')
        });
};

exports.getFlights = (req, res) => {
    timerCleared = false;

    let q = { ...defaultParams, ...req.query };
    q.flightRef = q.flightRef.split(' ')[1];
    const placeUrl = rootUrl + `/places/autosuggest/v1.0/${defaultParams.country}/${defaultParams.currency}/${defaultParams.locale}?query=`;

    Promise.all([f(placeUrl, q, 'originPlace'),
    f(placeUrl, q, 'destinationPlace')])
        .then(values => {
            axios.post(url, q, options)
                .then(response => {
                    poll(res, response.data, q);
                })
                .catch(error => {
                    console.log('error', 'could not subscribe');
                    res.status(500).send({ error });
                });
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
                let carriers = {};
                response.data.Carriers.forEach( (carrier) => {
                    carriers[carrier.Id] = carrier;
                });
                // res.json(flight);
                res.render('skyscanner', {
                    title: 'Skyscanner',
                    flight,
                    carriers
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
    let flight = { ...query, query: data.Query, itins };
    return flight;
}

