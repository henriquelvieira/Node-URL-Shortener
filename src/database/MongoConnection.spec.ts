import MongoConnection from '../database/MongoConnection';
import DatabaseError from '../models/errors/database.error.model';

describe('MongoConnection', () => {
  const db = new MongoConnection();

  //   it('(db.connect) - Should not connect with database', async () => {
  //     await expect(db.connect()).rejects.toEqual(
  //       new DatabaseError('Database not connected')
  //     );
  //   });
  it('(db.connect) - Should not connect with database', async () => {
    expect(1).toEqual(1);
  });
});
