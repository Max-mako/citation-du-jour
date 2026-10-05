const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration de la connexion PostgreSQL via les variables d'environnement
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
});

app.use(cors());
app.use(express.json());

// GET : Récupérer toutes les citations
app.get('/api/citations', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM citations ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erreur: "Erreur serveur de base de données" });
    }
});

// POST : Ajouter une citation
app.post('/api/citations', async (req, res) => {
    const { texte, auteur } = req.body;
    if (!texte) return res.status(400).json({ erreur: "Texte requis." });

    const date = new Date().toLocaleDateString('fr-FR');
    const nomAuteur = auteur || "Anonyme";

    try {
        const result = await pool.query(
            'INSERT INTO citations (texte, auteur, likes, date) VALUES ($1, $2, 0, $3) RETURNING *',
            [texte, nomAuteur, date]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erreur: "Erreur lors de l'insertion" });
    }
});

// POST : Liker une citation
app.post('/api/citations/:id/like', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await pool.query(
            'UPDATE citations SET likes = likes + 1 WHERE id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) return res.status(404).json({ erreur: "Citation non trouvée." });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erreur: "Erreur lors de la mise à jour" });
    }
});

// DELETE : Supprimer une citation
app.delete('/api/citations/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await pool.query('DELETE FROM citations WHERE id = $1 RETURNING *');
        if (result.rows.length === 0) return res.status(404).json({ erreur: "Citation non trouvée." });
        res.status(200).json({ message: "Citation supprimée avec succès." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erreur: "Erreur lors de la suppression" });
    }
});

// On n'écoute sur le port que si le fichier est exécuté directement (pas lors des tests)
if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Backend démarré et en écoute sur le port ${PORT}`);
    });
}

// Export de l'application pour les tests fonctionnels
module.exports = app;
//test