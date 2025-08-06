import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Color palette for the PDF
const colors = {
  primary: rgb(0.23, 0.51, 0.98), // Blue
  secondary: rgb(0.16, 0.73, 0.51), // Green
  accent: rgb(0.96, 0.62, 0.11), // Orange
  text: rgb(0.13, 0.13, 0.13), // Dark gray
  lightText: rgb(0.42, 0.42, 0.42), // Light gray
  background: rgb(0.98, 0.98, 0.98), // Light gray background
  white: rgb(1, 1, 1)
};

// Helper function to format currency
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Helper function to format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Helper function to format time
const formatTime = (time) => {
  if (!time) return '';
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

// Function to draw a header with trip information
async function drawHeader(page, trip, fonts, y) {
  const { width } = page.getSize();
  
  // Draw header background
  page.drawRectangle({
    x: 0,
    y: y - 80,
    width: width,
    height: 80,
    color: colors.primary
  });

  // Trip title
  page.drawText(trip.title, {
    x: 50,
    y: y - 30,
    size: 24,
    font: fonts.bold,
    color: colors.white
  });

  // Destination and dates
  const subtitle = `${trip.destination.city}, ${trip.destination.country} • ${formatDate(trip.dates.startDate)} - ${formatDate(trip.dates.endDate)}`;
  page.drawText(subtitle, {
    x: 50,
    y: y - 55,
    size: 12,
    font: fonts.regular,
    color: colors.white
  });

  // Duration
  page.drawText(`${trip.dates.duration} days`, {
    x: width - 100,
    y: y - 42,
    size: 14,
    font: fonts.bold,
    color: colors.white
  });

  return y - 100;
}

// Function to draw trip overview
async function drawOverview(page, trip, fonts, startY) {
  let currentY = startY;
  const { width } = page.getSize();

  // Section title
  page.drawText('Trip Overview', {
    x: 50,
    y: currentY,
    size: 18,
    font: fonts.bold,
    color: colors.text
  });
  currentY -= 30;

  // Description
  if (trip.description) {
    const description = trip.description.length > 200 
      ? trip.description.substring(0, 200) + '...' 
      : trip.description;
    
    page.drawText(description, {
      x: 50,
      y: currentY,
      size: 10,
      font: fonts.regular,
      color: colors.text,
      maxWidth: width - 100,
      lineHeight: 14
    });
    currentY -= 40;
  }

  // Budget overview
  if (trip.budget) {
    page.drawRectangle({
      x: 50,
      y: currentY - 60,
      width: width - 100,
      height: 60,
      color: colors.background,
      borderColor: colors.lightText,
      borderWidth: 1
    });

    page.drawText('Budget Overview', {
      x: 70,
      y: currentY - 20,
      size: 12,
      font: fonts.bold,
      color: colors.text
    });

    const budgetText = `Total Budget: ${formatCurrency(trip.budget.total, trip.budget.currency)}`;
    page.drawText(budgetText, {
      x: 70,
      y: currentY - 40,
      size: 10,
      font: fonts.regular,
      color: colors.text
    });

    // Budget breakdown
    const categories = Object.entries(trip.budget.categories || {});
    let xOffset = 250;
    categories.forEach(([category, amount], index) => {
      if (index < 3) { // Show first 3 categories
        const categoryText = `${category}: ${formatCurrency(amount, trip.budget.currency)}`;
        page.drawText(categoryText, {
          x: xOffset,
          y: currentY - 20 - (index * 15),
          size: 9,
          font: fonts.regular,
          color: colors.lightText
        });
      }
    });

    currentY -= 80;
  }

  return currentY;
}

// Function to draw daily itinerary
async function drawDailyItinerary(page, dayPlan, fonts, startY, pageWidth) {
  let currentY = startY;

  // Day header
  page.drawRectangle({
    x: 50,
    y: currentY - 30,
    width: pageWidth - 100,
    height: 30,
    color: colors.secondary
  });

  const dayTitle = `Day ${dayPlan.day} - ${formatDate(dayPlan.date)}`;
  page.drawText(dayTitle, {
    x: 70,
    y: currentY - 20,
    size: 14,
    font: fonts.bold,
    color: colors.white
  });

  currentY -= 50;

  // Activities
  dayPlan.activities.forEach((activity, index) => {
    // Check if we need a new page
    if (currentY < 150) {
      return currentY; // Return current position for page break handling
    }

    // Activity card background
    page.drawRectangle({
      x: 70,
      y: currentY - 60,
      width: pageWidth - 140,
      height: 60,
      color: colors.white,
      borderColor: colors.background,
      borderWidth: 1
    });

    // Time
    if (activity.time?.start) {
      page.drawText(formatTime(activity.time.start), {
        x: 90,
        y: currentY - 20,
        size: 10,
        font: fonts.bold,
        color: colors.primary
      });
    }

    // Activity name
    page.drawText(activity.name, {
      x: 160,
      y: currentY - 20,
      size: 11,
      font: fonts.bold,
      color: colors.text,
      maxWidth: pageWidth - 250
    });

    // Location
    if (activity.location?.name) {
      page.drawText(activity.location.name, {
        x: 160,
        y: currentY - 35,
        size: 9,
        font: fonts.regular,
        color: colors.lightText,
        maxWidth: pageWidth - 250
      });
    }

    // Cost
    if (activity.cost?.amount > 0) {
      const costText = formatCurrency(activity.cost.amount, activity.cost.currency);
      page.drawText(costText, {
        x: pageWidth - 130,
        y: currentY - 28,
        size: 10,
        font: fonts.bold,
        color: colors.accent
      });
    }

    // Duration
    if (activity.time?.duration) {
      const durationText = `${activity.time.duration} min`;
      page.drawText(durationText, {
        x: pageWidth - 130,
        y: currentY - 45,
        size: 9,
        font: fonts.regular,
        color: colors.lightText
      });
    }

    currentY -= 75;
  });

  // Day total cost
  if (dayPlan.totalCost > 0) {
    page.drawText(`Day Total: ${formatCurrency(dayPlan.totalCost, 'USD')}`, {
      x: pageWidth - 150,
      y: currentY - 10,
      size: 10,
      font: fonts.bold,
      color: colors.text
    });
    currentY -= 25;
  }

  return currentY;
}

// Function to draw expense summary
async function drawExpenseSummary(page, expenses, summary, fonts, startY, pageWidth) {
  let currentY = startY;

  // Section title
  page.drawText('Expense Summary', {
    x: 50,
    y: currentY,
    size: 18,
    font: fonts.bold,
    color: colors.text
  });
  currentY -= 30;

  // Total expenses
  page.drawRectangle({
    x: 50,
    y: currentY - 40,
    width: pageWidth - 100,
    height: 40,
    color: colors.background,
    borderColor: colors.lightText,
    borderWidth: 1
  });

  page.drawText('Total Expenses', {
    x: 70,
    y: currentY - 20,
    size: 12,
    font: fonts.bold,
    color: colors.text
  });

  page.drawText(formatCurrency(summary.total, summary.currency), {
    x: pageWidth - 150,
    y: currentY - 20,
    size: 12,
    font: fonts.bold,
    color: colors.accent
  });

  currentY -= 60;

  // Category breakdown
  if (summary.byCategory) {
    page.drawText('By Category', {
      x: 70,
      y: currentY,
      size: 14,
      font: fonts.bold,
      color: colors.text
    });
    currentY -= 20;

    Object.entries(summary.byCategory).forEach(([category, amount]) => {
      page.drawText(`• ${category.charAt(0).toUpperCase() + category.slice(1)}`, {
        x: 90,
        y: currentY,
        size: 10,
        font: fonts.regular,
        color: colors.text
      });

      page.drawText(formatCurrency(amount, summary.currency), {
        x: pageWidth - 150,
        y: currentY,
        size: 10,
        font: fonts.regular,
        color: colors.text
      });

      currentY -= 18;
    });
  }

  return currentY;
}

// Function to draw notes
async function drawNotes(page, notes, fonts, startY, pageWidth) {
  let currentY = startY;

  if (notes && notes.length > 0) {
    // Section title
    page.drawText('Trip Notes', {
      x: 50,
      y: currentY,
      size: 18,
      font: fonts.bold,
      color: colors.text
    });
    currentY -= 30;

    // Show first few notes
    const notesToShow = notes.slice(0, 5);
    notesToShow.forEach((note) => {
      if (currentY < 100) return; // Avoid page overflow

      // Note card
      page.drawRectangle({
        x: 70,
        y: currentY - 50,
        width: pageWidth - 140,
        height: 50,
        color: colors.white,
        borderColor: colors.background,
        borderWidth: 1
      });

      // Author and date
      const noteHeader = `${note.author.name} - ${new Date(note.createdAt).toLocaleDateString()}`;
      page.drawText(noteHeader, {
        x: 90,
        y: currentY - 20,
        size: 9,
        font: fonts.bold,
        color: colors.lightText
      });

      // Note content (truncated)
      const content = note.content.length > 100 
        ? note.content.substring(0, 100) + '...' 
        : note.content;
      
      page.drawText(content, {
        x: 90,
        y: currentY - 35,
        size: 9,
        font: fonts.regular,
        color: colors.text,
        maxWidth: pageWidth - 180
      });

      currentY -= 65;
    });

    if (notes.length > 5) {
      page.drawText(`... and ${notes.length - 5} more notes`, {
        x: 90,
        y: currentY,
        size: 9,
        font: fonts.regular,
        color: colors.lightText
      });
    }
  }

  return currentY;
}

// Function to draw footer
async function drawFooter(page, fonts, pageNumber, totalPages) {
  const { width, height } = page.getSize();
  
  // Footer line
  page.drawLine({
    start: { x: 50, y: 50 },
    end: { x: width - 50, y: 50 },
    thickness: 1,
    color: colors.lightText
  });

  // Generated by text
  page.drawText('Generated by AI Travel Planner', {
    x: 50,
    y: 35,
    size: 8,
    font: fonts.regular,
    color: colors.lightText
  });

  // Page number
  page.drawText(`Page ${pageNumber} of ${totalPages}`, {
    x: width - 100,
    y: 35,
    size: 8,
    font: fonts.regular,
    color: colors.lightText
  });

  // Generation date
  page.drawText(`Generated on ${new Date().toLocaleDateString()}`, {
    x: width - 200,
    y: 20,
    size: 8,
    font: fonts.regular,
    color: colors.lightText
  });
}

// Main function to generate PDF
export async function generateTripPDF(tripData) {
  try {
    const pdfDoc = await PDFDocument.create();
    
    // Load fonts
    const fonts = {
      regular: await pdfDoc.embedFont(StandardFonts.Helvetica),
      bold: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
      italic: await pdfDoc.embedFont(StandardFonts.HelveticaOblique)
    };

    let currentPage = pdfDoc.addPage();
    let currentY = currentPage.getSize().height - 50;
    const pageWidth = currentPage.getSize().width;
    let pageCount = 1;

    // Draw header
    currentY = await drawHeader(currentPage, tripData, fonts, currentY);

    // Draw overview
    currentY = await drawOverview(currentPage, tripData, fonts, currentY);

    // Draw daily itineraries
    if (tripData.dayPlans && tripData.dayPlans.length > 0) {
      for (const dayPlan of tripData.dayPlans) {
        // Check if we need a new page
        if (currentY < 200) {
          currentPage = pdfDoc.addPage();
          currentY = currentPage.getSize().height - 50;
          pageCount++;
        }

        currentY = await drawDailyItinerary(currentPage, dayPlan, fonts, currentY, pageWidth);
        currentY -= 30; // Add space between days
      }
    }

    // Draw expense summary if available
    if (tripData.expenses && tripData.expenses.length > 0) {
      // Check if we need a new page
      if (currentY < 300) {
        currentPage = pdfDoc.addPage();
        currentY = currentPage.getSize().height - 50;
        pageCount++;
      }

      // Calculate summary (simplified version)
      const summary = {
        total: tripData.expenses.reduce((sum, exp) => sum + exp.amount, 0),
        currency: tripData.budget?.currency || 'USD',
        byCategory: {}
      };

      tripData.expenses.forEach(expense => {
        const category = expense.category || 'other';
        summary.byCategory[category] = (summary.byCategory[category] || 0) + expense.amount;
      });

      currentY = await drawExpenseSummary(currentPage, tripData.expenses, summary, fonts, currentY, pageWidth);
    }

    // Draw notes if available
    if (tripData.notes && tripData.notes.length > 0) {
      // Check if we need a new page
      if (currentY < 200) {
        currentPage = pdfDoc.addPage();
        currentY = currentPage.getSize().height - 50;
        pageCount++;
      }

      currentY = await drawNotes(currentPage, tripData.notes, fonts, currentY, pageWidth);
    }

    // Add footers to all pages
    const pages = pdfDoc.getPages();
    pages.forEach((page, index) => {
      drawFooter(page, fonts, index + 1, pageCount);
    });

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
}

// Function to download PDF in browser
export function downloadPDF(pdfBytes, filename = 'trip-itinerary.pdf') {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Function to preview PDF in new tab
export function previewPDF(pdfBytes) {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}