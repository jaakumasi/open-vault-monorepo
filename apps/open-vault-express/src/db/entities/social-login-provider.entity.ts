import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

export enum Provider {
    none,
    google,
    facebook,
    github
}

@Entity()
export class SocialLoginProvider {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    name: string;

    @Column({ type: 'enum', enum: Provider, default: Provider.none })
    provider: Provider;

    @Column({ type: "text", nullable: true })
    profilePicUrl: string;

    @OneToOne(() => User, (user) => user.socialLoginProvider)
    user: User
} 