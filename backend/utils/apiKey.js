import crypto from 'crypto';

export const generateApiKey = () => {
    return 'wak_' + crypto.randomBytes(32).toString('hex');
};
