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

    const pdfData = doc.output('datauristring');
    const to = 'votre.email@exemple.com'; // Changez cette adresse
    const subject = 'Formulaire d\'accueil de chantier - ' + document.getElementById('nomPrenom').value;
    const body = 'Bonjour,\n\nCi-joint le formulaire rempli.\n\nCordialement,';

    // Ouvre le client de messagerie
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}&attachment=${encodeURIComponent(pdfData)}`;
  });
});
