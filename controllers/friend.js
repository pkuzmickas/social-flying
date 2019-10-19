/**
 * GET /friend
 * Friend page.
 */
exports.getFriend = (req, res) => {
  res.render('friend', {
    Name: 'Paulius Kuzmickas'
  });
};
