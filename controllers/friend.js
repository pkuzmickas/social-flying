/**
 * GET /friend
 * Friend page.
 */
exports.getFriend = (req, res) => {
  res.render('friend', {
    name: 'Paulius Kuzmickas',
    phone: '+447968086419',
    data: [
        {
            flightRef: 'FR2885',
            from: 'Kaunas',
            to: 'Edinburgh',
            date: 'Tue, 13 Aug 19',
            departure: '13:15',
            arrival: '14:05',
            link: 'flight.com'
        },
        {
            flightRef: 'FR2885',
            from: 'Kaunas',
            to: 'Edinburgh',
            date: 'Tue, 13 Aug 19',
            departure: '13:15',
            arrival: '14:05',
            link: 'flight.com'
        },
        {
            flightRef: 'FR2885',
            from: 'Kaunas',
            to: 'Edinburgh',
            date: 'Tue, 13 Aug 19',
            departure: '13:15',
            arrival: '14:05',
            link: 'flight.com'
        },

        
    ]
  });
};
