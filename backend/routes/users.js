const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers'); //importa oggetto data base dal **

router.post("/register", (req,res)=>{
    try{
    const email = req.body.email;
    console.log('email', email);
    res.status(200).json({ message: 'Dati inseriti nel database con successo!' });
    }
    catch(err){
        res.status(400).json({ message: err.message})
    }
})



module.exports = router;