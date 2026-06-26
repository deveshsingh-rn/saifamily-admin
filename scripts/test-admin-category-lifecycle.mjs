const baseUrl = process.env.API_BASE_URL ?? 'http://localhost:4000/api';
const mobileNumber = process.env.ADMIN_MOBILE_NUMBER ?? '+910000000000';
const otp = process.env.ADMIN_OTP ?? '7664';
const origin = process.env.ADMIN_ORIGIN ?? 'http://localhost:3000';
const categoryKey = process.env.CATEGORY_TEST_KEY ?? 'general';

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Origin: origin,
      ...options.headers,
    },
  });
  const text = await response.text();
  let body = null;

  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  return { response, body };
}

const login = await request('/auth/mobile/verify-otp', {
  method: 'POST',
  body: JSON.stringify({ mobileNumber, otp }),
});
const accessToken = login.body?.tokens?.accessToken;

if (!login.response.ok || !accessToken) {
  console.error(JSON.stringify({
    step: 'login',
    status: login.response.status,
    passed: false,
  }, null, 2));
  process.exitCode = 1;
} else {
  const headers = { Authorization: `Bearer ${accessToken}` };
  const initialList = await request('/admin/categories', { headers });
  const original = initialList.body?.categories?.find(
    ({ category }) => category === categoryKey,
  );

  if (!original) {
    console.error(JSON.stringify({
      step: 'find-category-fixture',
      category: categoryKey,
      passed: false,
    }, null, 2));
    process.exitCode = 1;
  } else {
    const temporaryLabel = `${original.label} QA`;
    const update = await request(
      `/admin/categories/${encodeURIComponent(categoryKey)}`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ label: temporaryLabel }),
      },
    );
    const updatedList = await request('/admin/categories', { headers });
    const updated = updatedList.body?.categories?.find(
      ({ category }) => category === categoryKey,
    );
    const restore = await request(
      `/admin/categories/${encodeURIComponent(categoryKey)}`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ label: original.label }),
      },
    );
    const restoredList = await request('/admin/categories', { headers });
    const restored = restoredList.body?.categories?.find(
      ({ category }) => category === categoryKey,
    );
    const duplicateCreate = await request('/admin/categories', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        category: categoryKey,
        label: original.label,
      }),
    });

    const results = [
      {
        step: 'update-category',
        expectedStatus: 200,
        actualStatus: update.response.status,
        passed:
          update.response.status === 200 &&
          updated?.label === temporaryLabel,
      },
      {
        step: 'restore-category',
        expectedStatus: 200,
        actualStatus: restore.response.status,
        passed:
          restore.response.status === 200 &&
          restored?.label === original.label,
      },
      {
        step: 'create-or-replace-category-label',
        expectedStatus: 201,
        actualStatus: duplicateCreate.response.status,
        passed:
          duplicateCreate.response.status === 201 &&
          duplicateCreate.body?.category?.category === categoryKey &&
          duplicateCreate.body?.category?.label === original.label,
      },
    ];
    const passed = results.filter((result) => result.passed).length;

    console.log(JSON.stringify({
      summary: {
        total: results.length,
        passed,
        failed: results.length - passed,
      },
      responseShapes: {
        updateKeys:
          update.body && typeof update.body === 'object'
            ? Object.keys(update.body)
            : [],
        restoreKeys:
          restore.body && typeof restore.body === 'object'
            ? Object.keys(restore.body)
            : [],
      },
      results,
    }, null, 2));

    if (passed !== results.length) {
      process.exitCode = 1;
    }
  }
}
