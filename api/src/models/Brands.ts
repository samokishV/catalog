import {Entity, PrimaryColumn, Column, OneToMany} from "typeorm";
import { Clothes } from "./Clothes";

@Entity({ synchronize: false })
export class Brands {

    @PrimaryColumn()
    id: number;

    @Column("text")
    name: string;

    @OneToMany(type => Clothes, cloth => cloth.brand)
    clothes: Clothes[];
}