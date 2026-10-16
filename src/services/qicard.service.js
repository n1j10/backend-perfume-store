const crypto = require("node:crypto");
const config = require("../config");
const ApiError = require("../utils/ApiError");

// Port of lib/qicard.ts: only the HTTP calls to the QiCard gateway.
const { baseUrl, username, password, terminalId, publicKey } = config.qicard;

const getAuthHeaders = () => {
  if (!username || !password || !terminalId) {
    throw new ApiError(500, "لم يتم إعداد بوابة كي كارد");
  }

  const token = Buffer.from(`${username}:${password}`).toString("base64");
  return { "X-Terminal-Id": terminalId, Authorization: `Basic ${token}` };
};

const request = async (urlPath, options = {}) => {
  const response = await fetch(`${baseUrl}${urlPath}`, {
    ...options,
    headers: { ...getAuthHeaders(), ...options.headers },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data) {
    const message =
      data?.error?.description || data?.description || data?.message || `QiCard error (HTTP ${response.status})`;
    throw ApiError.badGateway(message);
  }

  return data;
};

const createPayment = async ({
  requestId,
  amount,
  finishPaymentUrl,
  notificationUrl,
  customerInfo,
  additionalInfo,
}) => {
  const data = await request("/payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      requestId,
      amount,
      currency: "IQD",
      locale: "en_US",
      finishPaymentUrl,
      notificationUrl,
      customerInfo,
      additionalInfo,
      appChannel: false,
    }),
  });

  if (!data.paymentId || !data.formUrl) {
    throw ApiError.badGateway("لم تُرجع بوابة كي كارد بيانات دفع صالحة");
  }

  return data;
};

const getPaymentStatus = (paymentId) => request(`/payment/${encodeURIComponent(paymentId)}/status`);

// Optional: only checked when QICARD_PUBLIC_KEY is set.
const isValidSignature = (payload, signature) => {
  if (!publicKey) return true;
  if (!signature) return false;

  const signedText = [
    payload.paymentId || "-",
    payload.amount ? `${payload.amount}.000` : "-",
    payload.currency || "-",
    payload.creationDate || "-",
    payload.status || "-",
  ].join("|");

  try {
    const verifier = crypto.createVerify("sha256");
    verifier.update(signedText);
    verifier.end();
    return verifier.verify(publicKey, Buffer.from(signature, "base64"));
  } catch {
    return false;
  }
};

module.exports = { createPayment, getPaymentStatus, isValidSignature };
