import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Expose } from 'class-transformer';
import { User } from './user.entity';

@Entity()
export class Country {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  iso_code: string;

  @Column()
  calling_code: string;

  // relations
  @OneToMany(() => User, (user) => user.phone_country)
  user_phones: User[];

  @Expose({ toPlainOnly: true })
  get flag(): string {
    return `https://flagcdn.com/w160/${this.iso_code.toLowerCase()}.png`;
  }
}
