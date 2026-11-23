import assert from 'node:assert/strict';
import { test } from 'node:test';

const budgetTools = () => import('../public/support-map/assets/wmm-budget-tools.mjs');

test('the lower base price can cost more after separately charged items', async () => {
  const { compareQuotes } = await budgetTools();
  const comparison = compareQuotes([
    { name: ' 견적 A ', base: '100000', extra: '25000' },
    { name: '견적 B', base: 115000 },
  ]);

  assert.deepEqual(comparison, {
    quotes: [
      { name: '견적 A', base: 100000, extra: 25000, total: 125000 },
      { name: '견적 B', base: 115000, extra: 0, total: 115000 },
    ],
    lowerQuote: { name: '견적 B', base: 115000, extra: 0, total: 115000 },
    difference: 10000,
  });
});

test('equal totals have no lower quote', async () => {
  const { compareQuotes } = await budgetTools();
  const comparison = compareQuotes([
    { name: '견적 A', base: 0, extra: '10000' },
    { name: '견적 B', base: 10000, extra: ' ' },
  ]);

  assert.equal(comparison.lowerQuote, null);
  assert.equal(comparison.difference, 0);
  assert.equal(comparison.quotes[1].extra, 0);
});

test('an estimate listed first may be the lower quote', async () => {
  const { compareQuotes } = await budgetTools();
  const comparison = compareQuotes([
    { name: '견적 A', base: 12000 },
    { name: '견적 B', base: 11000, extra: 6000 },
  ]);

  assert.equal(comparison.lowerQuote.name, '견적 A');
  assert.equal(comparison.difference, 5000);
});

test('each quote requires a distinct nonblank name and the comparison requires two quotes', async () => {
  const { compareQuotes } = await budgetTools();
  const quote = { name: '견적 A', base: 10000 };

  assert.throws(() => compareQuotes([quote]), TypeError);
  assert.throws(() => compareQuotes([quote, { name: '견적 B', base: 9000 }, quote]), TypeError);
  assert.throws(() => compareQuotes([quote, { name: ' ', base: 10000 }]), TypeError);
  assert.throws(() => compareQuotes([quote, { name: ' 견적 A ', base: 10000 }]), TypeError);
});

test('a base price must be present and each entered price must be a supported whole-won amount', async () => {
  const { compareQuotes } = await budgetTools();
  const quote = { name: '견적 A', base: 10000 };
  const invalidPrices = [undefined, ' ', '100원', '1,000', '1.5', -1, 1.5, Infinity, Number.MAX_SAFE_INTEGER, true, null];

  for (const base of invalidPrices) {
    assert.throws(() => compareQuotes([quote, { name: '견적 B', base }]), `invalid base ${String(base)}`);
  }
  assert.throws(() => compareQuotes([quote, { name: '견적 B', base: 9000, extra: -1 }]), RangeError);
  assert.throws(() => compareQuotes([quote, { name: '견적 B', base: 9000, extra: 1_000_000_000_001 }]), RangeError);

  const comparison = compareQuotes([
    quote,
    { name: '견적 B', base: 1_000_000_000_000, extra: 1_000_000_000_000 },
  ]);
  assert.equal(comparison.quotes[1].total, 2_000_000_000_000);
});
