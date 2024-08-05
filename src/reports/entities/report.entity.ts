import { UserEntity } from "../../users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ReportEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ default: false })
    approved: boolean

    @Column()
    price: number

    @Column()
    make: string

    @Column()
    model: string

    @Column()
    year: number

    @Column()
    lng: number

    @Column()
    lat: number

    @Column()
    mileage: number

    @ManyToOne(() => UserEntity, (user) => user.reports)
    user: UserEntity

}
