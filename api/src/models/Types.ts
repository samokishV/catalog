import {Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable} from "typeorm";
import { Sizes } from "./Sizes";

@Entity({ synchronize: false })
export class Types {

    @PrimaryColumn()
    id: number;

    @Column("text")
    name: string;

    @ManyToMany(() => Sizes) 
    @JoinTable({ 
        name: "typeSizes",
        joinColumns: [
            { name: 'typeId' }
        ],
        inverseJoinColumns: [
            { name: 'sizeId' }
        ]
    })
    public sizes: Sizes[];
}
