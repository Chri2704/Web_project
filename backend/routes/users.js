const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const {database} = require('../config/helpers'); //importa oggetto data base dal **
const jwt = require('jsonwebtoken');
const config = require('../config/helpers');
const cookieParser = require('cookie-parser');
const { promisify } = require('util');

//se non esistono i dati insert user 
router.post("/register", async (req, res) => {
    try {
      //recupero dal body password e email
      const email = req.body.email;
      const password = req.body.password;
      //faccio hashing della password per salvarla in modo criptato su db
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
          //inserisco i dati nel db
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
router.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        console.log(email);
        console.log(password);

        // Recupera l'utente dal database utilizzando l'email fornita
        const users = await database.table('users').getAll();
        console.log(users);
        // Verifica se l'email esiste tra gli utenti
        const user = users.find(user => user.email === email);

        if (user) {
            console.log("L'email è presente, tocca controllare la password");

            // Confronta la password fornita con la password hashata memorizzata nel database per quell'utente
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                console.log("la password combacia, eseguo l'accesso...");
                //prendo id utente per associarlo alla sessione
                const id = user.id;

                console.log("id: ", id)
                console.log("secret", config.env.JWT_SECRET)

                //token che si basa su secret in helper.js e id utente
                const token = jwt.sign({id}, config.env.JWT_SECRET,{
                    //setto scadenza
                    expiresIn: config.env.JWT_EXPIRE_IN
                })

                console.log("token: ", token);
                console.log("secret: ", config.env.JWT_SECRET);
                console.log("ezpire: ", config.env.JWT_EXPIRE_IN);

                //setto opzioni cookies: scadenza e accetta http
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + config.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                console.log("cookieOptions", cookieOptions)

                //cookie accetta 3 parametri, nome , token , options
                res.cookie('userSave', token, cookieOptions);
                res.status(200).json({ message: 'Dati inseriti nel database con successo!' });

            } else {
                console.log('password non corretta. riprovare');
                res.status(401).json({ message: 'Password non corretta' });
            }

        } else {
            console.log("L'email inserita non esiste, riprovare");
            res.status(401).json({ message: 'L\'email inserita non esiste' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get("/isLogged", async(req, res, next)=>{ 


    if (req.cookies.userSave) {
        try {
            // 1. Verify the token
            const decoded = await promisify(jwt.verify)(req.cookies.userSave,
                config.env.JWT_SECRET
            );
            console.log(decoded);

            // 2. controlla se l'id è ancora presente decodificando l'id del cookie
            database.table('users').getAll().then(users => {
                // Verifica se l'email esiste già tra gli utenti
                //è necessario fare così dato che la chiamata al db è asincrona
            const userExist = users.find(user => user.id === decoded.id);
        
            if (userExist) {
                console.log("il token contiene id di user esistente");
                req.user = userExist;
                res.status(200).json({ message: 'user esistente' });
            } else {
                res.status(200).json({ message: 'user non esiste' });
            }
              });
        } catch (err) {
            console.log(err)
            return next();
        }
    } else {
        next();
    }
});

router.get("/logout", async(req, res)=>{
    res.cookie('userSave', 'logout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    });
    res.status(200).json({ message: 'logout effettuato' });;
});

module.exports = router;