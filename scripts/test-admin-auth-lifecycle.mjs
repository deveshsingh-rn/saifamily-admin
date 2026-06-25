const baseUrl = process.env.API_BASE_URL ?? 'http://localhost:4000/api';
const mobileNumber = process.env.ADMIN_MOBILE_NUMBER ?? '+910000000000';
const otp = process.env.ADMIN_OTP ?? '7664';
const origin = process.env.ADMIN_ORIGIN ?? 'http://localhost:3000';

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

const results = [];

const login = await request('/auth/mobile/verify-otp', {
  method: 'POST',
  body: JSON.stringify({ mobileNumber, otp }),
});
const firstAccessToken = login.body?.tokens?.accessToken;
const firstRefreshToken = login.body?.tokens?.refreshToken;

results.push({
  step: 'login',
  expectedStatus: 200,
  actualStatus: login.response.status,
  passed:
    login.response.status === 200 &&
    Boolean(firstAccessToken) &&
    Boolean(firstRefreshToken),
});

const refresh = await request('/auth/refresh-token', {
  method: 'POST',
  body: JSON.stringify({ refreshToken: firstRefreshToken }),
});
const rotatedAccessToken = refresh.body?.tokens?.accessToken;
const rotatedRefreshToken = refresh.body?.tokens?.refreshToken;

results.push({
  step: 'refresh-token',
  expectedStatus: 200,
  actualStatus: refresh.response.status,
  passed:
    refresh.response.status === 200 &&
    Boolean(rotatedAccessToken) &&
    Boolean(rotatedRefreshToken),
});

const protectedRequest = await request('/admin/users?limit=1&offset=0', {
  headers: {
    Authorization: `Bearer ${rotatedAccessToken}`,
  },
});

results.push({
  step: 'protected-request-with-rotated-token',
  expectedStatus: 200,
  actualStatus: protectedRequest.response.status,
  passed: protectedRequest.response.status === 200,
});

const logout = await request('/auth/logout', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${rotatedAccessToken}`,
  },
  body: JSON.stringify({ refreshToken: rotatedRefreshToken }),
});

results.push({
  step: 'logout',
  expectedStatus: 200,
  actualStatus: logout.response.status,
  passed: logout.response.status === 200,
});

const revokedRefresh = await request('/auth/refresh-token', {
  method: 'POST',
  body: JSON.stringify({ refreshToken: rotatedRefreshToken }),
});

results.push({
  step: 'revoked-refresh-token',
  expectedStatus: 401,
  actualStatus: revokedRefresh.response.status,
  passed: revokedRefresh.response.status === 401,
});

const passed = results.filter((result) => result.passed).length;

console.log(JSON.stringify({
  summary: {
    total: results.length,
    passed,
    failed: results.length - passed,
  },
  results,
}, null, 2));

if (passed !== results.length) {
  process.exitCode = 1;
}
