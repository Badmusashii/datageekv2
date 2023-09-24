import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Media } from 'src/media/entities/media.entity';

@Entity('platforms')
export class Platform {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  PlatformConstructor: string;

  @ManyToMany(() => Media, (media) => media.platforms)
  @JoinTable({
    name: 'media_platforms',
    joinColumn: {
      name: 'platform_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'media_id',
      referencedColumnName: 'id',
    },
  })
  medias: Media[];
}
