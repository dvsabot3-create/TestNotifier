/**
 * AsyncLock - Prevents race conditions in booking operations
 * Ensures only one booking operation runs at a time
 */
class AsyncLock {
  constructor() {
    this.locked = false;
    this.queue = [];
    this.lockName = null;
  }

  /**
   * Acquire a lock for a specific operation
   * @param {string} name - Name of the lock/operation
   * @param {Function} fn - Function to execute while holding the lock
   * @returns {Promise<any>} Result of the function
   */
  async acquire(name, fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ name, fn, resolve, reject });
      this.process();
    });
  }

  /**
   * Process the next item in the queue
   */
  async process() {
    if (this.locked || this.queue.length === 0) return;

    this.locked = true;
    const { name, fn, resolve, reject } = this.queue.shift();
    this.lockName = name;

    try {
      console.log(`[AsyncLock] Acquired lock: ${name}`);
      const result = await fn();
      resolve(result);
    } catch (error) {
      console.error(`[AsyncLock] Error in ${name}:`, error);
      reject(error);
    } finally {
      console.log(`[AsyncLock] Released lock: ${name}`);
      this.locked = false;
      this.lockName = null;
      // Process next item in queue
      setTimeout(() => this.process(), 0);
    }
  }

  /**
   * Check if currently locked
   * @returns {boolean}
   */
  isLocked() {
    return this.locked;
  }

  /**
   * Get current lock name
   * @returns {string|null}
   */
  getCurrentLock() {
    return this.lockName;
  }

  /**
   * Clear the queue (emergency reset)
   */
  clear() {
    this.queue = [];
    this.locked = false;
    this.lockName = null;
  }

  /**
   * Get queue length
   * @returns {number}
   */
  getQueueLength() {
    return this.queue.length;
  }
}

// Export singleton instance
module.exports = new AsyncLock();
