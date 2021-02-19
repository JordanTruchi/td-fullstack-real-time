/**
 * @file Main server
 */

const mongoose = require("mongoose"),
      admin = require("firebase-admin"),
      serviceAccount = require("./firebaseconf.json");

      const app = require('~Boot/app'),
      http = require('http'),
      options = {
        cors: {
          origin: "*",
          creadentials: false
        },
        allowEIO3: true
      },
      server = http.Server(app);

global.io = require('socket.io')(server, options);
      

(async () => {
  try {

    
    
    const { 
      SERVER_PORT,
      SERVER_HOST_NAME,
      DATABASE_USER: user,
      DATABASE_PASSWORD: password,
      DATABASE_NAME: database,
      CLUSTER_NAME: cluster,
     } = process.env;

     // établissement de la connexion
     

     admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    /**
     * 1°) Database connection
     */
    const loginString = `mongodb+srv://${user}:${password}@${cluster}.szlbe.mongodb.net/${database}?retryWrites=true&w=majority`;
    await mongoose.connect(loginString, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connection to Database has been established successfully.');

    /**
     * 2°) Create and launch HTTP Server
     */

    server.listen(+SERVER_PORT, SERVER_HOST_NAME, () => {
      console.info(`Insta Clone APP: HTTP server launched at ${SERVER_HOST_NAME}:${SERVER_PORT}`);
    });


  } catch({ message }) {
    console.error(`Failed to launch Insta Clone APP => ${message}`);
    process.exit(1);
  }
})();