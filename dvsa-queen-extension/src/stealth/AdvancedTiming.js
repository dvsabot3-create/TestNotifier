/**
 * Advanced Timing System with Human-like Patterns
 * Replaces predictable intervals with adaptive, human-like timing
 */

class AdvancedTiming {
  constructor() {
    this.basePatterns = {
      search: { min: 8000, max: 25000, mean: 15000 },
      click: { min: 1200, max: 3500, mean: 2200 },
      type: { min: 80, max: 300, mean: 180 },
      scroll: { min: 800, max: 2000, mean: 1400 },
      pause: { min: 2000, max: 8000, mean: 4500 }
    };

    this.adaptiveMultiplier = 1.0;
    this.recentActions = [];
    this.maxHistory = 20;
    this.sessionStart = Date.now();
    this.lastActionTime = Date.now();

    // Human behavior patterns
    this.humanPatterns = {
      fatigueFactor: 1.0, // Increases over time to simulate fatigue
      distractionProbability: 0.05, // 5% chance of longer pause
      rushProbability: 0.02, // 2% chance of faster action
      consistencyProbability: 0.15 // 15% chance of consistent timing
    };
  }

  /**
   * Get next timing interval with human-like characteristics
   * @param {string} type - Type of action (search, click, type, scroll, pause)
   * @param {Object} context - Additional context for timing
   * @returns {number} Milliseconds to wait
   */
  async getNextInterval(type, context = {}) {
    const basePattern = this.basePatterns[type];
    if (!basePattern) {
      throw new Error(`Unknown timing type: ${type}`);
    }

    // Calculate base interval using Gaussian distribution
    let interval = this.gaussianRandom(basePattern.mean,
      (basePattern.max - basePattern.min) / 6);

    // Apply human behavior patterns
    interval = this.applyHumanBehaviorPatterns(interval, type, context);

    // Apply fatigue factor (increases over time)
    const sessionDuration = Date.now() - this.sessionStart;
    this.humanPatterns.fatigueFactor = Math.min(1.5, 1.0 + (sessionDuration / 3600000) * 0.1);
    interval *= this.humanPatterns.fatigueFactor;

    // Apply adaptive multiplier based on recent actions
    interval *= this.adaptiveMultiplier;

    // Ensure within bounds
    interval = Math.max(basePattern.min, Math.min(basePattern.max, interval));

    // Add some micro-variation (±100ms)
    interval += (Math.random() - 0.5) * 200;

    // Round to nearest 50ms (human-like precision)
    interval = Math.round(interval / 50) * 50;

    this.recordAction(type, interval);
    this.lastActionTime = Date.now();

    console.log(`[AdvancedTiming] ${type}: ${Math.round(interval)}ms (fatigue: ${this.humanPatterns.fatigueFactor.toFixed(2)})`);
    return Math.max(0, Math.round(interval));
  }

  /**
   * Apply human behavior patterns to timing
   */
  applyHumanBehaviorPatterns(interval, type, context) {
    // Occasional distraction (longer pause)
    if (Math.random() < this.humanPatterns.distractionProbability) {
      interval *= 1.5 + Math.random() * 2.0;
      console.log(`[AdvancedTiming] Applied distraction pattern to ${type}`);
    }

    // Occasional rushing (faster action)
    if (Math.random() < this.humanPatterns.rushProbability) {
      interval *= 0.6 + Math.random() * 0.3;
      console.log(`[AdvancedTiming] Applied rush pattern to ${type}`);
    }

    // Consistency pattern (similar to recent actions)
    if (Math.random() < this.humanPatterns.consistencyProbability) {
      const recentSimilar = this.getRecentSimilarActions(type);
      if (recentSimilar.length > 0) {
        const avgTime = recentSimilar.reduce((sum, action) => sum + action.interval, 0) / recentSimilar.length;
        interval = avgTime * (0.9 + Math.random() * 0.2);
        console.log(`[AdvancedTiming] Applied consistency pattern to ${type}`);
      }
    }

    // Context-based adjustments
    if (context.stress) {
      interval *= 0.8; // Faster under stress
    }

    if (context.careful) {
      interval *= 1.3; // Slower when being careful
    }

    return interval;
  }

