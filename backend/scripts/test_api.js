const { startServer } = require('../server');

async function runTests() {
  console.log('[Test Runner] Starting test suite...');
  const server = await startServer();
  const baseUrl = 'http://localhost:5000';

  let hasErrors = false;

  const assert = (condition, message) => {
    if (!condition) {
      console.error(`❌ FAIL: ${message}`);
      hasErrors = true;
    } else {
      console.log(`✅ PASS: ${message}`);
    }
  };

  try {
    // 1. Health check
    console.log('\n--- 1. Testing GET /api/health ---');
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthJson = await healthRes.json();
    assert(healthRes.status === 200, `Health status 200 (got ${healthRes.status})`);
    assert(healthJson.status === 'healthy', 'Health status is healthy');
    assert(healthJson.database.online === true, 'Database is reported online');

    // 2. Projects list
    console.log('\n--- 2. Testing GET /api/projects ---');
    const projectsRes = await fetch(`${baseUrl}/api/projects`);
    const projectsJson = await projectsRes.json();
    assert(projectsRes.status === 200, `Projects status 200 (got ${projectsRes.status})`);
    assert(projectsJson.success === true, 'Projects response success is true');
    assert(Array.isArray(projectsJson.data) && projectsJson.data.length >= 3, `Projects array contains at least 3 items (found ${projectsJson.data?.length})`);

    // 3. Projects filter by category
    console.log('\n--- 3. Testing GET /api/projects?category=mern ---');
    const filterRes = await fetch(`${baseUrl}/api/projects?category=mern`);
    const filterJson = await filterRes.json();
    assert(filterRes.status === 200, 'Filter projects status 200');
    assert(filterJson.data.some(p => p.slug === 'ai-powered-forum' || p.category === 'mern'), 'Found MERN project in filtered list');

    // 4. Project by slug
    console.log('\n--- 4. Testing GET /api/projects/ai-powered-forum ---');
    const slugRes = await fetch(`${baseUrl}/api/projects/ai-powered-forum`);
    const slugJson = await slugRes.json();
    assert(slugRes.status === 200, 'Single project status 200');
    assert(slugJson.data.slug === 'ai-powered-forum', 'Single project slug matches');
    assert(slugJson.data.title === 'AI-Powered Evangadi Forum', 'Single project title matches');

    // 5. Portfolio stats
    console.log('\n--- 5. Testing GET /api/stats ---');
    const statsRes = await fetch(`${baseUrl}/api/stats`);
    const statsJson = await statsRes.json();
    assert(statsRes.status === 200, 'Stats status 200');
    assert(statsJson.data.metrics.projectsCount >= 3, 'Stats project count >= 3');

    // 6. Contact validation error test (invalid email and short message)
    console.log('\n--- 6. Testing POST /api/contact (validation failure) ---');
    const badContactRes = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'A',
        email: 'invalid-email',
        subject: 'Hi',
        message: '1'
      })
    });
    const badContactJson = await badContactRes.json();
    assert(badContactRes.status === 400, `Bad contact returns 400 (got ${badContactRes.status})`);
    assert(badContactJson.success === false, 'Bad contact success is false');
    assert(Array.isArray(badContactJson.errors) && badContactJson.errors.length > 0, 'Validation errors returned for bad input');

    // 7. Contact valid submission test
    console.log('\n--- 7. Testing POST /api/contact (valid submission) ---');
    const testEmail = `recruiter_${Date.now()}@example.com`;
    const goodContactRes = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Hiring Manager',
        email: testEmail,
        subject: 'Software Engineer Opportunity',
        message: 'Hello Sosna, we were very impressed by your MERN stack and AI projects. We would love to discuss an interview opportunity!'
      })
    });
    const goodContactJson = await goodContactRes.json();
    assert(goodContactRes.status === 201, `Valid contact returns 201 (got ${goodContactRes.status})`);
    assert(goodContactJson.success === true, 'Contact submission success is true');
    assert(goodContactJson.source === 'mysql', 'Contact submission stored in MySQL');

    // 8. Contact messages retrieval
    console.log('\n--- 8. Testing GET /api/contact ---');
    const listContactRes = await fetch(`${baseUrl}/api/contact`);
    const listContactJson = await listContactRes.json();
    assert(listContactRes.status === 200, 'Contact list status 200');
    assert(listContactJson.data.some(m => m.email === testEmail), 'Newly submitted message retrieved from database');

  } catch (err) {
    console.error('Test execution error:', err);
    hasErrors = true;
  } finally {
    server.close(() => {
      console.log('\n[Test Runner] Server shut down.');
      if (hasErrors) {
        console.error('❌ Test suite completed with failures.');
        process.exit(1);
      } else {
        console.log('🎉 ALL 8 BACKEND API TESTS PASSED SUCCESSFULLY!');
        process.exit(0);
      }
    });
  }
}

runTests();
