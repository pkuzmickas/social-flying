/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render("home", {
    title: "Home",
    users: [
      {
        name: "Paulius Kuzmickas",
        photo: "https://ca.slack-edge.com/TP7BJF3FV-UPJRE3AJC-7594b6e78e3f-72",
        phone: "+447968086419",
        email: "p.kuzmikas@gmail.com"
      },
      {
        name: "Paulius Kuzmickas",
        photo: "https://ca.slack-edge.com/TP7BJF3FV-UPJRE3AJC-7594b6e78e3f-72",
        phone: "+447968086419",
        email: "p.kuzmikas@gmail.com"
      },
      {
        name: "Paulius Kuzmickas",
        photo: "https://ca.slack-edge.com/TP7BJF3FV-UPJRE3AJC-7594b6e78e3f-72",
        phone: "+447968086419",
        email: "p.kuzmikas@gmail.com"
      }
    ]
  });
};
