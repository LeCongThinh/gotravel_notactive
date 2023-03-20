import * as process from "process";

export default () => ({
    database: {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10) || 5432
    },
    mail: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        username: process.env.MAIL_USER,
        password: process.env.MAIL_PASSWORD,
        mail_from: process.env.MAIL_FROM
    }
});