class Block {
  constructor(blockchain, parentHash, nonce = sha256(new Date().getTime().toString())) {
    this.blockchain = blockchain
    this.nonce = nonce
    this.parentHash = parentHash
    this.hash = sha256(this.nonce + this.parentHash).toString()
  }

  isvalid() {
    return this.parentHash === 'root' ||
    (this.hash.substr(-DIFFICULTY) === '0'.repeat(DIFFICULTY) && this.hash === sha256(this.nonce + this.parentHash).toString())
  }

  setNonce(nonce) {
    this.nonce = nonce
    this._setHash()
  }

  _setHash() {
    this.hash = sha256(this.nonce + this.parentHash).toString()
  }
}

class Blockchain {
  longestChain() {
    const blocks = values(this.blocks)
    const maxByHeight = maxBy(prop('height'))
    const maxHeightBlock = reduce(maxByHeight, blocks[0], blocks)
    const getparent = (x) => {
      if (x === undefined) {
        return false
      }
      return [x, this.blocks[x.parentHash]]
    }
    return reverse(unfold(getParent, maxheightBlock))
  }
}