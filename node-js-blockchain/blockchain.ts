import SHA256 from "crypto-js/sha256";
// Genesis Block
function generateGenesisBlock() {
  const block = {
    timestamp:  + new Date(),
    data: 'Genesis Block',
    previousHash: '0'
  }
  return {
    ...block,
    hash: calculateHash(block)
  }
}
// generateGenesisBlock()

function calculateHash({previousHash, timestamp, data, nonce = 1}) {
  return SHA256(previousHash + timestamp + JSON.stringify(data) + nonce).toString();
}

function checkDifficuty(difficulty, hash) {
  return hash.substr(0, difficulty) === '0'.repeat(difficulty)
}

function updateHash(block) {
  return { ...block, hash: calculateHash(block)}
}

function nextNonce(block) {
  return updateHash({ ...block, nonce: block.nonce + 1})
}

function trampoline(func) {
  let result = func.apply(func, ...arguments);
  while(result && typeof(result) === 'function') {
    result = result();
  }
  return result;
}

function mineBlock(difficulty, block) {
  function mine(block) {
    const newBlock = nextNonce(block);
    return checkDifficuty(difficulty, newBlock.hash)
    ? newBlock : () => mine(nextNonce(block));
  }
}

// let Blockchain: {
//   timestamp:    1568468720410,
//   data:         "I am a block",
//   previousHash: "2510c39011c5be704182423e3a695e91",
//   hash:         "363b122c528f54df4a0446b6bab05515"
// }

// let Block: {
//   data: {
//     sender: 'x3041d34134g22d',
//     receiver: 'x3041d22244g22d',
//     amout: 0.0012,
//     currency: 'BTC'
//   },
//   timestamp: 1568481293771.0012
//   previousHash: "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae"
// }
