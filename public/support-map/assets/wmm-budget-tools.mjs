const maxPrice = 1_000_000_000_000;
const wonFormatter = new Intl.NumberFormat('ko-KR');

function readPrice(value, optional = false) {
  if (optional && (value === undefined || (typeof value === 'string' && value.trim() === ''))) {
    return 0;
  }

  const amount = typeof value === 'string' && /^\d+$/.test(value.trim()) ? Number(value) : value;
  if (typeof amount !== 'number') {
    throw new TypeError('Enter a whole-won amount.');
  }
  if (!Number.isSafeInteger(amount) || amount < 0 || amount > maxPrice) {
    throw new RangeError(`Each price must be between 0 and ${maxPrice} won.`);
  }
  return amount;
}

function readQuote(row) {
  const name = typeof row?.name === 'string' ? row.name.trim() : '';
  if (!name) throw new TypeError('Each quote needs a name.');

  const base = readPrice(row.base);
  const extra = readPrice(row.extra, true);
  return { name, base, extra, total: base + extra };
}

export function compareQuotes(rows) {
  if (!Array.isArray(rows) || rows.length !== 2) {
    throw new TypeError('Compare exactly two quotes.');
  }

  const firstQuote = readQuote(rows[0]);
  const secondQuote = readQuote(rows[1]);
  if (firstQuote.name === secondQuote.name) {
    throw new TypeError('Give each quote a distinct name.');
  }

  const difference = firstQuote.total - secondQuote.total;
  return {
    quotes: [firstQuote, secondQuote],
    lowerQuote: difference === 0 ? null : (difference < 0 ? firstQuote : secondQuote),
    difference: Math.abs(difference),
  };
}

function formatWon(amount) {
  return `${wonFormatter.format(amount)}원`;
}

function attachQuoteCalculator() {
  const form = document.getElementById('quote-calculator');
  const result = document.getElementById('quote-result');
  if (!form || !result) return;

  const quoteFields = ['a', 'b'].map((prefix) => ({
    name: `견적 ${prefix.toUpperCase()}`,
    base: form.elements.namedItem(`${prefix}-base`),
    extra: form.elements.namedItem(`${prefix}-extra`),
  }));
  const inputs = quoteFields.flatMap(({ base, extra }) => [base, extra]);
  if (inputs.some((input) => input?.type !== 'number')) return;

  for (const input of inputs) {
    input.min = '0';
    input.max = String(maxPrice);
    input.step = '1';
  }
  for (const { base } of quoteFields) base.required = true;

  const initialResult = result.textContent;
  form.addEventListener('input', () => {
    if (result.textContent !== initialResult) result.textContent = initialResult;
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const { quotes, lowerQuote, difference } = compareQuotes(quoteFields.map(({ name, base, extra }) => ({
      name,
      base: base.valueAsNumber,
      extra: extra.value === '' ? undefined : extra.valueAsNumber,
    })));
    const summary = lowerQuote
      ? `${lowerQuote.name}의 합계가 ${formatWon(difference)} 더 낮습니다.`
      : '두 견적의 합계가 같습니다.';
    const breakdown = quotes.map(({ name, base, extra, total }) => (
      `${name} 합계 ${formatWon(total)} (기본 ${formatWon(base)} + 추가 ${formatWon(extra)})`
    ));
    result.textContent = [summary, breakdown.join(' · ')].join(' ');
  });

  for (const fieldset of form.querySelectorAll('fieldset[disabled]')) fieldset.disabled = false;
}

if (typeof document !== 'undefined') attachQuoteCalculator();
