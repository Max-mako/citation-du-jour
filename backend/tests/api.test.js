const request = require('supertest');
const app = require('../server');

describe('Tests Fonctionnels de l\'API Citations (Vraie BDD)', () => {
  
  it('Devrait retourner une liste (statut 200)', async () => {
    const res = await request(app).get('/api/citations');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('Devrait rejeter une citation sans texte (statut 400)', async () => {
    const res = await request(app)
      .post('/api/citations')
      .send({ auteur: 'Max' });
    
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('erreur', 'Texte requis.');
  });

});