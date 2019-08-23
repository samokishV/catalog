import {
  Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable, PrimaryGeneratedColumn,
} from 'typeorm';

import { Clothes } from './Clothes';

@Entity({ synchronize: false})

export class Sizes {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    value: string;
}
