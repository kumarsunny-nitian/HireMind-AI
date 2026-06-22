const dns = require("dns");

dns.resolveSrv(
  "_mongodb._tcp.cluster0.qv4m1rw.mongodb.net",
  (err, addresses) => {
    if (err) {
      console.error(err);
    } else {
      console.log(addresses);
    }
  }
);