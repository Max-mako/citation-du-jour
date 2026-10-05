const request = require('supertest');
const app = require('../server');

describe('Tests Fonctionnels de l\'API Citations', () => {

  // Test Unitaire / Fonctionnel : Vérifier que la route GET répond bien en JSON
  it('Devrait retourner une liste (statut 200)', async () => {
    const res = await request(app).get('/api/citations');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  // Test Fonctionnel : Rejet d'une requête POST invalide
  it('Devrait rejeter une citation sans texte (statut 400)', async () => {
    const res = await request(app)
      .post('/api/citations')
      .send({ auteur: 'Max' }); // Il manque le texte

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('erreur', 'Texte requis.');
  });

});