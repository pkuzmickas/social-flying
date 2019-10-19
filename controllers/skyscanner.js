const axios = require('axios');

const SKYSCANNER_KEY = process.env.SKYSCANNER_KEY;
const url = 'https://www.skyscanner.net/g/chiron/api/v1/flights/search/pricing/v1.0';
const options = {
    headers: {
        'api-key': SKYSCANNER_KEY
    }
};

const pollInterval = 500;
let pollerObj, sessionData = {};
let timerCleared = false;

exports.getFlights = (req, res) => {
    timerCleared = false;
    axios.post(url, req.query, options)
        .then(response => {
            console.log(response.data);
            poll(res, response.data.session_id);
        })
        .catch(error => {
            console.log('error', 'could not subscribe');
            res.status(500).send({ error });
        });
}


poll = (ogRes, session_id) => {
    pollerObj = setInterval(() => { fetchCurrentStatus(ogRes, session_id) }, pollInterval);
}

fetchCurrentStatus = (res, session_id) => {
    if (timerCleared === true) {
        return;
    }

    axios.get(url + '?session_id=' + session_id, options)
        .then(response => {
            console.log((new Date()).getTime(), 'polled successfully');
            console.log('status is ' + response.data.Status)
            sessionData[session_id] = response.Itineraries;
            if (response.data.Status === 'UpdatesComplete') {
                clearInterval(pollerObj);
                timerCleared = true;
                res.json(response.data);
            }
        })
        .catch(err => {
            console.log('error', 'polled failed');
            clearInterval(pollerObj);
            if(!timerCleared) {
                res.status(500).send({ error: err });
            }
            timerCleared = true;
        });
}

