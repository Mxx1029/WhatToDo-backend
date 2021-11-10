import bcrypt from 'bcrypt';

async function hash(password) {
    return await bcrypt.hash(password, 10);
};

async function compareHashes(incomingPassword, savedHash) {
    return await bcrypt.compare(incomingPassword, savedHash);
};

export { hash, compareHashes };