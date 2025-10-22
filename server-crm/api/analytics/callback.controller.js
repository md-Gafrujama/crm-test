// Server-side OAuth callback handler for Google Analytics
export const handleGoogleAnalyticsCallback = (req, res) => {
  const { code, error } = req.query;
  
  if (error) {
    return res.send(`
      <html>
        <body>
          <script>
            window.opener.postMessage({ error: '${error}' }, '*');
            window.close();
          </script>
        </body>
      </html>
    `);
  }

  if (code) {
    return res.send(`
      <html>
        <body>
          <script>
            window.opener.postMessage({ code: '${code}' }, '*');
            window.close();
          </script>
        </body>
      </html>
    `);
  }

  res.send(`
    <html>
      <body>
        <script>
          window.opener.postMessage({ error: 'No authorization code received' }, '*');
          window.close();
        </script>
      </body>
    </html>
  `);
};