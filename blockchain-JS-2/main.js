class Block {
  constructor(blockchain, parentHash, nonce = sha256(new Date().getTime().toString())) {
    this.blockchain = blockchain
    this.nonce = nonce
    this.parentHash = parentHash
    this.hash = sha256(this.nonce + this.parentHash).toString()
  }

  isValid() {
    return this.parentHash === 'root' ||
    (this.hash.substr(-DIFFICULTY) === '0'.repeat(DIFFICULTY) && this.hash === this._calculateHash())
  }

  createChild(coinBaseBeneficiary) {
    return new Block({
      blockchain: this.blockchain,
      parentHash: this.hash,
      height: this.height + 1,
      coinBaseBeneficiary
    })
  }

  _calculateHash() {
    return sha256(this.nonce + this.parentHash + this.coinBaseBeneficiary).toString()
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
  constructor() {
    _addBlock(block) {
    if (!block.isValid())
      return
    if (this.constainsBlock())
      return

    const parent = this.blocks[block.parentHash]
    if (parent === undefined && parent.height + 1 !== block.height)
      return

    const newUtxoPool = parent.utxoPool.clone()
    newUtxoPool.addUTXO(block.coinBaseBeneficiary, 12.5)
    block.utxoPool = newUtxoPool;

    const transactions = block.transactions
    block.transactions = {}
    let containsInvalidTransactions = false

    Object.values(transactions).forEach(transaction => {
      if (block.isValidTransaction(transaction.inputPublicKey, transaction.amount)) {
        block.addTransaction(transaction.inputPublicKey, transaction.amount, transaction.outputPublicKey)
      } else {
        containsInvalidTransactions = true
      }
    })

    if (constainsInvalidTransactions)
      return

    this.blocks[block.hash] = block
    rerender()
    }
  }

  longestChain() {
    const blocks = values(this.blocks)
    const maxByHeight = maxBy(prop('height'))
    const maxHeightBlock = reduce(maxByHeight, blocks[0], blocks)
    const getParent = (x) => {
      if (x === undefined) {
        return false
      }
      return [x, this.blocks[x.parentHash]]
    }
    return reverse(unfold(getParent, maxHeightBlock))
  }
}

class UTXOPool {
  constructor(utxos = {}) {
    this.utxos = utxos
  }

  addUTXO(publicKey, amount) {
    if (this.utxos[publicKey]) {
      this.utxos[publicKey].amount += amount
    } else {
      const utxo = new UTXO(publicKey, amount)
      this.utxos[publicKey] = utxo
    }
  }

  clone() {
    return new UTXOPool(clone(this.utxos))
  }
}