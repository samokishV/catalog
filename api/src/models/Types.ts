import {
  Entity, Column, ManyToMany, JoinTable, PrimaryGeneratedColumn,
} from 'typeorm';
import { Sizes } from './Sizes';

@Entity({ synchronize: false })
export class Types {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @ManyToMany(() => Sizes)
    @JoinTable({
      name: 'typeSizes',
      joinColumns: [
        { name: 'typeId' },
      ],
      inverseJoinColumns: [
        { name: 'sizeId' },
      ],
    })
    public sizes: Sizes[];
}
