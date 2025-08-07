addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Fetch the original response from your website
  const response = await fetch(request);
  
  // Only modify HTML responses (skip images, CSS, etc.)
  if (response.headers.get('content-type')?.includes('text/html')) {
    let html = await response.text();
    
    // JavaScript to disable right-click
    const disableRightClickScript = `
      <script>
        document.addEventListener('contextmenu', function(e) {
          e.preventDefault();
          alert('Right-click is disabled for security reasons.');
        });
      </script>
    `;
    
    // Inject the script before </head>
    html = html.replace('</head>', `${disableRightClickScript}</head>`);
    
    return new Response(html, {
      status: response.status,
      headers: response.headers
    });
  }
  
  // Return unmodified responses for non-HTML content
  return response;
}
