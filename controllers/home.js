const GlobalData = require("../models/GlobalData");

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  

  const gdt = new GlobalData({
    name: "String",
    phone: "String",
    email: "String@",
    photo: "String",
    events: []
  });

  GlobalData.findOne({ phone: "String" }, function(err, obj) {
    console.log(obj);
    console.log(err);
  });

  // GlobalData.findOne({ phone: "String" }, function(err, obj) {
  //   console.log(obj);
  //   console.log(err);
  // });


  res.render("home", {
    title: "Social Flying",
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


