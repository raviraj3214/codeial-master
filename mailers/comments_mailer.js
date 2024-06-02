const nodemailer = require('../config/nodemailer');


exports.newComment = (comment)=>{

    let htmlString = nodemailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');
    // console.log("inside comment out: ", comment);
    nodemailer.transporter.sendMail({
        from:'projecttest62@gmail.com',
        to: comment.user.email,
        subject:'New comment Published',
        html: htmlString
    }, (err, info)=>{
        if(err){console.log("err in sending mail...", err); return};

        console.log('Message sent......', info);
        return;
    })  
}