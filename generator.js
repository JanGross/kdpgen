const { PDFDocument, StandardFonts, degrees, rgb } = require('pdf-lib');
const fs = require('fs');
const fontkit = require('@pdf-lib/fontkit');


async function createCoverPage(title, subtitle, image, whiteFont) {
  // Create a new PDF document

  // Load the cover image
  const coverImageBytes = fs.readFileSync(image);
  const textBoxImageBytes = fs.readFileSync('templates/back_text_box.png');
  const coverTemplateBytes = fs.readFileSync('templates/cover.pdf');

  const coverTemplate = await PDFDocument.load(coverTemplateBytes);
  coverTemplate.registerFontkit(fontkit)

  const fontBytes = fs.readFileSync('fonts/GrapeNuts-Regular.ttf');
  const customFont = await coverTemplate.embedFont(fontBytes)

  const page = coverTemplate.getPage(0);
  const { width, height } = page.getSize();

  //blanking
  page.drawRectangle({
    x: 0,
    y: 0,
    width: width,
    height: height,
    color: rgb(1, 1, 1),
  })

  // Embed images
  const backgroundImage = await coverTemplate.embedJpg(coverImageBytes);
  const textBoxImage = await coverTemplate.embedPng(textBoxImageBytes);

  const fontColor = whiteFont ? rgb(1, 1, 1) : rgb(0, 0, 0);

  // Draw the cover image as the background
  const imageWidth = (width / 2) - 5;
  const imageHeight = (backgroundImage.height / backgroundImage.width) * (imageWidth);
  page.drawImage(backgroundImage, {
    x: 0,
    y: 0,
    width: imageWidth,
    height: imageHeight,
  });

  page.drawImage(backgroundImage, {
    x: imageWidth + 10,
    y: 0,
    width: imageWidth,
    height: imageHeight,
  });

  
  const titleFontSize = 70;
  const titleWidth = customFont.widthOfTextAtSize(title, titleFontSize);
  const titleHeight = customFont.heightAtSize(titleFontSize);

  page.drawText(title, {
    x: (page.getWidth() * 0.75 - titleWidth / 2) + 5,
    y: (page.getHeight() * 0.80 - titleHeight / 2),
    size: titleFontSize,
    font: customFont,
    color: fontColor
  });

  const subTitleFontSize = 40;
  const subTitleWidth = customFont.widthOfTextAtSize(subtitle, subTitleFontSize);
  const subTitleHeight = customFont.heightAtSize(subTitleFontSize);
  page.drawText(subtitle, {
    x: (page.getWidth() * 0.75 - subTitleWidth / 2) + 5,
    y: (page.getHeight() * 0.80 - subTitleHeight / 2) - (subTitleHeight * 1.1),
    size: subTitleFontSize,
    font: customFont,
    color: fontColor
  });

  page.drawRectangle({
    x: 459,
    y: 27,
    width: 144,
    height: 87,
    color: rgb(1, 1, 1),
  })

  page.drawImage(textBoxImage, {
    x: 92,
    y: 188,
    width: 437,
    height: 155,
  });


  //Copyright (spine)
  const copyrightFontSize = 7;
  const helveticaFont = await coverTemplate.embedFont(StandardFonts.HelveticaOblique);
  const copyrightWidth = helveticaFont.widthOfTextAtSize(title, copyrightFontSize);
  const copyrightHeight = helveticaFont.heightAtSize(copyrightFontSize);
  page.drawText("© Minz / Jan Groß - 2023", {
    x: (page.getWidth() / 2) + (copyrightHeight / 2),
    y: 18,
    size: copyrightFontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

  // Save the cover page as a separate PDF file
  const coverPageBytes = await coverTemplate.save();
  fs.writeFileSync('generated/cover.pdf', coverPageBytes);
}

module.exports = {
  createCoverPage,
};