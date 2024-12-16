import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { SocialLoginProvider } from "./social-login-provider.entity";
import { Otp } from "./otp.entity";
import { Book } from "./book.entity";
import { UserRole } from "../../shared/types";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: "varchar", length: 255, unique: true })
    email: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    password?: string;

    @OneToOne(
        () => SocialLoginProvider,
        (socialLoginProvider) => socialLoginProvider.user,
        { nullable: true, onDelete: 'SET NULL' }
    )
    @JoinColumn()
    socialLoginProvider?: SocialLoginProvider

    @OneToOne(() => Otp, (otp) => otp.user, {
        nullable: true,
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    otp?: Otp

    @Column({ type: "bool", default: false })
    otpVerified: boolean

    @Column({ type: "enum", enum: ["user", "superUser"], default: "user" })
    role: UserRole;

    @ManyToMany(
        () => Book,
        (book) => book.users,
        { cascade: true, eager: true }
    )
    @JoinTable()
    books: Book[];
}