import { Column, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { SocialLoginProvider } from "./social-login-provider.entity";
import { Otp } from "./otp.entity";
import { User } from "./user.entity";

export enum UserRole {
    user,
    superUser,
}

@Entity()
export class Book {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: "varchar", length: 255 })
    title: string;

    @Column({ type: "varchar", length: 255 })
    author: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @ManyToMany(() => User, (user) => user.books)
    users: User[]
}