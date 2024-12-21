import { Country } from '../auth/entities/country.entity';
import { User } from '../auth/entities/user.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection, getRepository } from 'typeorm';
import { City } from '../auth/entities/city.entity';
import { Branch } from '../booking/entities/branch.entity';
import { Booking } from '../booking/entities/booking.entity';

export default class UserSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const countries = {
      name: 'Egypt',
      iso_code: 'EG',
      calling_code: '+20',
    };
    // save the country and get the id
    const country = await connection
      .createQueryBuilder()
      .insert()
      .into(Country)
      .values([countries])
      .execute();
    const country_id = country.identifiers[0].id;
    // save cities
    const cities = [
      {
        name: 'Cairo',
        country_id,
      },
      {
        name: 'Alexandria',
        country_id,
      },
      {
        name: 'Giza',
        country_id,
      },
    ];
    // save the cities and get the id
    const city = await connection
      .createQueryBuilder()
      .insert()
      .into(City)
      .values(cities)
      .execute();
    const cairo_id = city.identifiers[0].id;
    const alexandria_id = city.identifiers[1].id;
    const giza_id = city.identifiers[2].id;

    const dummy_location = () =>
      `ST_GeomFromText('POINT(-0.1412 51.557)', 4326)`;
    // save the branches and get the id
    const branch = await connection
      .createQueryBuilder()
      .insert()
      .into(Branch)
      .values([
        {
          name: 'Nasr city',
          country_id,
          city_id: cairo_id,
          swift_code: 'NBEGEGCX563',
          location: dummy_location,
        },
        {
          name: 'Alexandria',
          country_id,
          city_id: alexandria_id,
          swift_code: 'CIBEEGCX140',
          location: dummy_location,
        },
        {
          name: 'Mohandseen',
          country_id,
          city_id: giza_id,
          swift_code: 'ARABEGCX',
          location: dummy_location,
        },
      ])
      .execute();

    const user = getRepository(User).create({
      first_name: 'Rahma',
      last_name: 'Abd elkhalek',
      national_id: '11223344556677',
      email: 'rahmaeid326@gmail.com',
      phone_country_id: country_id,
      city_id: alexandria_id,
      country_id: country_id,
      phone_number: '1211185562',
      password: 'Aa1234567',
    });

    await getRepository(User).save(user);

    // get user id
    const user_id = user.id;

    // get the current date plus 20 day
    const date = new Date();
    date.setDate(date.getDate() + 20);
    // create a booking for the user
    await connection
      .createQueryBuilder()
      .insert()
      .into(Booking)
      .values([
        {
          user_id,
          branch_id: branch.identifiers[1].id,
          date,
        },
      ])
      .execute();
  }
}
