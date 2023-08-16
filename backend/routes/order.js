const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers'); //importa oggetto data base dal **

/* GET All orders. */
router.get('/getAllOrders', (req, res) => { //in /api/order vado a prendere tutti gli ordini
    database.table('orders_details as od') //join tra orders e orders_detail
        .join([
            {
                table: 'orders as o',
                on: 'o.id = od.order_id'
            },
            {
                table: 'products as p',
                on: 'p.id = od.product_id'
            },
            {
                table: 'users as u',
                on: 'u.id = o.user_id'
            }
        ])
        .withFields(['o.id', 'p.title', 'p.description', 'p.price', 'u.username'])
        .sort({id:1}) //ordinamento crescente
        .getAll()
        .then(orders => {
            if (orders.length > 0) {
                res.status(200).json({
                    count: orders.length,
                    ordersData: orders     //ritorna la risposta in json degl ordini presenti sul db
                });
            } else {
                res.json({message: "No orders found"});
            }

        }).catch(err => res.json(err));
});


router.post('/delete', function(req,res){
    const idFront = req.body.id;

    database.table('orders')
    .filter({id : idFront})
    .remove()
    .then(deleted => {
      if (deleted) {
        console.log('ordine eliminato con successo');
        res.status(200).json({ message: 'ordine eliminato con successo' });
      } else {
        console.log('Nessun ordine trovato con questo ID');
        res.status(404).json({ message: 'Nessun ordine trovato con questo ID' });
      }
    })
    .catch(err => {
      console.error('Errore durante l\'eliminazione dell\'ordine:', err);
      res.status(500).json({ message: 'Errore durante l\'eliminazione dell\'ordine' });
    });
});

// Get Single Order trough id:

//viene usata funzione async per restituire promessa in modo da esegire in ordine le operazioni 

router.get('/:id', async (req, res) => {
    //catturo l'id scritto nell'url in modo da recuperare jnel db l'ordine analogo
    let orderId = req.params.id;
    console.log(orderId);

    database.table('orders_details as od')
        .join([
            {
                table: 'orders as o',
                on: 'o.id = od.order_id'
            },
            {
                table: 'products as p',
                on: 'p.id = od.product_id'
            },
            {
                table: 'users as u',
                on: 'u.id = o.user_id'
            }
        ])
        .withFields(['o.id', 'p.title', 'p.description', 'p.price', 'p.image', 'od.quantity as quantityOrdered'])
        .filter({'o.id': orderId}) //filtro l'ordine di interesse
        .getAll()
        .then(orders => {
            console.log(orders.length);
            if (orders.length > 0) {
                res.json(orders); //ritorno sempre in formato json
            } else {
                res.json({message: "No orders found"});
            }

        }).catch(err => res.json(err));
});


//POSTper creazione di un nuovo ordine

router.post('/new', async (req, res) => {
    
    //prendo dal body userId e un array di oggetti che contengono id prodotto e numero nel carrello

    let {userId, products} = req.body;
    console.log(userId);
    console.log(products);

    // se utente ha un id
     if (userId !== null && userId > 0) {
        //prendo id e lo metto in orders
        database.table('orders')
            .insert({
                user_id: userId
            }).then((newOrderId) => { //successivamente creo nuovo id e gli accedo con insertId
                if (newOrderId.insertId > 0) {
                    //per ogni prodotto viene recuperata la quantità in modo da sottrarre quella del nuovo ordine 
                    products.forEach(async (p) => {


                            let data = await database.table('products').withFields(['quantity']).get(); //recupero la quantità dal db prodotti


                        let inCart = parseInt(p.inCart); //questa è la quantità nel carrello 

                    
                        //controllo la quantità disponibile e scalo la quantità del cart e successivamente controllo se viene azzerata la quantità disponibile
                        if (data.quantity > 0) {
                            data.quantity = data.quantity - inCart;

                            if (data.quantity < 0) {
                                console.log("sforato, prodotti finiti")
                                data.quantity = 0;
                            }

                        } else {
                            console.log("prodotti terminati")
                            data.quantity = 0;
                        }

                        // Inserisco nel db orders details l'id dell'ordine, del prodotto e la quantità del carrello per un riepilogo
                        database.table('orders_details')
                            .insert({ //inserisco nuovo record nella tabella con i seguenti campi
                                order_id: newOrderId.insertId,
                                product_id: p.id,
                                quantity: inCart
                            }).then(newId => {// aggiorno quantità disp sottranedo quella dell'ordine
                            database.table('products')
                                .filter({id: p.id})
                                .update({ //aggiorna quantità
                                    quantity: data.quantity
                                }).then(successNum => {
                            }).catch(err => console.log(err));
                        }).catch(err => console.log(err));
                    });

                } else {
                   return res.json({message: 'New order failed while adding order details', success: false});
                }
            res.json({ //messaggio di risposta nel quale passo i dati
                message: `Order successfully placed with order id ${newOrderId.insertId}`,
                success: true,
                order_id: newOrderId.insertId,
                products: products
            })
        }).catch(err => {return(res.json(err))});
    }

    else {
        return res.json({message: 'New order failed', success: false});
    }

});

//POST per pagamento dove viene simulato buffer operazione
router.post('/payment', (req, res) =>{
    setTimeout(()=>{
        res.status(200).json({success:true});
    }, );
});


module.exports = router;
