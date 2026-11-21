import {
  COMMUTATION_RATES,
  PensionCalculations,
  PensionFormData,
  diffYMD,
  formatMoney,
  formatYMD,
  fromDays360,
  parseDateStr,
  YMD,
} from './pensionEngine';

function esc(s: unknown): string {
  return String(s ?? '').replace(/[&<>"]/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] || c)
  );
}

/**
 * Generates exact official A4 HTML markup for all 16 pages of the
 * Government of Pakistan / Government of Sindh Pension Papers (Form 3 Pen. + Certificates + Descriptive Roll + A.T.C.5 LPC).
 *
 * Signature, stamp, and thumb-impression areas always remain clean & blank for manual attestation.
 */
export function buildPensionPagesHtml(
  D: PensionFormData,
  c: PensionCalculations
): string[] {
  const g = (k: string) => D[k] || '';
  const U = (k: string) => g(k).toUpperCase();

  const v = (t: string | number | null | undefined, w = 28) =>
    `<span class="pp-f" style="min-width:${w}mm">${
      t === '' || t === null || t === undefined ? '&nbsp;' : esc(t)
    }</span>`;

  const f = (k: string, w = 28) => v(g(k), w);
  const fu = (k: string, w = 28) => v(U(k), w);

  const yc = (a: YMD | null) =>
    a ? `<td>${a[0]}</td><td>${a[1]}</td><td>${a[2]}</td>` : '<td></td><td></td><td></td>';

  const sg = (label: string) => {
    const isDdoOrHod = /D\.D\.O|HEAD OF (THE )?DEP(T|ARTMENT)/i.test(label);
    const ddoName = g('ddo').trim();
    const ddoDesig = g('ddod').trim();
    if (isDdoOrHod && ddoName) {
      const content = `<span class="pp-ddo">${esc(ddoName)}</span>${
        ddoDesig ? `<br><span class="pp-ddo">${esc(ddoDesig)}</span>` : ''
      }`;
      return `<div class="pp-sg"><i></i>${content}</div><div class="pp-cl"></div>`;
    }
    return `<div class="pp-sg"><i></i>${label}</div><div class="pp-cl"></div>`;
  };

  const ln = (a: string, b: string) =>
    `<div class="pp-ln"><span>${a}</span><span class="pp-ln-val">${b}</span></div>`;

  const rowT = (prefix: string, cnt: number, labels?: string[]) => {
    let s = '';
    for (let i = 0; i < cnt; i++) {
      const a = diffYMD(g(`${prefix}${i}f`), g(`${prefix}${i}t`));
      s += `<tr><td class="l">${labels ? labels[i] : ''}</td><td>${esc(
        g(`${prefix}${i}f`)
      )}</td><td>${esc(g(`${prefix}${i}t`))}</td>${yc(a)}</tr>`;
    }
    return s;
  };

  const pre = g('pre') || 'Mr.';
  const isFemale = pre === 'Mst.' || pre === 'Miss';
  const subjPronoun = isFemale ? 'She' : 'He';
  const objPronoun = isFemale ? 'her' : 'him';

  const nm = `${pre} ${g('name')}`.trim().toUpperCase();
  const bareName = nm.replace(/^(MR\.|MST\.|MISS)\s*/i, '');
  const N = v(nm, 52);
  const rel = g('rel') || 'S/O';
  const ds = fu('desig', 38);
  const dr = f('dor', 24);
  const kind = g('kind') || 'Retired';
  const W = `Mr./Mst. ${v(bareName, 50)} ${esc(rel)} ${fu('father', 44)}`;
  const own = `${W}<br>Designation ${ds}`;
  const ret = `${esc(kind)} / Expired on ${dr}`;
  const endDdo = sg('D.D.O with Office Stamp');

  const cert = (title: string, body: string) =>
    `<div class="pp-bx"><h3 class="pp-cert-h">${title}</h3>${body}</div>`;

  const pages: string[] = [];

  // ── PAGE 1: COVER PAGE ──────────────────────────────────────────────
  pages.push(`
    <div class="pp-c pp-cov">
      <div class="pp-r"><b>Pay Roll No.</b> ${f('pid', 34)}</div>
      <h1 class="pp-cov-h1">PENSION<br>PAPERS<br>OF</h1>
      <h2 class="pp-cov-h2">${v(nm, 110)}</h2>
      <p class="pp-cov-sub">${ds} ${f('dept', 54)}</p>
      <p class="pp-cov-meta">CNIC: ${f('cnic', 42)}</p>
      <p class="pp-cov-meta">${esc(kind)} on: ${dr}</p>
      ${g('office') ? `<p class="pp-cov-office">${esc(U('office'))}</p>` : ''}
    </div>
  `);

  // ── PAGE 2: FORWARDING LETTER TO DAO ────────────────────────────────
  pages.push(`
    <p class="pp-r"><b>Date:</b> ${f('dapp', 28)}</p>
    <p>To,<br><b>The District Accounts Officer,</b><br><b>${fu('pplace', 50)}</b></p>
    <p><b>Subject:&nbsp;&nbsp;SUBMISSION OF PENSION PAPERS OF ${v(nm, 0)} ${esc(rel)} ${esc(
    U('father')
  )}, ${esc(U('desig'))}, ${esc(U('office'))} (${esc(U('dept'))}), ${esc(
    kind.toUpperCase()
  )} ON ${esc(g('dor'))}.</b></p>
    <p>Sir,</p>
    <p class="pp-j">With reference to the subject above, I am directed to forward herewith the complete pension case of ${N} ${esc(
      rel
    )} ${fu('father', 42)}, ${ds}, CNIC No. ${f('cnic', 34)}, Personal / Pay Roll ID ${f(
    'pid',
    24
  )}, who ${kind === 'Expired' ? 'expired' : 'retired'} from Government service on ${dr} after rendering a qualifying service of ${v(
    c.tq ? formatYMD(fromDays360(c.tq)) : '',
    40
  )}.</p>
    <p>The following documents are enclosed:</p>
    <div class="pp-ix">
      1. Pension Application Form 3 (Pen.) Part I &amp; II.<br>
      2. Calculation of Qualifying Service, Ordinary &amp; Special Additional Pension and Commutation.<br>
      3. Bonafide, No Enquiry, No Advance &amp; No Dues, No Demand, No Irregularity, Audit Objection and Embezzlement Certificates.<br>
      4. Option and Undertaking (with Undertaking / Affidavit on stamp paper Rs. 20).<br>
      5. Descriptive Roll, Specimen Signatures and Thumb &amp; Finger Impressions.<br>
      6. Last Pay Certificate (A.T.C.5) and LPC / Pay Roll.<br>
      7. Three passport size photographs of the pensioner, duly attested.
    </div>
    <p class="pp-j">It is requested that the pension and commutation admissible under the rules may kindly be sanctioned and the Pension Payment Order issued at an early date.</p>
    <p>Yours obediently,</p>
    ${sg('Head of Department / D.D.O<br>(Signature &amp; Official Stamp)')}
    <p class="pp-sm">Copy to: The pensioner, ${nm ? esc(nm) : '_______________________'}, for information.</p>
  `);

  // ── PAGE 3: FINANCE DEPARTMENT NOTIFICATION (29 JULY 1967) ─────────
  pages.push(`
    <h3>Government of Pakistan – Finance Department<br>Notification</h3>
    <p class="pp-c"><b>The 29th July 1967</b></p>
    <p class="pp-sm pp-j">No. SO (SR) T 1541-I. In exercise of the powers conferred by clause (2) of Article 179 of the Constitution of the Islamic Republic of Pakistan, the Governor of West Pakistan is pleased to direct that to the West Pakistan Civil Services Pension Rules 1963 the following amendment shall be made namely:</p>
    <h3>Amendment</h3>
    <p class="pp-c pp-b">For the existing Pension Application Form 3 (Pen.) the attached new Form 3 (Pen.) shall be substituted.</p>
    <p class="pp-r"><b>By order of the Government of West Pakistan<br>A.S. QURESHI, Deputy Secretary (Regulation)<br>Government of West Pakistan, Finance Department</b></p>
    <p class="pp-sm pp-j"><b>SO (SR) V. 1514/67, Dated Lahore the 29th July 1967.</b> Copies are forwarded for information to: (1) All Heads of Departments and the Registrar, High Court of West Pakistan. (2) All District and Session Judges and Political Agents West Pakistan. (3) The Accountant General West Pakistan Lahore. (4) The Comptroller, Northern Area, West Pakistan Peshawar. (5) The Comptroller, Southern Area, West Pakistan Karachi. (6) The Director Audit and Accounts (Works) West Pakistan Lahore and (7) The Comptroller and Auditor General of Pakistan Lahore.</p>
    <p class="pp-r"><b>MIRZA RAHMATULLAH, Section Officer SR – Government of West Pakistan, Finance Department</b></p>
    <p class="pp-sm pp-j"><b>SO (SR) V. 1514/67, Dated Lahore the 29th July 1967.</b> Copies are forwarded for information to: (1) All Administrative Secretaries to Government of West Pakistan. (2) The Financial Advisor, Ghulam Muhammad Barrage Project Hyderabad. (3) All Section Officers in Finance Department. (4) Private Secretaries to Ministers, and (5) Private Secretaries to Chief Secretary, Additional Chief Secretary and Finance Secretary.</p>
    <p class="pp-r"><b>MIRZA RAHMATULLAH, Section Officer SR – Government of West Pakistan, Finance Department</b></p>
    <p class="pp-sm pp-j"><b>SO (SR) V. 1514/67, Dated Lahore the 29th July 1967.</b> Copies are forwarded to all Heads of Autonomous and Semi-Autonomous Bodies in West Pakistan for information.</p>
    <p class="pp-r"><b>MIRZA RAHMATULLAH, Section Officer SR – Government of West Pakistan, Finance Department</b></p>
  `);

  // ── PAGE 4: FORM 3 (PEN.) PART I ────────────────────────────────────
  pages.push(`
    <p class="pp-r"><b>Page – 3</b></p>
    <h3>First Page<br>Form 3 (Pen.) – Part I<br>Application for Pension and Commutation</h3>
    <p class="pp-c pp-sm"><i>(To be filled in and signed by the applicant himself)</i></p>
    <p><b>To,</b><br>&nbsp;&nbsp;&nbsp;The ${fu('office', 80)}<br>&nbsp;&nbsp;&nbsp;${fu('ddoPlace', 80)}</p>
    <p><b>Sir,</b></p>
    <p class="pp-j">1. I have the honour to say that I have been permitted to retire / have retired from Government service with effect from ${dr} (Date). I, therefore, request that the pension admissible under the rules may kindly be sanctioned to me.</p>
    <p class="pp-j">2. I declare that I have neither applied for nor received any pension or commutation for any portion of this service, nor shall I submit any application hereafter without quoting a reference to this application and to the orders which may be passed on it.</p>
    <p class="pp-j">3. Should the amount of the pension and/or commutation granted to me be afterwards found to be in excess of that to which I am entitled under the rules, I hereby undertake to refund any such excess.</p>
    <p class="pp-j">4. I wish to draw my pension from the Government at District Accounts Officer ${fu('pplace', 44)} (Place) / Sub-Treasury.</p>
    <p>5. The following documents, duly attested, are enclosed:</p>
    <div class="pp-ix">
      (I) Three specimen signatures of mine.<br>
      (II) Three photographs of mine.<br>
      (III) Two sets of my thumb and finger impressions on the prescribed form.
    </div>
    <table style="margin-top:8mm">
      <tr>
        <td class="l" style="width:36%;vertical-align:top"><b>Dated:</b> ${f('dapp', 24)}</td>
        <td class="l">
          <b>Yours obedient servant,</b>
          <div style="height:15mm;border-bottom:1px solid #000"></div>
          (Signature)<br>
          Name: ${N}<br>
          ${esc(rel)} ${fu('father', 44)}<br>
          Post held on date of retirement: ${ds}<br>
          Postal Address: ${fu('addr', 56)}
        </td>
      </tr>
    </table>
  `);

  // ── PAGE 5: FORM 3 (PEN.) PART II — SECTION (I) ─────────────────────
  pages.push(`
    <div class="pp-compact">
      <p class="pp-r"><b>Page – 4</b></p>
      <h3>Second Page · Part – II</h3>
      <p class="pp-c pp-sm"><i>(To be completed by office / department receiving the application for pension)</i></p>
      <h4>Section (I)</h4>
      ${ln('1. Name of applicant*', N)}
      ${ln('2. Father’s / Husband’s Name*', fu('father', 56))}
      ${ln('3. Nationality*', fu('nat', 38))}
      ${ln('4. Post held on the date of retirement', ds)}
      ${ln('5. Postal Address*', fu('addr', 80))}
      ${ln('6. Date of birth of the applicant', f('dob', 28))}
      ${ln('7. Height', f('height', 28))}
      ${ln('8. Marks of identification', f('marks', 64))}
      ${ln('9. N.I.C No:', f('cnic', 36))}
      <p><b>10. Date of</b> – Joining: ${f('doj', 22)} &nbsp; Retirement: ${dr} &nbsp; Application: ${f('dapp', 22)}</p>
      ${ln('11. Length of service including interruptions', v(formatYMD(c.T), 44))}
      ${ln('&nbsp;&nbsp;&nbsp;&nbsp;Of this, non-qualifying service and interruption is', v(c.nq ? formatYMD(fromDays360(c.nq)) : 'NIL', 44))}
      <p><b>12.</b> Date of commencement and ending of each spell of military service, if any</p>
      <table>
        <tr><th>From</th><th>To</th><th>Y</th><th>M</th><th>D</th></tr>
        ${[0, 1]
          .map((i) => {
            const a = diffYMD(g(`m${i}f`), g(`m${i}t`));
            return `<tr><td>${esc(g(`m${i}f`))}</td><td>${esc(g(`m${i}t`))}</td>${yc(a)}</tr>`;
          })
          .join('')}
        <tr><td colspan="2"><b>Total</b></td>${yc(c.ml ? fromDays360(c.ml) : null)}</tr>
      </table>
      <p><b>13.</b> Government under which service has been rendered in chronological order</p>
      <table>
        <tr><th>Government</th><th>From</th><th>To</th><th>Y</th><th>M</th><th>D</th></tr>
        ${[0, 1, 2]
          .map((i) => {
            const a = diffYMD(g(`g${i}f`), g(`g${i}t`));
            return `<tr><td class="l">Government of ${esc(U(`g${i}n`))}</td><td>${esc(
              g(`g${i}f`)
            )}</td><td>${esc(g(`g${i}t`))}</td>${yc(a)}</tr>`;
          })
          .join('')}
        <tr><td colspan="3"><b>Total</b></td>${yc(c.gv ? fromDays360(c.gv) : null)}</tr>
      </table>
      ${ln('14. Class of pension or commutation applied for', fu('cls', 52))}
      ${ln('15. (Average) emoluments', v(c.avg ? 'Rs. ' + formatMoney(c.avg) : '', 36))}
      ${ln('16. Proposed ordinary pension', v(c.netO ? 'Rs. ' + formatMoney(c.netO) + ' p.m.' : '', 36))}
      ${ln('17. Proposed special additional pension, if any', v(c.nsp ? 'Rs. ' + formatMoney(c.nsp) + ' p.m.' : 'NIL', 36))}
      ${ln('18. Proposed commutation*', v(c.lump ? 'RS. ' + formatMoney(c.lump) : '', 36))}
      ${ln('19. Place of payment', fu('pplace', 46))}
      ${ln('20. Date from which pension is to commence', v(c.from, 32))}
      <p>Office: ${fu('office', 58)}</p>
      ${sg('Signature of Head of Department')}
      <p class="pp-footnote pp-cl">* Entries Nos. 1, 2, 3, 5 and 18 should be made in capital letters. ** Not required in the case of Gazetted Officers. *** If the application is for a compensation pension or commutation, the nature of change of establishment which has given rise to the claim, should be fully stated.</p>
    </div>
  `);

  // ── PAGE 6: SECTION (2) QUALIFYING SERVICE & SECTION (3) ORDINARY PENSION ──
  const nqLabels = [
    '(I) Service rendered below the age of 18 years.',
    '(II) Extraordinary Leave.',
    '(III) Suspension not treated as duty / leave.',
    '(IV) Period of breaks in service.',
    '(V) Service rendered before break if break is not condoned.',
    '(VI) Service forfeited by resignation.',
    '(VII) Unauthorized absence.',
  ];
  const nRows =
    `<tr><td class="l"><b>Total length of service including interruptions</b></td><td>${esc(
      g('doj')
    )}</td><td>${esc(g('dor'))}</td>${yc(c.T)}</tr>` +
    `<tr><td class="l" colspan="6"><b>Non-qualifying service:-</b></td></tr>` +
    rowT('n', 7, nqLabels);

  pages.push(`
    <div class="pp-compact">
      <p class="pp-r"><b>Third Page · Page – 5</b></p>
      <h4>Section (2) – Calculation of Qualifying Service</h4>
      <table>
        <tr><th rowspan="2">Particulars</th><th colspan="2">Period</th><th rowspan="2">Y</th><th rowspan="2">M</th><th rowspan="2">D</th></tr>
        <tr><th>From</th><th>To</th></tr>
        ${nRows}
        <tr><td class="l" colspan="3"><b>Total (non-qualifying)</b></td>${yc(c.nq ? fromDays360(c.nq) : null)}</tr>
        <tr><td class="l" colspan="3"><b>Net qualifying service</b></td>${yc(c.T ? fromDays360(c.net) : null)}</tr>
        <tr><td class="l" colspan="6"><b>Add</b></td></tr>
        <tr><td class="l">(i) Period of Military / War Service allowed to count for pension</td><td></td><td></td>${yc(
          c.ml ? fromDays360(c.ml) : null
        )}</tr>
        ${rowT('a', 2, [
          '(ii) Benefit of condonation of deficiency in service',
          '(iii) Any other addition to qualifying service',
        ])}
        <tr><td class="l" colspan="3"><b>Total (additions)</b></td>${yc(
          c.ml + c.ad ? fromDays360(c.ml + c.ad) : null
        )}</tr>
        <tr><td class="l" colspan="3"><b>TOTAL QUALIFYING SERVICE</b></td>${yc(
          c.T ? fromDays360(c.tq) : null
        )}</tr>
      </table>

      <h4>Section (3) – Calculation of Ordinary Pension</h4>
      <table>
        <tr><th>Period</th><th>Duration (M &amp; D)</th><th>Monthly Emoluments</th><th>Amount Drawn</th></tr>
        ${c.pr
          .map(
            (r, i) =>
              `<tr><td>${esc(g(`p${i}f`))}${
                g(`p${i}t`) ? ' to ' + esc(g(`p${i}t`)) : ''
              }</td><td>${
                r.x ? `${r.x[0] * 12 + r.x[1]} M ${r.x[2]} D` : ''
              }</td><td>${formatMoney(r.rt)}</td><td>${formatMoney(r.am)}</td></tr>`
          )
          .join('')}
        <tr>
          <td><b>Total</b></td>
          <td><b>${c.pm ? `${Math.floor(c.pm)} M` : ''}</b></td>
          <td><b>${c.avg ? `Avg ${formatMoney(c.avg)}` : ''}</b></td>
          <td><b>${formatMoney(c.ps)}</b></td>
        </tr>
      </table>
      <p><b>Gross Pension*</b> = Rs. ${v(
        formatMoney(c.gross),
        28
      )} &nbsp;<span class="pp-sm">(Avg emoluments × 7/300 × ${
    c.T ? `${Number(c.completedYearsForPension.toFixed(2))} yrs` : 'qualifying yrs'
  }, max 30)</span></p>
      <p><b>Amount of net ordinary pension (${100 - (+g('pct') || 0)}%)</b> = Rs. ${v(
        formatMoney(c.netO),
        28
      )} per month</p>
      <p class="pp-footnote">* Please see Rule 4.4 (2) West Pakistan Civil Services Pension Rules.</p>
    </div>
  `);

  // ── PAGE 7: SECTION (4) SPECIAL PENSION & SECTION (5) COMMUTATION ──
  pages.push(`
    <p class="pp-r"><b>Fourth Page · Page – 6</b></p>
    <h4>Section (4) – Calculation of Special Additional Pension</h4>
    ${(
      [
        ['*', 'III', 'ya', 'A'],
        ['**', 'II', 'yb', 'B'],
        ['***', 'I', 'yc', 'C'],
      ] as const
    )
      .map((a) =>
        ln(
          `No. of completed years of effective service in ${a[0]} Grade ${a[1]}`,
          `${v(g(a[2]), 18)} years (${a[3].toLowerCase()})`
        )
      )
      .join('')}
    ${ln(
      `Amount of special additional pension in Grade III (A×${esc(g('ra'))} subject to max Rs. ${esc(
        g('xa')
      )})`,
      `${v(c.sa ? 'Rs. ' + formatMoney(c.sa) : '', 24)} per month`
    )}
    ${ln(
      `Amount of special additional pension in Grade II (B×${esc(g('rb'))} subject to max Rs. ${esc(
        g('xb')
      )})`,
      `${v(c.sb ? 'Rs. ' + formatMoney(c.sb) : '', 24)} per month`
    )}
    ${ln(
      `Amount of special additional pension in Grade I (C×${esc(g('rc'))} subject to max Rs. ${esc(
        g('xc')
      )})`,
      `${v(c.sc ? 'Rs. ' + formatMoney(c.sc) : '', 24)} per month`
    )}
    ${ln(
      'Total special additional pension admissible after applying prescribed maximum',
      `${v(c.sp ? 'Rs. ' + formatMoney(c.sp) : '', 24)} per month`
    )}
    ${ln(
      'Less 1/4th (if the applicant comes under the Pension Commutation scheme)',
      `${v(c.q ? 'Rs. ' + formatMoney(c.q) : '', 24)} per month`
    )}
    ${ln(
      '<b>Amount of net special additional pension</b>',
      `${v(c.nsp ? 'Rs. ' + formatMoney(c.nsp) : '', 24)} per month`
    )}
    <p class="pp-footnote">* Officers drawing pay above Rs. 3,000 up to Rs. 3,250 p.m.: Rs. 25 p.m./yr. ** Above Rs. 3,250: Rs. 45 p.m./yr. *** Above Rs. 3,500: Rs. 45 p.m./yr. Combined maximum of Grades III &amp; I: Rs. 225 / 350 p.m.</p>

    <h4>Total Net Pension</h4>
    ${ln('Amount of net ordinary pension', `${v(formatMoney(c.netO), 28)} Rs.`)}
    ${ln('Amount of net special additional pension', `${v(formatMoney(c.nsp), 28)} Rs.`)}
    ${ln('<b>Amount of total net pension</b>', `${v(formatMoney(c.tn), 28)} <b>Rs.</b>`)}

    <h4>Section (5) – Calculation of Commutation</h4>
    ${ln('Amount of ordinary pension surrendered [See Section (3)]', `${v(formatMoney(c.surO), 28)} Rs.`)}
    ${ln('Amount of special additional pension surrendered [See Section (4)]', `${v(formatMoney(c.q), 28)} Rs.`)}
    ${ln('<b>Total amount surrendered</b>', `${v(formatMoney(c.sur), 28)} <b>Rs.</b>`)}
    ${ln('Age (next birthday)', `${v(c.age ?? '', 20)} years`)}
    ${ln('Rate of commutation for every rupee surrendered', `${v(c.rate ? c.rate.toFixed(4) : '', 28)} Rs.`)}
    ${ln('<b>Lump sum commutation</b> (surrendered × 12 × rate)', `${v(formatMoney(c.lump), 28)} <b>Rs.</b>`)}
  `);

  // ── PAGE 8: SECTION (6) REMARKS & SECTION (7) ORDERS ────────────────
  pages.push(`
    <div class="pp-compact">
      <p class="pp-r"><b>Fifth Page · Page – 7</b></p>
      <h4>Section (6) – Remarks by Head of Office / Department</h4>
      <p class="pp-sm"><i>To be completed only after receiving the pension application</i></p>
      ${[
        '1. Character and past conduct of the applicant.',
        '2. Remarks regarding any commutation of pension received by the applicant (See Chapter IX of West Pakistan Civil Services Pension Rules).',
        '3. Specific remarks as to whether the service claimed is established and whether it should be admitted for pension or not (See Rule 5.3 (2)).',
        '4. Remarks as to Special Additional Pension, stating whether service rendered in Grade III / II / I satisfies the required standard of work and conduct.',
        '5. Any other remarks.',
      ]
        .map((t) => `<p>${t}</p><div style="border-bottom:1px dotted #000;height:5mm"></div>`)
        .join('')}
      ${sg('Signature of the<br>Head of the Dept / Office')}

      <h4>Section (7) – Orders of the Sanctioning Authority</h4>
      <p class="pp-sm"><i>Applicable only in the case of officers eligible for special additional pension</i></p>
      <div class="pp-bx">1. The undersigned is satisfied that the service of ${fu('name', 46)} has been wholly satisfactory. The grant of full pension and/or commutation which the Audit Officer may find to be admissible under the rules is hereby sanctioned. <i class="pp-sm">(Cross out with initials if full pension is not granted.)</i></div>
      <p class="pp-c"><b>OR</b></p>
      <div class="pp-bx">The undersigned is satisfied that the service of ${v('', 42)} has not been wholly satisfactory and it has been decided that the full pension and/or commutation be reduced by: pension ${v('', 22)}; commutation ${v('', 22)}. Sanction is hereby accorded to the grant of pension and/or commutation as so reduced.</div>
      <p>2. Approved periods of service for special additional pension:<br>
      Grade III – Period ${v('', 36)} Post(s) held ${v('', 42)}<br>
      Grade II &nbsp;– Period ${v('', 36)} Post(s) held ${v('', 42)}<br>
      Grade I &nbsp;&nbsp;– Period ${v('', 36)} Post(s) held ${v('', 42)}</p>
      <p class="pp-footnote pp-j">3. Payment of pension and/or commutation may commence from ${v(
        c.from,
        24
      )}. Before issuing P.P.O., the Audit Officer may ascertain receipt of the “No Demand Certificate” or written consent for recovery of any outstanding dues.</p>
      ${sg('Sanctioning Authority')}
    </div>
  `);

  // ── PAGE 9: PAGE 8 — ACCOUNTANT GENERAL'S / COMPTROLLER'S AUDIT ─────
  const allocRows = [0, 1, 2]
    .map((i) => `<tr><td class="l">Government of ${esc(U(`g${i}n`))}</td><td></td><td></td></tr>`)
    .join('');

  pages.push(`
    <div class="pp-compact">
      <p class="pp-r"><b>Sixth Page · Page – 8</b></p>
      <h3>Part – II<br>Accountant General’s / Comptroller’s Office</h3>
      <p class="pp-c">(For and in the ${v('', 44)} office)</p>
      <p>(I) The calculations contained in the preceding pages have been checked.</p>
      <p>(II) Length of qualifying service in Audit: ${v(c.tq ? formatYMD(fromDays360(c.tq)) : '', 46)}</p>
      <p>(III) Reasons for difference, if any, with length worked out by Department: ${v('', 56)}</p>
      <p>(IV) Amount of ordinary net pension: Rs. ${v(formatMoney(c.netO), 28)} per month</p>
      <p>(V) Reasons for discrepancy, if any: ${v('', 76)}</p>
      <p>(VI) Length of effective service: Grade III ${v(g('ya'), 12)} Yrs &nbsp; Grade II ${v(g('yb'), 12)} Yrs &nbsp; Grade I ${v(g('yc'), 12)} Yrs</p>
      <p>(VII) Amount of special additional pension: Rs. ${v(formatMoney(c.nsp), 28)}</p>
      <p>(VIII) Reasons for discrepancy, if any: ${v('', 74)}</p>
      <p>(IX) Amount of lump sum commutation: Rs. ${v(formatMoney(c.lump), 28)}</p>
      <p>(X) Reasons for discrepancy, if any: ${v('', 74)}</p>
      <p>(XI) The pension will commence from: ${v(c.from, 28)}</p>
      <p>(XII) Allocation of the pension and commutation:-</p>
      <table>
        <tr><th>Government</th><th>Pension (Rs.)</th><th>Commutation (Rs.)</th></tr>
        ${allocRows}
        <tr><td class="l"><b>Total Rs.</b></td><td><b>${formatMoney(c.netO)}</b></td><td><b>${formatMoney(c.lump)}</b></td></tr>
      </table>
      <p>(XIII) Anticipatory pension of Rs. ${v('', 18)} (Rupees ${v('', 40)}) per month granted w.e.f. ${v('', 20)} vide P.P.O No. ${v('', 20)} Dated ${v('', 20)}. To be adjusted on final P.P.O.</p>
      <p>(XIV) Amount of original pension commuted: Rs. ${v(formatMoney(c.surO), 28)}</p>
      <p>1. Checked with LPC and No Demand Certificate / written consent vide Para 3 of Section (7) Part II.<br>
      2. P.P.O. issued vide No. ${v(g('ppo'), 32)} Dated ${v('', 28)}</p>
      <div class="pp-dual-sig">
        <div class="pp-sg-col"><i></i>Assistant Accounts Officer</div>
        <div class="pp-sg-col"><i></i>Assistant Accountant-General</div>
      </div>
    </div>
  `);

  // ── PAGE 10: 4 D.D.O / HOD CERTIFICATES (SET I) ─────────────────────
  const withCaste = `${W}, Surname / Caste ${fu('caste', 24)}, Designation ${ds}`;
  pages.push(`
    <div class="pp-certs">
      ${cert(
        'Bonafide Certificate',
        `<p>This is to certify that ${W}, by caste ${fu('caste', 26)}, Designation ${ds}, was a bonafide Government servant of the ${fu('dept', 42)} Department w.e.f. ${f('doj', 24)} to ${dr}. ${subjPronoun} bears good moral character.</p>${sg(
          'Signature &amp; Stamp of<br>HEAD OF DEPARTMENT'
        )}`
      )}
      ${cert(
        'No Enquiry Certificate',
        `<p>This is to certify that there is no Departmental / Anti-Corruption enquiry lying pending against ${withCaste}, ${ret}.</p>${sg(
          'D.D.O with Office Stamp'
        )}`
      )}
      ${cert(
        'No Advance &amp; No Dues Certificate',
        `<p>This is to certify that there is no advance or Government dues such as House Purchase / House Repair / Motor Cycle etc. outstanding against ${own}, ${ret}. This certificate is issued without advance salaries of Bank.</p>${sg(
          'D.D.O with Office Stamp'
        )}`
      )}
      ${cert(
        'No Demand &amp; No Irregularity Certificate',
        `<p>This is to certify that there is no demand and no irregularity has been committed by ${own}, ${ret}.</p>${sg(
          'D.D.O with Office Stamp'
        )}`
      )}
    </div>
  `);

  // ── PAGE 11: 4 D.D.O / HOD CERTIFICATES (SET II) ────────────────────
  pages.push(`
    <div class="pp-certs">
      ${cert(
        'No Court / Fake Advance Case Certificate',
        `<p>This is to certify that there is no Court case / House purchase (fake) advance case lying pending or in process in respect of ${withCaste}, ${ret}.</p>${sg(
          'D.D.O with Office Stamp'
        )}`
      )}
      ${cert(
        'No Recovery / PAC / DAC Certificate',
        `<p>This is to certify that ${withCaste}, has no recovery of Government / non-Government dues under the order of court, direction of Public Accounts Committee, Departmental proceeding, DAC or draft / audit para outstanding against ${objPronoun}.</p>${sg(
          'D.D.O with Office Stamp'
        )}`
      )}
      ${cert(
        'No Audit Objection Certificate',
        `<p>This is to certify that there is no audit objection against ${own}, ${ret}, and all service papers of the employee are clear.</p>${sg(
          'D.D.O with Office Stamp'
        )}`
      )}
      ${cert(
        'Embezzlement Certificate',
        `<p>Certified that there is no embezzlement case lying pending or in process in respect of Government employee ${W}, Post ${ds}, ${ret}.</p>${sg(
          'HEAD OF THE DEPARTMENT<br>WITH OFFICIAL SEAL'
        )}`
      )}
    </div>
  `);

  // ── PAGE 12: GOVERNMENT OF SINDH CONSOLIDATED CERTIFICATE + OPTION + UNDERTAKING ──
  const sd = `${esc(rel)} ${fu('father', 46)}`;
  pages.push(`
    <div class="pp-compact">
      <h3>Government of Sindh<br><span style="font-weight:400">Department: ${fu('dept', 56)}</span></h3>
      <h3>Certificate</h3>
      <p><b>A)</b> The service rendered by Mr./Miss/Mst. ${N} ${sd} was pensionable, and ${subjPronoun.toLowerCase()} is a bonafide employee of this department.</p>
      <p><b>B)</b> There is no interruption of any kind in the service of ${N} ${sd} (except as shown in the documents attached).</p>
      <p><b>C)</b> No audit para is outstanding against ${N} ${sd}.</p>
      <p><b>D)</b> No enquiry is pending against ${N} ${sd}, and ${subjPronoun.toLowerCase()} has not received pension or commutation before this nor faced any disciplinary proceeding in ${isFemale ? 'her' : 'his'} service career.</p>
      <p><b>E)</b> ${N} ${sd} was not in receipt of any previous pension or commutation.</p>
      <p><b>F)</b> ${N} ${sd} has not received anticipatory pension.</p>
      <p><b>G)</b> It is certified that the service of ${N} ${sd} has been verified w.e.f. ${f('doj', 24)} to ${dr} with reference to the pay bills and local records; the service record is found correct.</p>
      <p><b>Certified that the above information is correct &amp; all documents have been verified &amp; duly attested.</b></p>
      ${sg('HEAD OF THE DEPARTMENT<br>WITH OFFICIAL SEAL')}
      <h3 style="margin-top:4mm">Option</h3>
      <p>I do hereby opt for commutation at the rate of ${v(`${g('pct') || '35'} %`, 14)} from my gross pension.</p>
      <table><tr><td class="l" style="height:13mm;vertical-align:bottom;width:50%">Before me</td><td style="vertical-align:bottom">Signature of Pensioner</td></tr></table>
      <h3>Undertaking</h3>
      <p>I do hereby undertake to abide by the rules &amp; regulations of this pension &amp; commutation; if any excess amount is paid I shall refund the same without any objection.</p>
      <table><tr><td class="l" style="height:13mm;vertical-align:bottom;width:50%">Before me</td><td style="vertical-align:bottom">Signature of Pensioner</td></tr></table>
    </div>
  `);

  // ── PAGE 13: DDO COMMUTATION PAYMENT CERTIFICATE + RATE TABLE ───────
  const orderCombined =
    g('orderNo') || g('orderDate')
      ? `${U('orderNo')}${g('orderNo') && g('orderDate') ? ' DT. ' : ''}${g('orderDate')}`
      : '';

  pages.push(`
    <div class="pp-compact">
      <h4 class="pp-c" style="text-decoration:underline">CERTIFICATE REGARDING PAYMENT OF COMMUTATION BY THE D.D.O IN LIGHT OF INSTRUCTION NO. 62-AC 11/6-54/2001 DATED 08-05-2001 ISSUED BY THE CONTROLLER GENERAL ACCOUNTS ISLAMABAD COMMUNICATED BY AG SINDH KARACHI NO. PNI/CENSES/253 DATED 21-05-2001.</h4>
      <p class="pp-j" style="line-height:1.65">Certified that an amount of commutation of Rs. ${v(
        formatMoney(c.lump),
        26
      )} (in words Rupees ${v(
        c.lumpWords,
        66
      )}) in favour of ${W}, by caste ${fu('caste', 26)}, Designation ${ds}, ${esc(
    kind
  )} from service of Dept: ${fu('dept', 40)} w.e.f. ${dr} under Order No. &amp; Date ${v(
    orderCombined,
    38
  )} issued by ${v(U('sanctionAuth'), 42)} as per sanction by the Accountant General Sindh Karachi under Authority No. ${v(
    g('authNo'),
    24
  )} vide P.P.O No. ${v(g('ppo'), 24)} shall be credited in Account No. ${f('acct', 44)} in ${f(
    'bank',
    46
  )} and paid to the above named pensioner through crossed cheque / direct credit, and further certified that such payment cannot be utilized for any other purpose.</p>
      <p>2. Moreover, there is no irregularity committed by any official of the department.</p>
      ${sg('Signature &amp; Name of D.D.O')}

      <h3 class="pp-cl" style="margin-top:4mm">Pension &amp; Commutation Rates (Age 28–60)</h3>
      <table class="pp-rates">
        <tr><th>Age next birthday</th><th>Years purchase</th><th>Age next birthday</th><th>Years purchase</th></tr>
        ${Array.from({ length: 17 }, (_, i) => {
          const leftAge = 28 + i;
          const rightAge = i < 16 ? 45 + i : null;
          const leftHighlight = c.age === leftAge ? ' class="pp-hl"' : '';
          const rightHighlight = rightAge !== null && c.age === rightAge ? ' class="pp-hl"' : '';
          return `<tr>
            <td${leftHighlight}>${leftAge}</td>
            <td${leftHighlight}>${COMMUTATION_RATES[i].toFixed(4)}</td>
            <td${rightHighlight}>${rightAge ?? ''}</td>
            <td${rightHighlight}>${rightAge !== null ? COMMUTATION_RATES[17 + i].toFixed(4) : ''}</td>
          </tr>`;
        }).join('')}
      </table>
      <p class="pp-footnote"><b>Documents to be attached:</b> (1) Undertaking certificate &amp; affidavit on stamp paper Rs. 20. (2) Three passport size photographs of pensioner duly attested and Pay Roll / LPC.</p>
    </div>
  `);

  // ── PAGE 14: DESCRIPTIVE ROLL & THUMB/FINGER IMPRESSIONS ────────────
  const thumbTable = `<table>
    <tr>${['Little Finger', 'Ring Finger', 'Middle Finger', 'Index Finger', 'Thumb']
      .map((x) => `<th>(${x})</th>`)
      .join('')}</tr>
    <tr><td style="height:25mm"></td><td></td><td></td><td></td><td></td></tr>
  </table>`;

  pages.push(`
    <h3>Descriptive Roll &amp; History of Pensioner</h3>
    <div style="display:flex;align-items:flex-start;gap:5mm;margin-top:2mm">
      <div style="flex:1;min-width:0">
        ${ln('1. Mr./Mst./Miss:', v(nm, 42))}
        ${ln('2. Father’s / Husband’s Name:', fu('father', 42))}
        ${ln('3. N.I.C No:', f('cnic', 34))}
        ${ln('4. Date of Birth:', f('dob', 26))}
        ${ln('5. Height:', f('height', 26))}
        ${ln('6. Marks of identification:', f('marks', 44))}
      </div>
      <div style="width:35mm;height:44mm;border:1.2px solid #000;flex-shrink:0;display:flex;align-items:center;justify-content:center;text-align:center;font-size:8.5pt;line-height:1.3;padding:2mm">
        Affix Attested<br>Passport Size<br>Photograph
      </div>
    </div>
    ${ln('7. Address:', fu('addr', 82))}
    <p><b>Account / IBAN No:</b> ${f('acct', 46)} &nbsp; <b>Name of Bank:</b> ${f('bank', 46)}</p>
    <p><b>SPECIMEN SIGNATURES OF PENSIONER</b></p>
    <div style="display:flex;gap:8px;margin-bottom:4mm">
      ${[1, 2, 3]
        .map((i) => `<div style="flex:1;border:1px solid #000;height:16mm;padding:2px 4px">${i})</div>`)
        .join('')}
    </div>
    <h4>Left and Right Hands Thumb and Finger Impressions:</h4>
    <p><b>Left Hand</b></p>
    ${thumbTable}
    <p><b>Right Hand</b></p>
    ${thumbTable}
    ${endDdo}
  `);

  // ── PAGE 15: A.T.C.5 LAST-PAY CERTIFICATE (FRONT) ──────────────────
  const ld = (...t: string[]) =>
    `<div class="pp-ln">${t
      .map((x) => (x ? `<span>${x}</span>` : '<span class="pp-dot">&nbsp;</span>'))
      .join('')}</div>`;

  const dl = (a: string, b: string) =>
    `<div class="pp-ln"><span>${a}</span><span class="pp-dot pp-val">${b || '&nbsp;'}</span></div>`;

  const lpR = (a = '', b = '') =>
    `<tr><td class="l">${a || '&nbsp;'}</td><td style="width:35%">${b}</td></tr>`;

  const fl = (q: number) =>
    Array.from({ length: q }, () => ld('From', '', 'to', '', 'at Rs.', '', 'a month')).join('');

  const paidUpTo = g('paidUpTo') || g('dor');
  const chargeHalf = g('chargeHalf') || 'Afternoon';

  pages.push(`
    <div class="pp-compact">
      <p class="pp-c"><b>A.T.C.5</b><br><i>(See Para (5) of Annex A to Chap. 2 of Section IV Audit Code)</i></p>
      <h3>Last-Pay Certificate</h3>
      ${dl('Last pay certificate of', esc(nm))}
      ${dl('Of the', esc(U('office')))}
      ${dl('Proceeding on', `${esc(kind.toUpperCase())} w.e.f. ${esc(g('dor'))}`)}
      <p>2.&nbsp; ${subjPronoun} has been paid up to ${v(paidUpTo, 30)} at the following rates:</p>
      <table class="pp-lp">
        <tr><th>Particulars</th><th style="width:35%">Rate (Rs.)</th></tr>
        ${lpR('Substantive / Basic Pay', formatMoney(+g('lastpay')))}
        ${lpR('Officiating Pay')}
        ${lpR('Exchange Compensation Allowance')}
        ${lpR()}
        <tr><th>Deductions</th><th></th></tr>
        ${lpR('G.P. Fund / Benevolent Fund / Group Insurance')}
        ${lpR('Income Tax / Other Recoveries')}
        ${lpR()}
      </table>
      <p>3.&nbsp; ${subjPronoun} made over charge of the office on the ${v(chargeHalf.toUpperCase(), 24)} of ${v(g('dor'), 28)}.</p>
      <p>4.&nbsp; Recoveries are to be made from the pay of the Government servant as detailed on the reverse.</p>
      <table>
        <tr><th>Period</th><th>Rate</th><th>Amount</th></tr>
        <tr><td>&nbsp;</td><td></td><td></td></tr>
        <tr><td>&nbsp;</td><td></td><td></td></tr>
      </table>
      <p>6.&nbsp; ${subjPronoun} is entitled to draw the following:-</p>
      ${fl(3)}
      <p>7.&nbsp; ${subjPronoun} is also entitled to joining time for ${v('', 16)} Days.</p>
      <p>8.&nbsp; Details of income tax recovered up to date from the beginning of the current financial year are noted on the reverse.</p>
      ${dl('Dated / Cited', esc(g('dapp')))}
      ${sg('(Signature &amp; Designation of D.D.O)')}
      <p class="pp-cl pp-r"><b>(P.T.O)</b></p>
    </div>
  `);

  // ── PAGE 16: A.T.C.5 LAST-PAY CERTIFICATE (REVERSE) ────────────────
  const dorDate = parseDateStr(g('dor'));
  const fy = dorDate
    ? dorDate.getUTCMonth() >= 3
      ? dorDate.getUTCFullYear()
      : dorDate.getUTCFullYear() - 1
    : 0;
  const fyMonths = [
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
    'January',
    'February',
    'March',
  ];

  pages.push(`
    <div class="pp-compact">
      <h3>Reverse (A.T.C.5)</h3>
      ${dl('Nature of recovery', '')}
      ${dl('Amount Rs.', '')}
      <p>To be recovered in ${v('', 20)} Instalments.</p>
      <p><b><i>Deduction made from leave salary</i></b></p>
      ${[0, 1, 2]
        .map(() => ld('From', '', 'to', '', 'on account of', '', 'Rs.', ''))
        .join('')}
      <table style="margin-top:4mm">
        <tr>
          <th>Name of Month</th>
          <th>Pay</th>
          <th>Commutation Fee etc.</th>
          <th>Funds &amp; Other Deductions</th>
          <th>Income Tax Recovered</th>
          <th>Remarks</th>
        </tr>
        ${fyMonths
          .map(
            (m, i) =>
              `<tr><td class="l" style="height:10mm"><b>${m} ${
                fy ? (i < 9 ? fy : fy + 1) : '20–'
              }</b></td><td></td><td></td><td></td><td></td><td></td></tr>`
          )
          .join('')}
      </table>
    </div>
  `);

  return pages;
}
