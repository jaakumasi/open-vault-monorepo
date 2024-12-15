import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Otp {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: "varchar", length: 150, unique: true })
    email: string;

    @Column({ type: "varchar", length: 10, nullable: true })
    code: string;

    @OneToOne(() => User, (user) => user.otp)
    user: User
}