import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'typeSizes'})
export class TypeToSize {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column('int')
    public typeId: number;

    @Column('int')
    public sizeId: number;
}
