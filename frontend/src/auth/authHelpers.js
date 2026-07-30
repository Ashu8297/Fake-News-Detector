function formatErrorDetail(detail) {
  if (!detail) return null;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) => item?.msg || item?.message || JSON.stringify(item))
      .filter(Boolean)
      .join(' | ');
  }
  if (typeof detail === 'object') {
    return detail.message || detail.msg || JSON.stringify(detail);
  }
  return null;
}

export function getErrorMessage(err, fallback) {
  const data = err?.response?.data;
  const detailMessage = formatErrorDetail(data?.detail);
  return detailMessage || data?.message || err?.message || fallback;
}

export function normalizeAuthPayload(payload = {}) {
  return {
    ...payload,
    email: payload.email?.trim().toLowerCase()
  };
}