  /**
   * Gaussian (normal) distribution random number
   */
  gaussianRandom(mean, stdDev) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();

    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * stdDev + mean;
  }

  /**
   * Record action for pattern analysis
   */
  recordAction(type, interval) {
    this.recentActions.push({
      type,
      interval,
      timestamp: Date.now()
    });

    // Keep only recent actions
    if (this.recentActions.length > this.maxHistory) {
      this.recentActions.shift();
    }

    // Adjust adaptive multiplier based on patterns
    this.updateAdaptiveMultiplier();
  }

  /**
   * Get recent similar actions
   */
  getRecentSimilarActions(type) {
    const cutoff = Date.now() - 300000; // Last 5 minutes
    return this.recentActions.filter(action =>
      action.type === type && action.timestamp > cutoff
    );
  }

  /**
   * Update adaptive multiplier based on recent patterns
   */
  updateAdaptiveMultiplier() {
    if (this.recentActions.length < 5) return;

    const recentIntervals = this.recentActions.slice(-5).map(a => a.interval);
    const variance = this.calculateVariance(recentIntervals);

    // If variance is too low (robotic), increase randomness
    if (variance < 100) {
      this.adaptiveMultiplier = 1.0 + (Math.random() - 0.5) * 0.3;
      console.log('[AdvancedTiming] Increased randomness due to low variance');
    } else {
      // Gradually return to normal
      this.adaptiveMultiplier += (1.0 - this.adaptiveMultiplier) * 0.1;
    }
  }

  /**
   * Calculate variance of an array
   */
  calculateVariance(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * Simulate human typing pattern
   */
  async simulateHumanTyping(element, text) {
    const typingPattern = this.generateTypingPattern(text);

    for (const char of typingPattern) {
      if (char.delay) {
        await this.sleep(char.delay);
      }

      if (char.char) {
        // Simulate realistic key events
        const keyEvent = new KeyboardEvent('keydown', {
          key: char.char,
          code: `Key${char.char.toUpperCase()}`,
          keyCode: char.char.toUpperCase().charCodeAt(0),
          which: char.char.toUpperCase().charCodeAt(0),
          bubbles: true
        });

        element.dispatchEvent(keyEvent);
        element.value += char.char;
        element.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  }

  /**
   * Generate human-like typing pattern
   */
  generateTypingPattern(text) {
    const pattern = [];
    let position = 0;

    while (position < text.length) {
      // Sometimes make mistakes and correct them
      if (Math.random() < 0.02 && position > 0) { // 2% chance of typo
        const wrongChar = this.generateTypo(text[position]);
        pattern.push({ char: wrongChar });
        pattern.push({ delay: this.gaussianRandom(200, 50) });

        // Backspace
        pattern.push({ char: '\b' });
        pattern.push({ delay: this.gaussianRandom(150, 30) });
      }

      pattern.push({ char: text[position] });

      // Variable delay between characters
      const delay = this.gaussianRandom(180, 40);
      pattern.push({ delay: Math.max(50, delay) });

      position++;
    }

    return pattern;
  }

  /**
   * Generate a typo for a character
   */
  generateTypo(char) {
    const nearbyKeys = {
      'a': 's', 's': 'a', 'd': 's', 'f': 'd', 'g': 'f', 'h': 'g', 'j': 'h', 'k': 'j', 'l': 'k',
      'q': 'w', 'w': 'q', 'e': 'w', 'r': 'e', 't': 'r', 'y': 't', 'u': 'y', 'i': 'u', 'o': 'i', 'p': 'o'
    };

    return nearbyKeys[char.toLowerCase()] || String.fromCharCode(char.charCodeAt(0) + (Math.random() > 0.5 ? 1 : -1));
  }

  /**
   * Sleep for specified milliseconds
   */
  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get timing statistics
   */
  getStats() {
    const stats = {};

    this.recentActions.forEach(action => {
      if (!stats[action.type]) {
        stats[action.type] = { count: 0, total: 0, intervals: [] };
      }
      stats[action.type].count++;
      stats[action.type].total += action.interval;
      stats[action.type].intervals.push(action.interval);
    });

    Object.keys(stats).forEach(type => {
      const stat = stats[type];
      stat.average = stat.total / stat.count;
      stat.variance = this.calculateVariance(stat.intervals);
    });

    return {
      stats,
      sessionDuration: Date.now() - this.sessionStart,
      fatigueFactor: this.humanPatterns.fatigueFactor,
      adaptiveMultiplier: this.adaptiveMultiplier,
      queueLength: this.recentActions.length
    };
  }

  /**
   * Reset timing state (for testing)
   */
  reset() {
    this.recentActions = [];
    this.adaptiveMultiplier = 1.0;
    this.sessionStart = Date.now();
    this.lastActionTime = Date.now();
    this.humanPatterns.fatigueFactor = 1.0;
  }
}

module.exports = AdvancedTiming;
