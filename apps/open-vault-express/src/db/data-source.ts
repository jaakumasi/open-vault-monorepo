import { DataSource } from "typeorm";
import { User } from "./entities/user.entity";
import { Otp } from "./entities/otp.entity";
import { SocialLoginProvider } from "./entities/social-login-provider.entity";
import { Book } from "./entities/book.entity";

export default new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    logging: true,
    synchronize: true,
    entities: [
        Book,
        Otp,
        User,
        SocialLoginProvider
    ]
});

