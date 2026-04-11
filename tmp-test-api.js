const fetch = global.fetch || require('node-fetch');
(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/book-appointment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test', email: 'test@example.com', phone: '123', date: '2024-01-01', matter: 'corporate', message: 'test' }),
    });
    
  } catch (err) {
    console.error(err);
  }
})();