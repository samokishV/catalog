import {
  Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn,
} from 'typeorm';
import { Clothes } from './Clothes';
import { Sizes } from './Sizes';

@Entity({ name: 'clothSizes'})

export class ClothSize {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column('int')
    public clothId: number;

    @Column('int')
    public sizeId: number;
}
