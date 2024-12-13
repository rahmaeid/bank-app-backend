import { Booking } from './booking.entity';
import { City } from '../../auth/entities/city.entity';
import { Country } from '../../auth/entities/country.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Point,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Branch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  country_id: string;

  @Column()
  city_id: string;

  @Column()
  swift_code: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
    select: false,
  })
  location: Point;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // relations
  @ManyToOne(() => City, (city) => city.branches)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @OneToMany(() => Booking, (booking) => booking.branch)
  bookings: Booking[];

  @ManyToOne(() => Country, (country) => country.branches)
  @JoinColumn({ name: 'country_id' })
  country: Country;
}
