import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Media } from 'src/media/entities/media.entity';
import { Userdg } from 'src/userdg/entities/userdg.entity';

@Entity('platforms')
export class Platform {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  platformconstructor: string;

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

  @ManyToMany(() => Userdg, (user) => user.platforms)
  @JoinTable({
    name: 'user_platforms',
    joinColumn: {
      name: 'platform_id', // nom de la colonne dans la table de jointure qui référencera cette entité
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userdg_id', // nom de la colonne dans la table de jointure qui référencera l'entité Userdg
      referencedColumnName: 'id',
    },
  })
  users: Userdg[];
}
