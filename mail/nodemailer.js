const nodemailer = require("nodemailer");

module.exports = {
  async testSMTP(config = {}) {
    const transporter = nodemailer.createTransport(config);

    return new Promise(async (resolve, reject) => {
      await transporter
        .verify()
        .then((e) => {
          console.log(e);
          resolve(e);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  },

  async sendnodemailer(config = {}, mail = {}) {
    const transporter = nodemailer.createTransport(config);

    return new Promise(async (resolve, reject) => {
      await transporter
        .sendMail(mail)
        .then((e) => {
          console.log(e);

          resolve(e);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  },
};
