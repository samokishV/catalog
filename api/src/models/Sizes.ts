import {Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable} from "typeorm";

@Entity({ synchronize: false })
export class Sizes {

    @PrimaryColumn()
    id: number;

    @Column("text")
    value: string;
}
