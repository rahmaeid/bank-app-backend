import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { genSaltSync, hashSync } from 'bcrypt';
import { UserRefreshToken } from '../../user_refresh_token/user_refresh_token.entity';
import { Country } from './country.entity';
import { City } from './city.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  national_id: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ type: 'uuid', nullable: true })
  phone_country_id: string;

  @Column({ type: 'uuid', nullable: true })
  country_id: string;

  @Column({ type: 'uuid', nullable: true })
  city_id: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ select: false, nullable: true })
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // relations
  @ManyToOne(() => Country, (country) => country.user_phones)
  @JoinColumn({ name: 'phone_country_id' })
  phone_country: Country;

  @ManyToOne(() => Country, (country) => country.users)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @ManyToOne(() => City, (city) => city.users)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @OneToMany(() => UserRefreshToken, (refreshTokens) => refreshTokens.user)
  refreshTokens: UserRefreshToken[];

  // Pre-operations
  @BeforeInsert()
  @BeforeUpdate()
  hashPasswordAndLowercaseEmail() {
    if (this.password) {
      this.password = hashSync(this.password, genSaltSync(10));
    }
    if (this.email) {
      this.email = this.email.toLowerCase();
    }
  }
}
