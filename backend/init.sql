-- Création de la table si elle n'existe pas
CREATE TABLE IF NOT EXISTS citations (
    id SERIAL PRIMARY KEY,
    texte TEXT NOT NULL,
    auteur VARCHAR(255) DEFAULT 'Anonyme',
    likes INTEGER DEFAULT 0,
    date VARCHAR(50)
);