import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ synchronize: false })

export class Sizes {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    value: string;
}
