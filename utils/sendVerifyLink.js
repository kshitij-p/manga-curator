const nodemailer = require('nodemailer');

const CustomError = require('./customError')

const genVerifyMessage = (link, host)=> {
    let message = `
    Click on this link to verify your account or copy and paste it in your browser: ${host}${link}
    
    This was mail was sent automatically, please do not reply to it.`

    return message;
}

const genResetMessage = (link, host)=> {
    let message = `
    Click on this link to reset your password or copy and paste it in your browser: ${host}${link}
    
    This was mail was sent automatically, please do not reply to it.`

    return message;
}


const getMailer = async () => {
    let mailer = await nodemailer.createTransport({
        host: process.env.MAILER_HOST,
        port: process.env.MAILER_PORT,
        auth: {
            user: process.env.MAILER_USER,
            pass: process.env.MAILER_KEY
        }
    })
    return mailer;
}

const sendMail = async (mail, mailer) => {
    try {
        let { subject, text, to, from } = mail;
        let sentMail = await mailer.sendMail({
            from: from,
            to: to,
            text: text,
            subject: subject
        })
    } catch (e) {
        throw new CustomError(`Couldn't deliver mail: ${e.message}`, 500);
    }

}

const sendVerifyLink = async (link, to, host) => {
    let mailer = await getMailer();
    let text = genVerifyMessage(link, host);
    let mail = { from: "mangacurator@no-reply.com", subject: "MangaCurator verification link", text: text, to: to }
    sendMail(mail, mailer);
}

const sendresetLink = async(link, to, host)=> {
    let mailer = await getMailer();
    let text = genResetMessage(link, host);
    let mail = { from: "mangacurator@no-reply.com", subject: "MangaCurator password reset link", text: text, to: to }
    sendMail(mail, mailer);
}

module.exports = {sendVerifyLink, sendresetLink};


