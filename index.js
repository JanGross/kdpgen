const { createCoverPage } = require('./generator');


async function generatePDF() {
  const title = 'Travel Journal';
  const subtitle = 'My trip to wherever';
  const coverImage = 'images/cover.jpg'; // Replace with the actual path or URL to the cover image
  const whiteFont = true;

  const coverPageBytes = await createCoverPage(title, subtitle, coverImage, whiteFont);
  // Save or do further processing with the coverPageBytes
}

generatePDF();