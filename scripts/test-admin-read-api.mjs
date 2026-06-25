const baseUrl = process.env.API_BASE_URL ?? 'http://localhost:4000/api';
const mobileNumber = process.env.ADMIN_MOBILE_NUMBER ?? '+910000000000';
const otp = process.env.ADMIN_OTP ?? '7664';
const origin = process.env.ADMIN_ORIGIN ?? 'http://localhost:3000';

const endpoints = [
  ['users', '/admin/users?limit=20&offset=0'],
  ['content', '/admin/content?limit=20&offset=0'],
  ['categories', '/admin/categories'],
  ['directoryReviews', '/admin/directory/reviews?limit=20&offset=0'],
  ['directoryAnalytics', '/admin/directory/analytics?days=30'],
  ['directoryAuditLogs', '/admin/directory/audit-logs?limit=50&offset=0'],
  ['directoryReports', '/admin/directory/reports?status=pending&limit=20&offset=0'],
  ['directoryListings', '/admin/directory/listings?status=pending_review&limit=20&offset=0'],
  ['sanghaGroups', '/admin/sangha/groups?limit=20&offset=0'],
  ['sanghaReports', '/admin/sangha/reports?limit=20&offset=0'],
  ['sanghaLiveStreams', '/admin/sangha/live-streams?limit=20&offset=0'],
  ['sanghaAnalytics', '/admin/sangha/analytics?days=30'],
  ['sanghaAuditLogs', '/admin/sangha/audit-logs?limit=50&offset=0'],
];

function summarizeBody(body) {
  if (Array.isArray(body)) {
    return { type: 'array', length: body.length };
  }

  if (body && typeof body === 'object') {
    const summary = { type: 'object', keys: Object.keys(body) };

    for (const [key, value] of Object.entries(body)) {
      if (Array.isArray(value)) {
        summary[`${key}Count`] = value.length;
      }
    }

    return summary;
  }

  return { type: typeof body };
}

async function readResponse(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

const loginResponse = await fetch(`${baseUrl}/auth/mobile/verify-otp`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Origin: origin,
  },
  body: JSON.stringify({ mobileNumber, otp }),
});
const loginBody = await readResponse(loginResponse);

if (!loginResponse.ok) {
  console.error(JSON.stringify({
    login: {
      status: loginResponse.status,
      message: loginBody?.message ?? 'Admin login failed',
    },
  }, null, 2));
  process.exitCode = 1;
} else {
  const accessToken = loginBody?.tokens?.accessToken;

  if (!accessToken) {
    console.error(JSON.stringify({
      login: {
        status: loginResponse.status,
        message: 'Login response did not include tokens.accessToken',
      },
    }, null, 2));
    process.exitCode = 1;
  } else {
    const results = await Promise.all(
      endpoints.map(async ([name, path]) => {
        try {
          const response = await fetch(`${baseUrl}${path}`, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
              Origin: origin,
            },
          });
          const body = await readResponse(response);

          return {
            name,
            method: 'GET',
            path,
            status: response.status,
            ok: response.ok,
            ...(response.ok
              ? { response: summarizeBody(body) }
              : { error: body?.message ?? body?.error ?? 'Request failed' }),
          };
        } catch (error) {
          return {
            name,
            method: 'GET',
            path,
            status: null,
            ok: false,
            error: error instanceof Error ? error.message : 'Unknown request error',
          };
        }
      }),
    );

    try {
      const groupsResponse = await fetch(
        `${baseUrl}/admin/sangha/groups?limit=1&offset=0`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
            Origin: origin,
          },
        },
      );
      const groupsBody = await readResponse(groupsResponse);
      const groupId = groupsBody?.groups?.[0]?.id;

      if (!groupsResponse.ok || !groupId) {
        results.push({
          name: 'sanghaGroupDetail',
          method: 'GET',
          path: '/admin/sangha/groups/:id',
          status: groupsResponse.status,
          ok: false,
          error: groupsBody?.message ?? 'No Sangha group was available for the detail test',
        });
      } else {
        const detailResponse = await fetch(
          `${baseUrl}/admin/sangha/groups/${encodeURIComponent(groupId)}`,
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
              Origin: origin,
            },
          },
        );
        const detailBody = await readResponse(detailResponse);

        results.push({
          name: 'sanghaGroupDetail',
          method: 'GET',
          path: '/admin/sangha/groups/:id',
          status: detailResponse.status,
          ok: detailResponse.ok,
          ...(detailResponse.ok
            ? { response: summarizeBody(detailBody) }
            : { error: detailBody?.message ?? detailBody?.error ?? 'Request failed' }),
        });
      }
    } catch (error) {
      results.push({
        name: 'sanghaGroupDetail',
        method: 'GET',
        path: '/admin/sangha/groups/:id',
        status: null,
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown request error',
      });
    }

    console.log(JSON.stringify({
      login: {
        status: loginResponse.status,
        userId: loginBody.user?.id,
        role: loginBody.user?.role,
      },
      summary: {
        total: results.length,
        passed: results.filter(({ ok }) => ok).length,
        failed: results.filter(({ ok }) => !ok).length,
      },
      results,
    }, null, 2));

    if (results.some(({ ok }) => !ok)) {
      process.exitCode = 1;
    }
  }
}
