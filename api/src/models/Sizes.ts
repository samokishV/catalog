import {Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable} from "typeorm";
import { ClothToSize } from "./ClothToSizes";
import { Clothes } from "./Clothes";

@Entity({ synchronize: false })
export class Sizes {

    @PrimaryColumn()
    id: number;

    @Column("text")
    value: string;

    @OneToMany((type) => ClothToSize, (clothToSize) => clothToSize.cloth)
    public clothToSizes: ClothToSize[];

    @ManyToMany(() => Clothes, (clothes) => clothes.sizes)
    clothes: Clothes[];
}
