import BadRequestError from './badRequest.error.model';
import DatabaseError from './database.error.model';
import ForbiddenError from './forbidden.error.model';

describe('Errors', () => {
  it('(Errors) - Should be able return the correct error', async () => {
    const erroForbiddenError = new ForbiddenError('Teste Error');
    expect(erroForbiddenError).toBeInstanceOf(ForbiddenError);
    expect(erroForbiddenError).toHaveProperty('message', 'Teste Error');

    const erroDatabaseError = new DatabaseError('Teste Error');
    expect(erroDatabaseError).toBeInstanceOf(DatabaseError);
    expect(erroDatabaseError).toHaveProperty('message', 'Teste Error');

    const erroBadRequestError = new BadRequestError('Teste Error');
    expect(erroBadRequestError).toBeInstanceOf(BadRequestError);
    expect(erroBadRequestError).toHaveProperty('message', 'Teste Error');
  });
});
