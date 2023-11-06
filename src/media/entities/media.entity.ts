import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Userdg } from 'src/userdg/entities/userdg.entity';
import { Platform } from 'src/platforms/entities/platform.entity';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  yearofrelease: number;

  @Column({ nullable: true })
  idapi: string;
  // @ManyToMany(() => Userdg)
  // users: Userdg[];

  // @ManyToMany(() => Platform)
  // platforms: Platform[];

  @ManyToMany(() => Userdg)
  @JoinTable({
    name: 'user_media', // Nom de la table de jointure
    joinColumn: {
      name: 'media_id', // Nom de la colonne dans la table de jointure qui référencera cette entité
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userdg_id', // Nom de la colonne dans la table de jointure qui référencera l'entité Userdg
      referencedColumnName: 'id',
    },
  })
  users: Userdg[];

  @ManyToMany(() => Platform)
  @JoinTable({
    name: 'media_platforms', // Nom de la table de jointure
    joinColumn: {
      name: 'media_id', // Nom de la colonne dans la table de jointure qui référencera cette entité
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'platform_id', // Nom de la colonne dans la table de jointure qui référencera l'entité Platform
      referencedColumnName: 'id',
    },
  })
  platforms: Platform[];
}
