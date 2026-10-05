const request = require('supertest');

// Simulation (Mock) du module pg pour éviter de chercher une vraie base de données pendant les tests
jest.mock('pg', () => {
  const mPool = {
    query: jest.fn().mockImplementation((queryText) => {
      if (queryText.includes('SELECT')) {
        return Promise.resolve({ rows: [{ id: 1, texte: 'Citation de test', auteur: 'Max', likes: 0, date: '01/01/2026' }] });
      }
      return Promise.resolve({ rows: [] });
    }),
  };
  return { Pool: jest.fn(() => mPool) };
});

const app = require('../server');

describe('Tests Fonctionnels de l\'API Citations', () => {
  
  it('Devrait retourner une liste (statut 200)', async () => {
    const res = await request(app).get('/api/citations');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('Devrait rejeter une citation sans texte (statut 400)', async () => {
    const res = await request(app)
      .post('/api/citations')
      .send({ auteur: 'Max' }); // Il manque le texte
    
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('erreur', 'Texte requis.');
  });

});