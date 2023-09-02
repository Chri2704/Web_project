const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers'); //importa oggetto data base dal **
const isLogged = require("../routes/users");


/* GET ALL products*/
//in /api/products
router.get('/', isLogged, function(req, res) {

    let page = (req.query.page != undefined && req.query.page != 0) ? req.query.page : 1; //recupero valore della richiesta e controllo che non sia vuota
    const limit = (req.query.limit != undefined && req.query.limit != 0) ? req.query.limit : 15; //setta limite di items per pagina

    let startValue;
    let endValue


    if(page>0){
    startValue = (page*limit) -limit; //0,10,20,30
    endValue = page *limit;
    }else {
    startValue = 0;
    endValue = 15;
    }

    //query al db : prendo prodotti e joino con categorie che hanno stesso id
    database.table('products as p')
    .join([{
        table: 'categories as c',
        on: 'c.id = p.cat_id'
    }])
    .withFields(['c.title as category', //seleziono queli campi prendere dalla join
    'p.title as name',
    'p.price',
    'p.description',
    'p.quantity',
    'p.image',
    'p.id'

    ])
    .slice(startValue, endValue) //divido il risultato con intervalli start e end
    .sort({id:.1}) //decrescente
    .getAll()
    .then(prods =>{ //dopo una get viene usata sempre la then -> se entro nell'if definisco un json con ilcount dei prodotti e i prodotti
        console.log(prods);
        if(prods.length > 0){
            res.status(200).json({
                count: prods.length,
                products: prods

            });

        }else{ //altrimenti stampo errore
            res.json({message: 'no products founds'})
        }
    }).catch(err => console.log(err));

});


router.post("/add_product", async(req,res) =>{
    try {
        //recupero dal body password e email
        const image = req.body.image;
        const name = req.body.name;
        const category = req.body.category;
        const price = req.body.price;
        const quantity = req.body.quantity;
        const description = req.body.description;

        //inserisco i dati nel db
        database.table('products').insert({
            title:name,
            image:image,
            cat_id:category,
            price:price,
            quantity:quantity,
            description:description
        })

        res.status(200).json({ message: 'Dati inseriti nel database con successo!' });

      } catch (err) {
        res.status(400).json({ message: err.message });
      }


});

router.post('/delete', function(req,res){
    const idFront = req.body.id;

    database.table('products')
    .filter({id : idFront})
    .remove()
    .then(deleted => {
      if (deleted) {
        console.log('Prodotto eliminato con successo');
        res.status(200).json({ message: 'Prodotto eliminato con successo' });
      } else {
        console.log('Nessun prodotto trovato con questo ID');
        res.status(404).json({ message: 'Nessun prodotto trovato con questo ID' });
      }
    })
    .catch(err => {
      console.error('Errore durante l\'eliminazione del prodotto:', err);
      res.status(500).json({ message: 'Errore durante l\'eliminazione del prodotto' });
    });
});


router.post('/refresh_product', function(req,res){
    try {
        //recupero dal body password e email
        const id = req.body.id;
        const image = req.body.image;
        const name = req.body.name;
        const category = req.body.category;
        const price = req.body.price;
        const quantity = req.body.quantity;
        const description = req.body.description;

        console.log(id)
        //inserisco i dati nel db
        database.table('products')
        .filter({ id: id }) // Filtra per l'ID del prodotto
        .update({
            image:image,
            title:name,
            description:description,
            price:price,
            quantity:quantity,
        })
        .then(updatedProduct => {
            // Dopo l'aggiornamento, restituisci una risposta JSON con i dati aggiornati
            res.status(200).json({ message: 'Dati aggiornati nel database con successo!', updatedProduct: updatedProduct });
        })
        .catch(err => {
            res.status(500).json({ message: 'Errore durante l\'aggiornamento dei dati nel database.', error: err.message });
        });
      }catch (err) {
        res.status(400).json({ message: err.message });
      }
});



// GET prodotti singoli definendo l'id
router.get('/:prodId', (req, res) => {
  let productId = req.params.prodId;
  database.table('products as p') //join di prodotti e categorie
      .join([
          {
              table: "categories as c",
              on: `c.id = p.cat_id`
          }
      ])
      .withFields(['c.title as category', //campi selezionati
          'p.title as name',
          'p.price',
          'p.quantity',
          'p.description',
          'p.image',
          'p.id',
          'p.images'
      ])
      .filter({'p.id': productId}) //viene filtrato solo l'id nella get
      .get()
      .then(prod => { //controlli
          console.log(prod.id)
          if (prod) {
              res.status(200).json(prod);
          } else {
              res.json({message: `No product found with id ${productId}`});
          }
      }).catch(err => res.json(err));
});

//GET dei prodotti della stessa categoria

router.get('/category/:catName', (req, res) => { //http://localhost:3000/api/products/category/categoryName?page=1
  let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1;  //viene controllato se la la query è definita o no
  const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10;   // limite di items per pagina
  let startValue;
  let endValue;
  if (page > 0) {
      startValue = (page * limit) - limit;      // 0, 10, 20, 30
      endValue = page * limit;                  // 10, 20, 30, 40
  } else {
      startValue = 0;
      endValue = 10;
  }

  // Get category title value from param
  const cat_title = req.params.catName;

  database.table('products as p')
      .join([
          {
              table: "categories as c",
              on: `c.id = p.cat_id WHERE c.title LIKE '%${cat_title}%'`
          }
      ])
      .withFields(['c.title as category',
          'p.title as name',
          'p.price',
          'p.quantity',
          'p.description',
          'p.image',
          'p.id'
      ])
      .slice(startValue, endValue)
      .sort({id: 1})//crescente
      .getAll()
      .then(prods => {
          if (prods.length > 0) {
              res.status(200).json({
                  count: prods.length,
                  products: prods
              });
          } else {
              res.json({message: `No products found matching the category ${cat_title}`});
          }
      }).catch(err => res.json(err));

});

module.exports = router;
