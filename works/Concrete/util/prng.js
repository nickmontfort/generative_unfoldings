const MAX_VALID_UINT32 = 4294967295.0;
const MAX_UINT32 = 4294967296.0;

const GEN_SEED = 988523490;

let uint32;

const defaultRandom = PRNG().seed(GEN_SEED);

function PRNG() {
  const SizeState = 624;
  const M = 397;
  const FirstHalf = SizeState - M;
  let state = new Uint32Array(SizeState);
  let index = 0;
  const MATRIX_A = 0x9908b0df; /* constant vector a */
  const UPPER_MASK = 0x80000000; /* most significant w-r bits */
  const LOWER_MASK = 0x7fffffff; /* least significant r bits */
  const mag01 = new Uint32Array(2);
  mag01[0] = 0;
  mag01[1] = MATRIX_A;

  return {
    seed,
    next_uint32,
    next,
    nextIncludingOne,
  };

  function seed(uint32Seed) {
    state[0] = uint32Seed >>> 0;
    for (let i = 1; i < SizeState; i++) {
      var s = state[i - 1] ^ (state[i - 1] >>> 30);
      state[i] =
        ((((s & 0xffff0000) >>> 16) * 1812433253) << 16) +
        (s & 0x0000ffff) * 1812433253 +
        i;
      /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
      /* In the previous versions, MSBs of the seed affect   */
      /* only MSBs of the array mt[].                        */
      /* 2002/01/09 modified by Makoto Matsumoto             */
      state[i] >>>= 0;
      /* for >32 bit machines */
    }
    twist();
    return this;
  }

  function next() {
    return next_uint32() * (1.0 / MAX_UINT32);
  }

  function nextIncludingOne() {
    return next_uint32() * (1.0 / MAX_VALID_UINT32);
  }

  function next_uint32() {
    // compute new state ?
    if (index >= SizeState) {
      twist();
    }
    // shuffle bits around
    let x = state[index++];
    x ^= x >>> 11;
    x ^= (x << 7) & 0x9d2c5680;
    x ^= (x << 15) & 0xefc60000;
    x ^= x >>> 18;
    return x >>> 0;
  }

  function twist() {
    let kk;
    let y;
    for (kk = 0; kk < SizeState - M; kk++) {
      y = (state[kk] & UPPER_MASK) | (state[kk + 1] & LOWER_MASK);
      state[kk] = state[kk + M] ^ (y >>> 1) ^ mag01[y & 0x1];
    }
    for (; kk < SizeState - 1; kk++) {
      y = (state[kk] & UPPER_MASK) | (state[kk + 1] & LOWER_MASK);
      state[kk] = state[kk + (M - SizeState)] ^ (y >>> 1) ^ mag01[y & 0x1];
    }
    y = (state[SizeState - 1] & UPPER_MASK) | (state[0] & LOWER_MASK);
    state[SizeState - 1] = state[M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];
    // reset to zero for index random number
    index = 0;
  }
}

PRNG.generateSeedFast = generateSeedFast;
function generateSeedFast() {
  return Math.floor(defaultRandom.next() * MAX_VALID_UINT32);
}

PRNG.generateSeed = generateSeed;
function generateSeed() {
  if (window.crypto && window.crypto.getRandomValues) {
    if (!uint32) uint32 = new Uint32Array(1);
    window.crypto.getRandomValues(uint32);
    return uint32[0];
  }
  return Math.floor(Math.random() * MAX_VALID_UINT32);
}

PRNG.MAX_VALID_UINT32 = MAX_VALID_UINT32;

module.exports = PRNG;
