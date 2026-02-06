// Widget configuration
const WIDGET_CONFIG = {
  manifestUrl: 'manifest.json'
};

// Load manifest and initialize widget
async function initWidget() {
  try {
    const response = await fetch(WIDGET_CONFIG.manifestUrl);
    const manifest = await response.json();

    const iframe = document.getElementById('external-frame');

    if (manifest.externalUrl) {
      iframe.src = manifest.externalUrl;
    }

    // Handle iframe loading errors
    iframe.addEventListener('error', () => {
      console.error('Failed to load external content');
    });

  } catch (error) {
    console.error('Widget initialization failed:', error);
  }
}

// Start the widget
initWidget();
