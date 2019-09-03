import {
  Entity, Column, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
import { Clothes } from './Clothes';

@Entity({ synchronize: false })
export class Brands {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @OneToMany(type => Clothes, cloth => cloth.brand)
    clothes: Clothes[];
}
