import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Userdg } from 'src/userdg/entities/userdg.entity';
import { Platform } from 'src/platforms/entities/platform.entity';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  publisher: string;

  @Column({ nullable: true })
  yearofrelease: number;

  @ManyToMany(() => Userdg)
  users: Userdg[];

  @ManyToMany(() => Platform)
  platforms: Platform[];
}
