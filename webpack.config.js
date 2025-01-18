const path=require('path')

module.exports={
    mode:'development',
    entry:{
    login:'./assets/js/login.js',
    cart:'./assets/js/addcart.js',
    profile:'./assets/js/profile.js',
    farmerprofile:'./assets/js/farmerprofile.js',
    inventory:'./assets/js/inventory.js',
    mytransactions: './assets/js/transactions.js',
    dashboard:'./assets/js/dashboard.js',
},
    output:{
        path:path.resolve(__dirname),
        filename:'[name].bundle.js'
    },
    watch:true
}