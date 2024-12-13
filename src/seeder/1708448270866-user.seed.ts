import { Country } from '../auth/entities/country.entity';
import { User } from '../auth/entities/user.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection, getRepository } from 'typeorm';

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

    const user = getRepository(User).create({
      first_name: 'Rahma',
      last_name: 'Abd elkhalek',
      national_id: '29803300201053',
      email: 'rahmaeid326@gmail.com',
      phone_country_id: country.identifiers[0].id,
      phone_number: '1211185562',
      password: 'Qwerty123',
    });

    await getRepository(User).save(user);
  }
}
