import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { Clothes } from "./Clothes";
import { Sizes } from "./Sizes";

@Entity({name: "clothSizes"})
export class ClothToSize {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column("int")
    public clothId: number;

    @Column("int")
    public sizeId: number;

    @ManyToOne(type => Clothes, cloth => cloth.clothToSizes)
    @JoinColumn({ name: "clothId" })
    public cloth: Clothes;

    @ManyToOne(type => Sizes, size => size.clothToSizes)
    @JoinColumn({ name: "sizeId" })
    public size: Sizes;
}