import express from 'express';
import expressEjsLayouts from 'express-ejs-layouts';
import { addToCart, formatAmount } from './utils/helpers.js';
import Swal from 'sweetalert2'
const app = express();
const port = 5000;
app.set('view engine', 'ejs');

app.use(express.static('public'));
//Use Exports
app.use('/css', express.static('public/css'));
app.use('/images', express.static('public/images'));
app.use('/js', express.static('public/js'));
app.use('/vendor', express.static('public/vendor'));




app.use(expressEjsLayouts);
app.set('view engine', 'ejs');

app.get('', async(req, res) => {
    const query = req.query.q || ''
    try{
       let response;
       if (query) {
        response = await fetch(
            `https://weee.life/biosky/v1/product?query=${query.toLowerCase()}`
        );
        } else {
        response = await fetch("https://weee.life/biosky/v1/product");
        }
        const data = await response.json();
         res.render('index', 
         {
           title: 'Home Page',
           items: data.data,
           formatAmount: formatAmount
        })
    }catch(e){
        console.log('log', e)
    }
})

app.get('/shop', async(req, res) => {

    const query = req.query.q || ''
    try{
       let response;
       if (query) {
        response = await fetch(
            `https://weee.life/biosky/v1/product?query=${query.toLowerCase()}`
        );
        } else {
        response = await fetch("https://weee.life/biosky/v1/product");
        }
        const data = await response.json();
        res.render('shop', {
            items: data.data,
            layout: './layout/main',  
            title: 'Shop Page',
            formatAmount: formatAmount
        })
    }catch(e){
        console.log('log', e)
    }
    
})

app.get('/cart', async(req, res)=>{
    const query = req.query.q || '';

        if(query){
           res.redirect(`shop?q=${query}`)
           return;
        }
    res.render('cart',{ layout: './layout/main'});
})


app.get('/product-details', async(req, res)=>{
    const productId = req.query.id || '';
    if(!productId)return;
    let response;
    try{
        response = await fetch(
            `https://weee.life/biosky/v1/product/${productId}`
          );
          
          const responseJson = await response.json()
          res.render('product-details',{ layout: './layout/main', item: responseJson.data, formatAmount, addToCart })

    }catch(e){
        console.error('e', e)
    }
})

app.get('/checkout', async (req, res) => {
    res.render('checkout', { layout: './layout/main', swal: Swal} )
})

app.listen(port, ()=> console.info(`App listening on port ${port}`))