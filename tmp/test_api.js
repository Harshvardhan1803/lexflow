async function testAPI() {
  try {
    const res = await fetch('http://localhost:3000/api/deadlines');
    const data = await res.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
    if (res.ok && data.success) {
      console.log('TEST PASSED: /api/deadlines is working.');
    } else {
      console.log('TEST FAILED:', data);
    }
  } catch (err) {
    console.error('Fetch error (Make sure Next.js is running):', err.message);
  }
}

testAPI();
