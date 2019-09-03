import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'clothSizes' })

export class ClothSize {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column('int')
    public clothId: number;

    @Column('int')
    public sizeId: number;
}
