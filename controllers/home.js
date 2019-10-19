/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('home', {
    title: 'Home',
    users: [{
      name: 'Eion Luca',
      img_url: 'https://ca.slack-edge.com/TP7BJF3FV-UPJRE3AJC-7594b6e78e3f-72',
      id: 1
    },
    {
      name: 'Paulius Kuzmickas',
      img_url: 'https://ca.slack-edge.com/TP7BJF3FV-UPJRE3AJC-7594b6e78e3f-72',
      id: 2
    },
    {
      name: 'Aditya Dewan',
      img_url: 'https://ca.slack-edge.com/TP7BJF3FV-UPJRE3AJC-7594b6e78e3f-72',
      id: 3
    }]
  });
};
