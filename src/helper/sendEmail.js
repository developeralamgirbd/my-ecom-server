const sgMail = require('@sendgrid/mail');

const sendEmail = async (EmailTo, EmailText, EmailSubject) => {
    sgMail.setApiKey(process.env.SENDGRID_KEY);
    // const fromEmail =
    const mailOptions = {
        to: EmailTo,
        from: `MY E-Commerce <${process.env.SENDGRID_EMAIL_FROM}>`,
        subject: EmailSubject,
        text: EmailText
    }

    return sgMail.send(mailOptions);

}
module.exports= sendEmail