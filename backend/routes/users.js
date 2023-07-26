const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const {database} = require('../config/helpers'); //importa oggetto data base dal **

//se non esistono i dati insert user 
router.post("/register", async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      let hashedPassword = await bcrypt.hash(password, 8);
      
      console.log('email', email);
  
      // Esegue una chiamata asincrona per ottenere tutti gli utenti dal database
      database.table('users').getAll().then(users => {
        // Verifica se l'email esiste già tra gli utenti
        //è necessario fare così dato che la chiamata al db è asincrona
        const emailExists = users.some(user => user.email === email);
  
        if (emailExists) {
          console.log("L'email è già presente, puoi loggarti");
          res.status(409).json({ message: "L'email è già registrata, puoi loggarti" });
        } else {
          console.log('Perfetto, registrazione utente in corso...');
          
          database.table('users').insert({
            password: hashedPassword,
            email : email
          })

          res.status(200).json({ message: 'Dati inseriti nel database con successo!' });
        }
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

// se esistono i dati permette accesso
router.post('/login',async (req, res) =>{
    try{
        const email = req.body.email;
        const password = req.body.password;
        let hashedPassword = await bcrypt.hash(password, 8);

        console.log(email);
        console.log(password);
        console.log(hashedPassword);

        database.table('users').getAll().then(users => {
            // Verifica se l'email esiste già tra gli utenti
            //è necessario fare così dato che la chiamata al db è asincrona
            const emailExists = users.some(user => user.email === email);
      
            if (emailExists) {
              console.log("L'email è presente, tocca controllare la password");

              const passwordMatch = users.some(user => user.password === hashedPassword);

              if(passwordMatch){
                console.log("la password combacia, eseguo l'accesso...");



              }else{
                console.log('password non corretta. riprovare')
              }

            }else {
              console.log("L'email inserita non esiste, riprovare");

            }
        });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
});

module.exports = router;