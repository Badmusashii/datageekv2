import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Media } from 'src/media/entities/media.entity';
import { Platform } from 'src/platforms/entities/platform.entity';

@Entity('userdg')
export class Userdg {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToMany(() => Media)
  @JoinTable({
    name: 'user_media',
    joinColumn: {
      name: 'userdg_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'media_id',
      referencedColumnName: 'id',
    },
  })
  medias: Media[];

  @ManyToMany(() => Platform)
  @JoinTable({
    name: 'user_platforms',
    joinColumn: {
      name: 'userdg_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'platform_id',
      referencedColumnName: 'id',
    },
  })
  platforms: Platform[];
}
