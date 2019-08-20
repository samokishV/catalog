import {
  Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable, PrimaryGeneratedColumn,
} from 'typeorm';
import { ClothToSize } from './ClothToSizes';
import { Clothes } from './Clothes';

@Entity({ synchronize: false })
export class Sizes {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    value: string;
}
