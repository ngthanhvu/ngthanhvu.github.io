const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

const normalizeSecret = (value: string): string =>
  value.trim().replace(/\s+/g, "").replace(/-/g, "").toUpperCase();

const decodeBase32 = (value: string): Uint8Array<ArrayBuffer> => {
  const normalized = normalizeSecret(value).replace(/=+$/g, "");
  let bits = "";
  const bytes: number[] = [];

  for (const char of normalized) {
    const index = BASE32_ALPHABET.indexOf(char);
    if (index === -1) {
      throw new Error("Secret must be base32 encoded");
    }

    bits += index.toString(2).padStart(5, "0");
  }

  for (let offset = 0; offset + 8 <= bits.length; offset += 8) {
    bytes.push(Number.parseInt(bits.slice(offset, offset + 8), 2));
  }

  return Uint8Array.from(bytes);
};

const toCounterBuffer = (counter: number): ArrayBuffer => {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  const high = Math.floor(counter / 2 ** 32);
  const low = counter >>> 0;

  view.setUint32(0, high);
  view.setUint32(4, low);

  return buffer;
};

export const parseTotpSecret = (value: string): string => {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error("Secret is required");
  }

  if (trimmed.toLowerCase().startsWith("otpauth://")) {
    const url = new URL(trimmed);
    const secret = url.searchParams.get("secret");

    if (!secret) {
      throw new Error("otpauth URL is missing the secret parameter");
    }

    return normalizeSecret(secret);
  }

  return normalizeSecret(trimmed);
};

export const generateTotp = async (
  secretInput: string,
  timestamp = Date.now(),
  step = 30,
  digits = 6
): Promise<string> => {
  const secret = parseTotpSecret(secretInput);
  const counter = Math.floor(timestamp / 1000 / step);
  const secretBytes = decodeBase32(secret);
  const key = await crypto.subtle.importKey(
    "raw",
    secretBytes,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );

  const signature = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, toCounterBuffer(counter))
  );
  const offset = signature[signature.length - 1] & 0x0f;
  const binary =
    ((signature[offset] & 0x7f) << 24) |
    (signature[offset + 1] << 16) |
    (signature[offset + 2] << 8) |
    signature[offset + 3];

  return (binary % 10 ** digits).toString().padStart(digits, "0");
};

export const getTotpRemainingSeconds = (timestamp = Date.now(), step = 30): number => {
  const elapsed = Math.floor(timestamp / 1000) % step;
  return step - elapsed;
};
