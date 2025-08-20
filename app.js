document.getElementById('chantier-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const form = document.getElementById('chantier-form');
  const formHTML = document.getElementById('form-content');

  html2canvas(formHTML).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Votre code est ici pour obtenir les données du PDF
    const pdfBase64 = doc.output('datauristring').split(',')[1];
    const to = 'jpouillard@ateliermmr.com';
    const subject = 'Formulaire P+R – PDF';
    const html = '<p>Veuillez trouver le PDF en pièce jointe.</p>';
    const filename = 'formulaire.pdf';

    // Appel à la fonction Vercel pour envoyer l'email
    fetch('/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // <== Ceci est crucial
      },
      body: JSON.stringify({ // <== Convertit les données en JSON
        to,
        subject,
        html,
        filename,
        pdfBase64
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.ok) {
        alert('Courriel envoyé avec succès !');
      } else {
        alert('Échec de l\'envoi du courriel : ' + data.error);
      }
    })
    .catch(error => {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de l\'envoi du courriel.');
    });
  });
});
