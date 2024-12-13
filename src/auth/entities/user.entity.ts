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
import { Booking } from '../../booking/entities/booking.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  national_id: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'uuid' })
  phone_country_id: string;

  @Column({ type: 'uuid' })
  country_id: string;

  @Column({ type: 'uuid' })
  city_id: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ select: false })
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

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

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
