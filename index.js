const request = require('request-promise');
const cheerio = require('cheerio');
const Telegraf = require('telegraf');
const { Console } = require('console');
const bot = new Telegraf(process.env.KEY_TOKEN)

bot.command('estado', (ctx) =>{
    let initreturn = init();
    const awaitBACKUP = async (initreturn) =>{
        let shopstore = await initreturn;
        let {isStock, button, specialprice, name} = shopstore;
        let products = {
            isStock,
            button,
            specialprice,
            name
          };
        console.log(products);
        if(products.isStock){
            ctx.reply(`${products.name}\nStock: Hay stock\nPrecio Especial: ${products.specialprice}\n`)
        }
        else{
            ctx.reply(`${products.name}\nStock: No hay stock\nPrecio Especial: ${products.specialprice}\n`)
    }
}
awaitBACKUP(initreturn);
})

bot.launch();

async function init(){
    const $ = await request({
        uri : 'https://compragamer.com/producto/teclado_redragon_k552_kumara_mecanico_white_rgb_espa_ol_8965?redir=1&nro_max=50',
        transform: body => cheerio.load(body)
    });

    var sinstock = "SIN STOCK";

    const botoncomprar = $('.card-btns__add').text().trim();

    const precioespecial = $('.precioEspecial').text().replace('Precio especial',"").trim();

    const nombre = $('h1').text().trim();

    let storeprops = {
        isStock: false,
        button: botoncomprar,
        specialprice: precioespecial,
        name: nombre
    };

    if(botoncomprar != sinstock){
        storeprops.isStock=true;
        return storeprops;
        //return storeprops.isStock=true;
    }else{
        storeprops.isStock=false;
        return storeprops;

    }
}
