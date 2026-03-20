async function testChatAPI() {
  try {
    const res = await fetch('http://localhost:3000/api/chat/threads');
    const data = await res.json();
    console.log('Chat Threads API Response:', JSON.stringify(data, null, 2));
    if (res.ok && data.success) {
      console.log('TEST PASSED: /api/chat/threads is working.');
    } else {
      console.log('TEST FAILED:', data);
    }
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

testChatAPI();
