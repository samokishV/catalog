import {Entity, PrimaryColumn, Column, OneToMany} from "typeorm";

@Entity({ synchronize: false })
export class Brands {

    @PrimaryColumn()
    id: number;

    @Column("text")
    name: string;
}