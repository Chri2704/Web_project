const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers'); //importa oggetto data base dal **

/* GET All orders. */
router.get('/', (req, res) => { //in /api/order vado a prendere tutti gli ordini
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
                res.json(orders);       //ritorna la risposta in json degl ordini presenti sul db
            } else {
                res.json({message: "No orders found"});
            }

        }).catch(err => res.json(err));
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
            console.log(orders);
            if (orders.length > 0) {
                res.json(orders); //ritorno sempre in formato json
            } else {
                res.json({message: "No orders found"});
            }

        }).catch(err => res.json(err));
});


//POSTper creazione di un nuovo ordine

router.post('/new', async (req, res) => {


    let {userId, products} = req.body;
    console.log(userId);
    console.log(products);

     if (userId !== null && userId > 0) {
        database.table('orders')
            .insert({
                user_id: userId
            }).then((newOrderId) => {

            if (newOrderId > 0) {
                //per ogni prodotto viene recuperata la quantità in modo da sottrarre quella del nuovo ordine 
                products.forEach(async (p) => {

                        let data = await database.table('products').filter({id: p.id}).withFields(['quantity']).get();



                    let inCart = parseInt(p.incart);

                    // Deduct the number of pieces ordered from the quantity in database

                    if (data.quantity > 0) {
                        data.quantity = data.quantity - inCart;

                        if (data.quantity < 0) {
                            data.quantity = 0;
                        }

                    } else {
                        data.quantity = 0;
                    }

                    // Insert order details w.r.t the newly created order Id
                    database.table('orders_details')
                        .insert({ //inserisco nuovo record nella tabella con i seguenti campi
                            order_id: newOrderId,
                            product_id: p.id,
                            quantity: inCart
                        }).then(newId => {
                        database.table('products')
                            .filter({id: p.id})
                            .update({ //aggiorna quantità
                                quantity: data.quantity
                            }).then(successNum => {
                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                });

            } else {
                res.json({message: 'New order failed while adding order details', success: false});
            }
            res.json({
                message: `Order successfully placed with order id ${newOrderId}`,
                success: true,
                order_id: newOrderId,
                products: products
            })
        }).catch(err => res.json(err));
    }

    else {
        res.json({message: 'New order failed', success: false});
    }

});

//POST per pagamento dove viene simulato buffer operazione
router.post('payment', (req, res) =>{
    setTimeout(()=>{
        res.status(200).json({success:true});
    }, 3000);
});


module.exports = router;
