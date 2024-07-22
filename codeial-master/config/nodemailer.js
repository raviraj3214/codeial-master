const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, //two step authentication is false for login,
    auth:{
        user: 'projecttest62@gmail.com',
        pass: 'opfijdsmxwgtdmcx'
    }
})


let renderTemplate = (data, relativePath) =>{
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template){
            if(err){console.log("err in rendering template..", err); return};

            mailHTML = template;
        }
    )

    return mailHTML;
}

module.exports ={
    transporter: transporter,
    renderTemplate : renderTemplate
}