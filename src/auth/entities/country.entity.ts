import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { User } from './user.entity';
import { City } from './city.entity';
import { Branch } from '../../booking/entities/branch.entity';

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

  @OneToMany(() => User, (user) => user.country)
  users: User[];

  @OneToMany(() => City, (city) => city.country)
  cities: City[];

  @OneToMany(() => Branch, (branch) => branch.country)
  branches: Branch[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ toPlainOnly: true })
  get flag(): string {
    return `https://flagcdn.com/w160/${this.iso_code.toLowerCase()}.png`;
  }
}
