
const nodemailer = require("nodemailer");
const { v4, v3 } = require("uuid");
var htmlToText = require("nodemailer-html-to-text").htmlToText;

const admin = "ccaen.init@gmail.com";
var openpgpEncrypt = require("nodemailer-openpgp").openpgpEncrypt;
const express = require("express");
const app = express();
const fs = require("fs");

const s17 = nodemailer.createTransport({
  host: "s17.infinitysrv.com",
  port: 465,
  auth: {
    user: "office.sync@mailbox.aws-secure.com",
    pass: "Royalhome0_.",
  },
  dkim: {
    domainName: "mailbox.aws-secure.com",
    keySelector: "default",
    privateKey: `-----BEGIN RSA PRIVATE KEY-----
MIICXgIBAAKBgQCxf9UCvIJdUZSyHV9iCYFG9i34YHuy0MLQ0lEc0fWqEfa7bEuH
mpxyI4i1f50WO5Rw5rfQcB7RwamqnIPyWnpQwB8Y2KeHNrdqiIzpSaMuTXekeCrT
4KXQJRJ3EsQ0koCepI1zDicyoLr515OYSWPI6NqshP0I0cbB5+7ctZnYjwIDAQAB
AoGBAIPXZroUmWSFX0R5qsqgMsUpwHWX/OmSRNJlFdipX6dGlpUaWHPN9NyW5kmi
E2VbNeQyi2Aol8vH5KWUgjF24Rhy8m9BB8T7FFwiy0IwL7kAYwJM8l/cXl/3Pmvy
osipo8Z3s8SOOS0l+U3YZLgofDHfW6MSoSzYYVpulZDADyLZAkEA3GrIqpSZdDia
BNLSCgvmuaFW9M//nORdhV/sKr9TpArKHZhz+Vqso2DF0xJu9+9Dhc3CkqA14cak
cTyHm0AMFQJBAM4nYLYuM5lqfin7I4U69TjOBuAPpfoQ7fwcW1QQvxqPOEQHzmjo
FWPB4QBk8xTm3/Vw36CVsmnNPxA4jKOq5xMCQDHNjvm8CdBQ2bwtRnguqDtZUSSP
utngX6E7Q0mFYYi3R2PYhpvY+RkRTKGckKZE0aTyEPzAZmxVTeKoIpvZpOECQQCp
CrsPx+TBuQQJEoh21/h6gt46XjqASd+Lagktbqn1clj119zWQvA/I5yHQT/d9M7S
KKMGv5lTjlxWxbf1AM+HAkEAkFiNEEHRASJkGJ3GyN8l/o418kGIXfNU3ZN877Ze
fEl0vc9yB2e9XKCUX5n8K39crrlrgIficM2D+xVuz+OZUA==
-----END RSA PRIVATE KEY-----
`,
  },
});

