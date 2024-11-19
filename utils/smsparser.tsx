var i = /* @__PURE__ */ (t => (
    (t.CARD = 'CARD'), (t.WALLET = 'WALLET'), (t.ACCOUNT = 'ACCOUNT'), t
  ))(i || {}),
  u = /* @__PURE__ */ (t => (
    (t.AVAILABLE = 'AVAILABLE'), (t.OUTSTANDING = 'OUTSTANDING'), t
  ))(u || {});
const A = [
    'avbl bal',
    'available balance',
    'available limit',
    'available credit limit',
    'avbl. credit limit',
    'limit available',
    'a/c bal',
    'ac bal',
    'available bal',
    'avl bal',
    'updated balance',
    'total balance',
    'new balance',
    'bal',
    'avl lmt',
    'available',
  ],
  y = ['outstanding'],
  L = ['paytm', 'simpl', 'lazypay', 'amazon_pay'],
  N = ['upi', 'ref no', 'upi ref', 'upi ref no'],
  m = [
    {
      regex: /credit\scard/g,
      word: 'c_card',
      type: i.CARD,
    },
    {
      regex: /amazon\spay/g,
      word: 'amazon_pay',
      type: i.WALLET,
    },
    {
      regex: /uni\scard/g,
      word: 'uni_card',
      type: i.CARD,
    },
    {
      regex: /niyo\scard/g,
      word: 'niyo',
      type: i.ACCOUNT,
    },
    {
      regex: /slice\scard/g,
      word: 'slice_card',
      type: i.CARD,
    },
    {
      regex: /one\s*card/g,
      word: 'one_card',
      type: i.CARD,
    },
  ],
  T = [
    '@BARODAMPAY',
    '@rbl',
    '@idbi',
    '@upi',
    '@aubank',
    '@axisbank',
    '@bandhan',
    '@dlb',
    '@indus',
    '@kbl',
    '@federal',
    '@sbi',
    '@uco',
    '@citi',
    '@citigold',
    '@dlb',
    '@dbs',
    '@freecharge',
    '@okhdfcbank',
    '@okaxis',
    '@oksbi',
    '@okicici',
    '@yesg',
    '@hsbc',
    '@idbi',
    '@icici',
    '@indianbank',
    '@allbank',
    '@kotak',
    '@ikwik',
    '@unionbankofindia',
    '@uboi',
    '@unionbank',
    '@paytm',
    '@ybl',
    '@axl',
    '@ibl',
    '@sib',
    '@yespay',
  ],
  v = t => !Number.isNaN(Number(t)),
  R = t => {
    const [e, c] = [t[0], t[t.length - 1]];
    let n = Number.isNaN(Number(c)) ? t.slice(0, -1) : t;
    return (n = Number.isNaN(Number(e)) ? n.slice(1) : n), n;
  },
  E = t => {
    const e = t.replace('ac', '');
    return Number.isNaN(Number(e)) ? '' : e;
  },
  h = t => {
    let e = t.toLowerCase();
    return (
      (e = e.replace(/!/g, '')),
      (e = e.replace(/:/g, ' ')),
      (e = e.replace(/\//g, '')),
      (e = e.replace(/[=]/g, ' ')),
      (e = e.replace(/[{}]/g, ' ')),
      (e = e.replace(/\n/g, ' ')),
      (e = e.replace(/\r/g, ' ')),
      (e = e.replace(/ending /g, '')),
      (e = e.replace(/x|[*]/g, '')),
      (e = e.replace(/is /g, '')),
      (e = e.replace(/with /g, '')),
      (e = e.replace(/no. /g, '')),
      (e = e.replace(/\bac\b|\bacct\b|\baccount\b/g, 'ac')),
      (e = e.replace(/rs(?=\w)/g, 'rs. ')),
      (e = e.replace(/rs /g, 'rs. ')),
      (e = e.replace(/inr(?=\w)/g, 'rs. ')),
      (e = e.replace(/inr /g, 'rs. ')),
      (e = e.replace(/rs. /g, 'rs.')),
      (e = e.replace(/rs.(?=\w)/g, 'rs. ')),
      (e = e.replace(/debited/g, ' debited ')),
      (e = e.replace(/credited/g, ' credited ')),
      m.forEach(c => {
        e = e.replace(c.regex, c.word);
      }),
      e.split(' ').filter(c => c !== '')
    );
  },
  g = t => {
    let e = [];
    return typeof t === 'string' ? (e = h(t)) : (e = t), e;
  },
  p = t => {
    const [e, c] = t.split('.');
    return `${e}.${(c ?? '').padEnd(2, '0')}`;
  },
  I = (t, e, c = 1) => {
    const a = t.split(e, 2)[1];
    if (a) {
      const r = /[^0-9a-zA-Z]+/gi;
      return a.trim().split(r, c).join(' ');
    }
    return '';
  },
  O = t => {
    let e = '';
    const c = t.findIndex(
        a =>
          a === 'card' ||
          m
            .filter(r => r.type === i.CARD)
            .some(r => (r.word === a ? ((e = r.word), !0) : !1)),
      ),
      n = {type: null, name: null, number: null};
    return c !== -1
      ? ((n.number = t[c + 1]),
        (n.type = i.CARD),
        Number.isNaN(Number(n.number))
          ? {
              type: e ? n.type : null,
              name: e,
              number: null,
            }
          : n)
      : {type: null, name: null, number: null};
  },
  x = t => {
    const e = g(t);
    let c = -1,
      n = {
        type: null,
        name: null,
        number: null,
      };
    for (const [a, r] of e.entries()) {
      if (r === 'ac') {
        if (a + 1 < e.length) {
          const l = R(e[a + 1]);
          if (Number.isNaN(Number(l))) {
            continue;
          }
          (c = a), (n.type = i.ACCOUNT), (n.number = l);
          break;
        } else {
          continue;
        }
      } else if (r.includes('ac')) {
        const l = E(r);
        if (l === '') {
          continue;
        }
        (c = a), (n.type = i.ACCOUNT), (n.number = l);
        break;
      }
    }
    if ((c === -1 && (n = O(e)), !n.type)) {
      const a = e.find(r => L.includes(r));
      a && ((n.type = i.WALLET), (n.name = a));
    }
    if (!n.type) {
      const a = m
        .filter(r => r.type === i.ACCOUNT)
        .find(r => e.includes(r.word));
      (n.type = (a == null ? void 0 : a.type) ?? null),
        (n.name = (a == null ? void 0 : a.word) ?? null);
    }
    return (
      n.number && n.number.length > 4 && (n.number = n.number.slice(-4)), n
    );
  },
  B = (t, e, c) => {
    let n = '',
      a = !1,
      r = 0,
      l = '',
      s = t;
    for (; s < c; ) {
      if (((l = e[s]), l >= '0' && l <= '9')) {
        (a = !0), (n += l);
      } else if (a) {
        if (l === '.') {
          if (r === 1) {
            break;
          }
          (n += l), (r += 1);
        } else if (l !== ',') {
          break;
        }
      }
      s += 1;
    }
    return n;
  },
  D = (t, e = u.AVAILABLE) => {
    const n = `(${(e === u.AVAILABLE ? A : y).join('|')})`.replace('/', '\\/'),
      a = '([\\d]+\\.[\\d]+|[\\d]+)';
    let r = new RegExp(`${n}\\s*${a}`, 'gi'),
      l = t.match(r);
    if (l && l.length > 0) {
      const s = l[0].split(' ').pop();
      return Number.isNaN(Number(s)) ? '' : s;
    }
    if (
      ((r = new RegExp(`${a}\\s*${n}`, 'gi')),
      (l = t.match(r)),
      l && l.length > 0)
    ) {
      const s = l[0].split(' ')[0];
      return Number.isNaN(Number(s)) ? '' : s;
    }
    return null;
  },
  f = (t, e = u.AVAILABLE) => {
    const n = g(t).join(' ');
    let a = -1,
      r = '';
    const l = e === u.AVAILABLE ? A : y;
    for (const b of l) {
      if (((a = n.indexOf(b)), a !== -1)) {
        a += b.length;
        break;
      } else {
        continue;
      }
    }
    let s = a,
      o = -1,
      d = n.substr(s, 3);
    for (s += 3; s < n.length; ) {
      if (((d = d.slice(1)), (d += n[s]), d === 'rs.')) {
        o = s + 2;
        break;
      }
      s += 1;
    }
    return o === -1
      ? ((r = D(n) ?? ''), r ? p(r) : null)
      : ((r = B(o, n, n.length)), r ? p(r) : null);
  },
  w = t => {
    const e = g(t),
      c = e.join(' '),
      n = {
        merchant: null,
        referenceNo: null,
      };
    if (e.includes('vpa')) {
      const r = e.indexOf('vpa');
      if (r < e.length - 1) {
        const l = e[r + 1],
          [s] = l.replaceAll(/\(|\)/gi, ' ').split(' ');
        n.merchant = s;
      }
    }
    let a = '';
    for (let r = 0; r < N.length; r += 1) {
      const l = N[r];
      c.indexOf(l) > 0 && (a = l);
    }
    if (a) {
      const r = I(c, a);
      if (v(r)) {
        n.referenceNo = r;
      } else if (n.merchant) {
        const [l] = r.split(/[^0-9]/gi).sort((s, o) => o.length - s.length)[0];
        l && (n.referenceNo = l);
      } else {
        n.merchant = r;
      }
      if (!n.merchant) {
        const l = new RegExp(`[a-zA-Z0-9_-]+(${T.join('|')})`, 'gi'),
          s = c.match(l);
        if (s && s.length > 0) {
          const o = s[0].split(' ').pop();
          n.merchant = o ?? null;
        }
      }
    }
    return n;
  },
  C = t => {
    const c = g(t).indexOf('rs.');
    if (c === -1) {
      return '';
    }
    let n = t[c + 1];
    return (
      (n = n.replace(/,/g, '')),
      Number.isNaN(Number(n))
        ? ((n = t[c + 2]),
          (n = n == null ? void 0 : n.replace(/,/g, '')),
          Number.isNaN(Number(n)) ? '' : p(n))
        : p(n)
    );
  },
  k = t => {
    const e = /(?:credited|credit|deposited|added|received|refund|repayment)/gi,
      c = /(?:debited|debit|deducted)/gi,
      n =
        /(?:payment|spent|paid|used\s+at|charged|transaction\son|transaction\sfee|tran|booked|purchased|sent\s+to|purchase\s+of|spent\s+on)/gi,
      a = typeof t !== 'string' ? t.join(' ') : t;
    return c.test(a) || n.test(a) ? 'debit' : e.test(a) ? 'credit' : null;
  },
  M = t => {
    if (!t || typeof t !== 'string') {
      return {
        account: {
          type: null,
          number: null,
          name: null,
        },
        balance: null,
        transaction: {
          type: null,
          amount: null,
          merchant: null,
          referenceNo: null,
        },
      };
    }
    const e = h(t),
      c = x(e),
      n = f(e, u.AVAILABLE),
      a = C(e),
      l = [n, a, c.number].filter(b => b !== '').length >= 2 ? k(e) : null,
      s = {available: n, outstanding: null};
    c && c.type === i.CARD && (s.outstanding = f(e, u.OUTSTANDING));
    const {merchant: o, referenceNo: d} = w(t);
    return {
      account: c,
      balance: s,
      transaction: {
        type: l,
        amount: a,
        merchant: o,
        referenceNo: d,
      },
    };
  },
  S = x,
  $ = f,
  V = w,
  U = M,
  K = C,
  _ = k;
export {
  i as IAccountType,
  u as IBalanceKeyWordsType,
  S as getAccountInfo,
  $ as getBalanceInfo,
  V as getMerchantInfo,
  K as getTransactionAmount,
  U as getTransactionInfo,
  _ as getTransactionType,
};
