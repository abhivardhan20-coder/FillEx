function decodeBase64(value: string) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

function encodeBase64(value: Uint8Array) {
  let binary = '';
  for (const byte of value) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export async function encryptBrokerSecret(value: string) {
  const encodedKey = process.env.BROKER_TOKEN_ENCRYPTION_KEY;
  if (!encodedKey) throw new Error('Broker token encryption is not configured.');
  const keyBytes = decodeBase64(encodedKey);
  if (keyBytes.byteLength !== 32) throw new Error('Broker token encryption key is invalid.');
  const key = await crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['encrypt']);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(value)));
  return `v1.${encodeBase64(iv)}.${encodeBase64(ciphertext)}`;
}

export async function decryptBrokerSecret(value: string) {
  const encodedKey = process.env.BROKER_TOKEN_ENCRYPTION_KEY;
  if (!encodedKey) throw new Error('Broker token encryption is not configured.');
  const keyBytes = decodeBase64(encodedKey);
  if (keyBytes.byteLength !== 32) throw new Error('Broker token encryption key is invalid.');
  const [version, encodedIv, encodedCiphertext] = value.split('.');
  if (version !== 'v1' || !encodedIv || !encodedCiphertext) throw new Error('Broker token payload is invalid.');
  const key = await crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['decrypt']);
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: decodeBase64(encodedIv) },
    key,
    decodeBase64(encodedCiphertext),
  );
  return new TextDecoder().decode(plaintext);
}
