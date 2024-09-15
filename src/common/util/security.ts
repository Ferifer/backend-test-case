import * as bcrypt from 'bcrypt';
import { sha384 } from 'node-forge';

const ROUND = 10;

function gen_sha384(plain_text: string): string {
  const md = sha384.create();
  md.update(plain_text);
  return md.digest().toHex();
}

export async function generate_password(plain_text: string): Promise<string> {
  const SALT = await bcrypt.genSalt(ROUND);
  const hash = gen_sha384(plain_text);
  return await bcrypt.hash(hash, SALT);
}

export async function check_password(
  plain_text: string,
  encrypted: string,
): Promise<boolean> {
  const hash = gen_sha384(plain_text);
  return await bcrypt.compare(hash, encrypted);
}
