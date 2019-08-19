import {Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToOne, OneToMany, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn} from "typeorm";
import {Brands} from "./Brands";
import {Types} from "./Types";
import {Sizes} from "./Sizes";
import {ClothToSize} from './ClothToSizes';

@Entity({ synchronize: false })
export class Clothes {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    name: string;

    @Column("int")
    brandId: number;

    @Column("int")
    typeId: number;

    @ManyToOne(type => Brands, (brand) => brand.clothes)
    @JoinColumn({ name: "brandId" })
    brand: Brands;

    @OneToOne(type => Types)
    @JoinColumn({ name: "typeId" })
    type: Types;

    @ManyToMany(() => Sizes) 
    @JoinTable({ 
        name: "clothSizes",
        joinColumns: [
            { name: 'clothId' }
        ],
        inverseJoinColumns: [
            { name: 'sizeId' }
        ]
    })
    public sizes: Sizes[];
}
