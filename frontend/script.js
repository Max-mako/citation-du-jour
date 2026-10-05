document.addEventListener('DOMContentLoaded', () => {
    const API_URL = `http://${window.location.hostname}:3000`;

    const form = document.getElementById('citation-form');
    const input = document.getElementById('citation-input');
    const auteurInput = document.getElementById('auteur-input');
    const vedetteDiv = document.getElementById('citation-vedette');
    const historiqueList = document.getElementById('historique-list');

    window.likerCitation = async function(id) {
        try {
            const response = await fetch(`${API_URL}/api/citations/${id}/like`, { method: 'POST' });
            if (response.ok) chargerCitations(); 
        } catch (error) {
            console.error('Erreur lors du like:', error);
        }
    };

    // NOUVELLE FONCTION : Supprimer une citation
    window.supprimerCitation = async function(id) {
        // Petite sécurité Ops : on demande confirmation avant destruction de donnée
        if (!confirm("Es-tu sûr de vouloir supprimer cette citation ?")) return;

        try {
            const response = await fetch(`${API_URL}/api/citations/${id}`, { method: 'DELETE' });
            if (response.ok) chargerCitations(); 
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };

    function creerHTMLCitation(citation) {
        const nomAuteur = citation.auteur || "Anonyme";
        const nbLikes = citation.likes || 0;

        return `
            <div class="citation-header">
                <span>"${citation.texte}"</span>
                <button class="delete-btn" onclick="supprimerCitation(${citation.id})" title="Supprimer">✖</button>
            </div>
            <div class="meta-info">
                <span>Par <span class="auteur">${nomAuteur}</span> le ${citation.date}</span>
                <button class="like-btn" onclick="likerCitation(${citation.id})">
                    ❤️ ${nbLikes}
                </button>
            </div>
        `;
    }

    async function chargerCitations() {
        try {
            const response = await fetch(`${API_URL}/api/citations`);
            const citations = await response.json();
            afficherCitations(citations);
        } catch (error) {
            console.error('Erreur de connexion:', error);
        }
    }

    function afficherCitations(citations) {
        vedetteDiv.innerHTML = '';
        historiqueList.innerHTML = '';

        if (citations.length === 0) {
            vedetteDiv.textContent = "Aucune citation pour le moment. À toi de jouer !";
            return;
        }

        vedetteDiv.innerHTML = creerHTMLCitation(citations[0]);

        for (let i = 1; i < citations.length; i++) {
            const li = document.createElement('li');
            li.innerHTML = creerHTMLCitation(citations[i]);
            historiqueList.appendChild(li);
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const texte = input.value.trim();
        const auteur = auteurInput.value.trim(); 
        
        if (!texte) return;

        try {
            const response = await fetch(`${API_URL}/api/citations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texte, auteur })
            });

            if (response.ok) {
                input.value = ''; 
                auteurInput.value = ''; 
                chargerCitations(); 
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
        }
    });

    chargerCitations();
});