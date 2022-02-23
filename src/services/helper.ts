import crypto from 'crypto';
export const encap = {
  salt: crypto.randomBytes(8).toString('hex'),
  hash: (password: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      crypto.scrypt(password, encap.salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(`${encap.salt}:${derivedKey.toString('hex')}`);
      });
    });
  },
  verify: (password: string, hashedValue: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const [salt, key] = hashedValue.split(':');
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(crypto.timingSafeEqual(Buffer.from(key, 'hex'), derivedKey));
      });
    });
  },
};

export default encap;
