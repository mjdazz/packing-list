// Export and print functionality
export function setupExport() {
  const printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', printPackingList);
  }
}

function printPackingList() {
  // Create print header
  const printHeader = document.createElement('div');
  printHeader.className = 'print-header';

  const nights = document.getElementById('nights').value;
  const weather = document.getElementById('weather').value;
  const accommodation = document.getElementById('accommodation').value;

  printHeader.innerHTML = `
    <h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem;">
      Packing List
    </h1>
    <p style="font-size: 0.875rem; color: #666;">
      Generated: ${new Date().toLocaleDateString()}
    </p>
    <p style="font-size: 0.875rem; color: #666;">
      Trip: ${nights} nights, ${weather} weather, ${accommodation}
    </p>
  `;

  document.body.insertBefore(printHeader, document.body.firstChild);

  // Print
  window.print();

  // Clean up
  printHeader.remove();
}