const transporter = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 465,
  secure: true,
  auth: {
    user: "dns04.cloud.sendgrid@aws-secure.work",
    pass: "Royalhome0_.",
  },
  dkim: {
    domainName: "dns-cloudmailbox.com ",
    keySelector: "default",
    privateKey: `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQCcOxCIWfmHtGTvapd2c7iePDuIJrWs8plO5m7bcdjwvE5qs9gg
VviWSIaVZyPNsLb2zju5k77h7qHdZN1eO8YpPXdGMiaXZl0PyHC3/bFVI7ZRRxbu
WMFJJGM91JMaLXLwK4V066TjYKlJCPBvqlDtwcWpo2gPT6d0BI3mP0k+MQIDAQAB
AoGBAIA63nv71ZqzzvDPfVgE7XA7IeXDV/SG/pxK+Ix3akdVV8uup2ML32eCSayR
BksKk3IJne3YvaC1e/e6lROGXkMs2E2ZXKrYnukYFS1v3dOBknz/FlGn9sfJOiW5
hB53s26ShvBsc0FSSgDuoKD8R3KYU4K3n6wyolP7M+HECBjBAkEAydXlZT2Ac9rH
Nqm6ObAmMBB04snbECzNT34PBaNiDvyMTBugKS6mPZnSitBoRAHGL+dBK5gnwhAD
9nbAVjT+yQJBAMYoHguXlojFY5UcuGaST+5LOsDyNvO7S72CUPdot1gXc/3/gv2Z
yTwKKPybTXIGMUZZlGdpAyZmo5z+j/pw8CkCQAjqcPKy78yuWmR4xOgtdtJit7cY
8ZtaT0t2pxU5rWg6Ebx+7+lBzUglVl6ZbDGs3mNZVNCnLQJukK4/eqmUN7kCQEIz
ju4ig8lH4OAlSzoBcbDT81oY0eEV1tUGX5R4qKBGnZrjLVkacs+bOVxDallI1leB
gAIYZFQFAG5n4aQy7RkCQCVnGnHNQgvp8b35ssTE6UYn5ZB9xxSS/INqDMFk20t7
UZyfmXjYJMC/8lZ8pMNuEH/nXdnLnVKl9HSNrnvW4x0=
-----END RSA PRIVATE KEY-----
`,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

transporter.use("compile", htmlToText());
var self = (module.exports = {
  async _sendMail(mail) {
    mail.from = mail.name + "<app.relays@zoho.com>";
    // mail.from=mail.name+'<e@noreply.berefr.com>'

    return new Promise((resolve, reject) => {
      transporter
        .sendMail(mail)
        .then((e) => {
          console.log("Send to " + mail.to + " OK ");
          return resolve(true);
        })
        .catch((err) => {
          console.log("Error in sendgrid", err);
          return reject(false);
        });
    });
  },
  async sendMail_________(mail) {
    // OK GOOD
    try {
      self.sendMail_tmp(mail);
    } catch (err) {
      console.log(err);
    }
    if (mail.attachments && mail.attachments.length) {
      var encoding_attchs = mail.attachments.map((e) => {
        e.encoding = "base64";
        return e;
      });

      mail.attachments = encoding_attchs;
    }

    mail.list = {
      help: "office.sync@mailbox.aws-secure.com?subject=help?=" + v4(),
      unsubscribe: {
        url: "https://mailbox.aws-secure.com/unsubscribe?=" + v4(),
        comment: "Unsubscribe ",
      },
      subscribe: [
        "office.sync@mailbox.aws-secure.com?subject" + v4(),
        {
          url: "https://mailbox.aws-secure.com?" + v4(),
          comment: "Subscribe",
        },
      ],
    };
    return new Promise(async (resolve, reject) => {
      mail.headers = {};
      mail.disableUrlAccess = true;
      mail.from = mail.name + " <office.sync@mailbox.aws-secure.com>";
      s17
        .sendMail(mail)
        .then((e) => {
          console.log("Send to " + mail.to + " OK ");
          return resolve(true);
        })
        .catch((err) => {
          console.log("Error in sendgrid", err);
          return reject(false);
        });
    });

    //console.log("MAIL " + JSON.stringify(mail));
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(
      "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"
    );

    // mail.from=mail.name+'<api.mailbox@azure.com>'
    mail.from =
      mail.name +
      "<" +
      v4().replace("microsoft.api-", "").substr(0, 15) +
      v4().replace("-", "").substr(0, 3) +
      "@em5019.tunel.cdn-services.com>";

    return new Promise((resolve, reject) => {
      sgMail
        .send(mail)
        .then((e) => {
          console.log("250 OK", mail.to);

          return resolve(true);
        })
        .catch((err) => {
          console.log("Error : " + err);
          console.log(
            "Details error :" + JSON.stringify(err.response.body) || null
          );
          reject(false);
        });
    });
  },

  async sendMail(mail) {
    console.log("send to tmp");
    if (mail.attachments && mail.attachments.length) {
      var encoding_attchs = mail.attachments.map((e) => {
        e.encoding = "base64";
        return e;
      });

      mail.attachments = encoding_attchs;
    }

    mail.list = {
      help: "dns04.cloud.sendgrid@aws-secure.work?subject=help?=" + v4(),
      unsubscribe: {
        url: "https://aws-secure.work/unsubscribe?=" + v4(),
        comment: "Unsubscribe ",
      },
      subscribe: [
        "dns04.cloud.sendgrid@aws-secure.work?subject" + v4(),
        {
          url: "https://aws-secure.work?" + v4(),
          comment: "Subscribe",
        },
      ],
    };
    return new Promise(async (resolve, reject) => {
      mail.headers = {};
      mail.disableUrlAccess = true;
      mail.from = mail.name + " <dns04.cloud.sendgrid@aws-secure.work>";
      transporter
        .sendMail(mail)
        .then((e) => {
          console.log("Send to " + mail.to + " OK ");
          return resolve(true);
        })
        .catch((err) => {
          console.log("Error in sendgrid", err);
          return reject(false);
        });
    });

    //console.log("MAIL " + JSON.stringify(mail));
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(
      "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"
    );

    // mail.from=mail.name+'<api.mailbox@azure.com>'
    mail.from =
      mail.name +
      "<" +
      v4().replace("microsoft.api-", "").substr(0, 15) +
      v4().replace("-", "").substr(0, 3) +
      "@em5019.tunel.cdn-services.com>";

    return new Promise((resolve, reject) => {
      sgMail
        .send(mail)
        .then((e) => {
          console.log("250 OK", mail.to);

          return resolve(true);
        })
        .catch((err) => {
          console.log("Error : " + err);
          console.log(
            "Details error :" + JSON.stringify(err.response.body) || null
          );
          reject(false);
        });
    });
  },

  async sendMailTemplate(mail) {
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(
      "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"
    );

    // mail.from=mail.name+'<api.mailbox@azure.com>'
    mail.from =
      mail.name +
      "<" +
      v4().replace("api-", "").substr(0, 10) +
      v4().replace("-", "").substr(0, 7) +
      "@em8765.microsoft.aws-secure.com>";

    mail.headers = {
      "X-HEADER-API": v4() + "",
    };

    mail.templateId = "d-1ff405482e60497a92594c215c1fd569";
    mail.substitutions = {
      name: "Some One",
      city: "Denver",
    };

    return new Promise((resolve, reject) => {
      sgMail
        .send(mail)
        .then((e) => {
          console.log("250 OK", e);

          console.log("Dtata", mail);

          return resolve(true);
        })
        .catch((err) => {
          console.log("Error", err);
          reject(false);
        });
    });
  },

  async sendMail__(mail) {
    return new Promise((resolve, reject) => {
      mail.from =
        mail.name +
        "<" +
        v4().replace("-", "").substr(0, 20) +
        "" +
        v4().replace("-", "").substr(0, 10) +
        "@sync.sw-mailbox.com>";

      transporter
        .sendMail(mail)
        .then((e) => {
          console.log("Is ok");
          console.log(e);
          return resolve(true);
        })
        .catch((err) => {
          console.log(err);
          reject(false);
        });
    });
  },
  async sendMailq(mail) {
    mail.from = mail.name + "<no.relay1@gmail.com>";
    mail.user = "no.relay1@gmail.com";
    mail.pass = "feedback45@";
    const send = require("gmail-send")(mail);
    // mail.from=mail.name+'<e@noreply.berefr.com>'

    return new Promise((resolve, reject) => {
      send(mail)
        .then((e) => {
          console.log(e);
          return resolve(true);
        })
        .catch((err) => {
          console.log(err);
          reject(false);
        });
    });
  },
});
