// Mining worker code for CSP compliance

let isRunning = false;
let hashCount = 0;

self.onmessage = function(e) {
  if (e.data.type === 'start') {
    isRunning = true;
    hashCount = 0;
    const { blockData, difficulty } = e.data;
    const target = '0'.repeat(difficulty);
    let nonce = Math.floor(Math.random() * 1000000);
    function sha256(message) {
      const hash = new TextEncoder().encode(message);
      return crypto.subtle.digest('SHA-256', hash).then(buffer => {
        return Array.from(new Uint8Array(buffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      });
    }
    async function mine(data, difficulty) {
      while (isRunning) {
        const blockData = data + nonce;
        const hash = await sha256(blockData);
        hashCount++;
        if (hash.startsWith(target)) {
          self.postMessage({ type: 'solution', nonce, hash, hashCount });
          break;
        }
        nonce++;
        if (nonce % 1000 === 0) {
          await new Promise(resolve => setTimeout(resolve, 1));
        }
      }
    }
    mine(blockData, difficulty);
  } else if (e.data.type === 'stop') {
    isRunning = false;
  } else if (e.data.type === 'getHashCount') {
    self.postMessage({ type: 'hashCount', count: hashCount });
    hashCount = 0;
  }
};
