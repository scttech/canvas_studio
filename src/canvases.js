// Canvas definitions. Each canvas is pure data: a grid and the sections placed on it.
// One generic parser/renderer serves every canvas type, so adding a canvas = adding an entry here.

export const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');

// S(key, title, hint, col, row, colSpan, rowSpan, extra) - col/row are 1-based grid positions.
const S = (key, title, hint, col, row, w, h, extra = {}) => ({
  key, title, hint, col, row, w, h, aliases: [], ...extra,
});

export const CANVASES = [
  {
    id: 'lean',
    tag: 'lean',
    name: 'Lean Canvas',
    blurb: "Ash Maurya's one-page plan for startups: focus on problems, solutions, and key metrics.",
    cols: 10,
    rows: [1.5, 1, 0.9],
    aspect: 0.74,
    sections: [
      S('problem', 'Problem', 'Top 1-3 problems your customers have', 1, 1, 2, 1, { num: 1, aliases: ['problems'], tone: 'red' }),
      S('alternatives', 'Existing Alternatives', 'How are these problems solved today?', 1, 2, 2, 1, { sub: true, aliases: ['existingalternatives'] }),
      S('solution', 'Solution', 'Top 3 features that solve the problems', 3, 1, 2, 1, { num: 4, aliases: ['solutions', 'features'] }),
      S('metrics', 'Key Metrics', 'Key activities you measure', 3, 2, 2, 1, { num: 8, aliases: ['keymetrics', 'kpi', 'kpis'] }),
      S('uvp', 'Unique Value Proposition', 'Single, clear, compelling message that states why you are different and worth buying', 5, 1, 2, 1, { num: 3, aliases: ['valueproposition', 'uniquevalueproposition', 'value'], tone: 'blue' }),
      S('concept', 'High-Level Concept', 'Your X for Y analogy (e.g. YouTube = Flickr for videos)', 5, 2, 2, 1, { sub: true, aliases: ['highlevelconcept'] }),
      S('unfair', 'Unfair Advantage', "Can't be easily copied or bought", 7, 1, 2, 1, { num: 9, aliases: ['unfairadvantage', 'advantage', 'moat'] }),
      S('channels', 'Channels', 'Path to customers', 7, 2, 2, 1, { num: 5, aliases: ['channel'] }),
      S('segments', 'Customer Segments', 'Target customers and users', 9, 1, 2, 1, { num: 2, aliases: ['customersegments', 'customers', 'customer'], tone: 'green' }),
      S('earlyadopters', 'Early Adopters', 'Characteristics of your ideal first customers', 9, 2, 2, 1, { sub: true, aliases: ['adopters'] }),
      S('costs', 'Cost Structure', 'Customer acquisition, distribution, hosting, people...', 1, 3, 5, 1, { num: 7, aliases: ['coststructure', 'cost'] }),
      S('revenue', 'Revenue Streams', 'Revenue model, lifetime value, revenue, gross margin', 6, 3, 5, 1, { num: 6, aliases: ['revenuestreams', 'revenuestream'] }),
    ],
  },
  {
    id: 'bmc',
    tag: 'bmc',
    name: 'Business Model Canvas',
    blurb: "Osterwalder's nine building blocks for describing how an organization creates, delivers, and captures value.",
    cols: 10,
    rows: [1, 1, 0.65],
    aspect: 0.66,
    sections: [
      S('partners', 'Key Partners', 'Who are your key partners and suppliers?', 1, 1, 2, 2, { aliases: ['keypartners', 'partnerships', 'partner'] }),
      S('activities', 'Key Activities', 'What key activities does your value proposition require?', 3, 1, 2, 1, { aliases: ['keyactivities', 'activity'] }),
      S('resources', 'Key Resources', 'What key resources does your value proposition require?', 3, 2, 2, 1, { aliases: ['keyresources', 'resource'] }),
      S('value', 'Value Propositions', 'What value do you deliver? Which problems do you solve?', 5, 1, 2, 2, { aliases: ['valuepropositions', 'valueproposition', 'vp', 'uvp'], tone: 'blue' }),
      S('relationships', 'Customer Relationships', 'How do you get, keep, and grow customers?', 7, 1, 2, 1, { aliases: ['customerrelationships', 'relationship'] }),
      S('channels', 'Channels', 'How do you reach your customer segments?', 7, 2, 2, 1, { aliases: ['channel'] }),
      S('segments', 'Customer Segments', 'For whom are you creating value?', 9, 1, 2, 2, { aliases: ['customersegments', 'customers', 'customer'], tone: 'green' }),
      S('costs', 'Cost Structure', 'What are the most important costs in your model?', 1, 3, 5, 1, { aliases: ['coststructure', 'cost'], tone: 'red' }),
      S('revenue', 'Revenue Streams', 'For what value are customers willing to pay?', 6, 3, 5, 1, { aliases: ['revenuestreams', 'revenuestream'], tone: 'green' }),
    ],
  },
  {
    id: 'vpc',
    tag: 'vpc',
    name: 'Value Proposition Canvas',
    blurb: 'Match what you offer (Value Map) to what customers need (Customer Profile) to find product-market fit.',
    cols: 12,
    rows: [1, 1, 1],
    aspect: 0.62,
    groups: [
      { title: 'VALUE MAP', col: 1, w: 6 },
      { title: 'CUSTOMER PROFILE', col: 7, w: 6 },
    ],
    sections: [
      S('gaincreators', 'Gain Creators', 'How do you create customer gains?', 1, 1, 3, 1, { aliases: ['gaincreator'], tone: 'green' }),
      S('products', 'Products & Services', 'What do you offer?', 1, 2, 3, 1, { aliases: ['productsandservices', 'product', 'services', 'offer'], tone: 'blue' }),
      S('painrelievers', 'Pain Relievers', 'How do you eliminate or reduce customer pains?', 1, 3, 3, 1, { aliases: ['painreliever'], tone: 'red' }),
      S('gains', 'Gains', 'What outcomes and benefits do customers want?', 7, 1, 3, 1, { aliases: ['customergains', 'gain'], tone: 'green' }),
      S('jobs', 'Customer Jobs', 'What are customers trying to get done?', 7, 2, 3, 1, { aliases: ['customerjobs', 'job', 'jobstobedone'], tone: 'blue' }),
      S('pains', 'Pains', 'What annoys customers or stops them?', 7, 3, 3, 1, { aliases: ['customerpains', 'pain'], tone: 'red' }),
    ].map((s) => ({ ...s, w: 6, col: s.col === 1 ? 1 : 7 })),
  },
  {
    id: 'swot',
    tag: 'swot',
    name: 'SWOT Analysis',
    blurb: 'Strengths, Weaknesses, Opportunities and Threats: a quick strategic snapshot.',
    cols: 2,
    rows: [1, 1],
    aspect: 0.62,
    sections: [
      S('strengths', 'Strengths', 'Internal: what do you do well?', 1, 1, 1, 1, { aliases: ['strength', 's'], tone: 'green' }),
      S('weaknesses', 'Weaknesses', 'Internal: where could you improve?', 2, 1, 1, 1, { aliases: ['weakness', 'w'], tone: 'orange' }),
      S('opportunities', 'Opportunities', 'External: what trends could you exploit?', 1, 2, 1, 1, { aliases: ['opportunity', 'o'], tone: 'blue' }),
      S('threats', 'Threats', 'External: what could hurt you?', 2, 2, 1, 1, { aliases: ['threat', 't'], tone: 'red' }),
    ],
  },
  {
    id: 'empathy',
    tag: 'empathy',
    name: 'Empathy Map',
    blurb: 'Understand a person: what they say, think, do and feel, plus their pains and gains.',
    cols: 2,
    rows: [1, 1, 0.9],
    aspect: 0.72,
    sections: [
      S('says', 'Says', 'What do they say out loud?', 1, 1, 1, 1, { aliases: ['say'], tone: 'blue' }),
      S('thinks', 'Thinks', 'What might they be thinking?', 2, 1, 1, 1, { aliases: ['think'], tone: 'purple' }),
      S('does', 'Does', 'What actions and behaviors do you observe?', 1, 2, 1, 1, { aliases: ['do'], tone: 'green' }),
      S('feels', 'Feels', 'What emotions might they feel?', 2, 2, 1, 1, { aliases: ['feel'], tone: 'orange' }),
      S('pains', 'Pains', 'Fears, frustrations, obstacles', 1, 3, 1, 1, { aliases: ['pain'], tone: 'red' }),
      S('gains', 'Gains', 'Wants, needs, measures of success', 2, 3, 1, 1, { aliases: ['gain'], tone: 'green' }),
    ],
  },
  {
    id: 'roam',
    tag: 'roam',
    name: 'ROAM Risk Board',
    blurb: 'SAFe risk board: sort each risk as Resolved, Owned, Accepted or Mitigated.',
    cols: 2,
    rows: [1, 1],
    aspect: 0.62,
    sections: [
      S('resolved', 'Resolved', 'Risks everyone agrees are no longer a problem', 1, 1, 1, 1, { aliases: ['resolve', 'r'], tone: 'green' }),
      S('owned', 'Owned', 'Risks someone is taking responsibility to resolve', 2, 1, 1, 1, { aliases: ['own', 'o'], tone: 'blue' }),
      S('accepted', 'Accepted', 'Risks that cannot be solved; the team lives with them', 1, 2, 1, 1, { aliases: ['accept', 'a'], tone: 'orange' }),
      S('mitigated', 'Mitigated', 'Risks with a plan to lessen their impact', 2, 2, 1, 1, { aliases: ['mitigate', 'm'], tone: 'purple' }),
    ],
  },
  {
    id: 'lbc',
    tag: 'lbc',
    name: 'Lean Business Case',
    blurb: 'SAFe one-pager for an Epic: the hypothesis, expected outcomes, MVP and the go/no-go decision.',
    cols: 6,
    rows: [1.2, 1, 1],
    aspect: 0.7,
    sections: [
      S('epic', 'Epic Hypothesis', 'For [customer] who [need], the [epic] is a [type] that [benefit]. Unlike [alternative], we [differentiator]', 1, 1, 3, 1, { num: 1, aliases: ['epichypothesis', 'hypothesis', 'description', 'epicdescription'], tone: 'blue' }),
      S('outcomes', 'Business Outcomes', 'Measurable benefits if the hypothesis proves true', 4, 1, 3, 1, { num: 2, aliases: ['businessoutcomes', 'benefits', 'outcome'], tone: 'green' }),
      S('indicators', 'Leading Indicators', 'Early signals that tell you the outcomes are on track', 1, 2, 2, 1, { num: 3, aliases: ['leadingindicators', 'indicator', 'signals'] }),
      S('mvp', 'MVP', 'Smallest increment that can prove or disprove the hypothesis', 3, 2, 2, 1, { num: 4, aliases: ['minimumviableproduct'], tone: 'purple' }),
      S('nfr', 'Non-Functional Requirements', 'Performance, security, compliance, scalability and other qualities', 5, 2, 2, 1, { num: 5, aliases: ['nonfunctionalrequirements', 'nfrs', 'qualities'] }),
      S('outofscope', 'Out of Scope', 'What this epic deliberately will not cover', 1, 3, 2, 1, { num: 6, aliases: ['scope', 'exclusions', 'notinscope'], tone: 'red' }),
      S('sponsors', 'Sponsors & Stakeholders', 'Who champions it and who is affected or must approve', 3, 3, 2, 1, { num: 7, aliases: ['sponsorsandstakeholders', 'sponsor', 'stakeholders', 'stakeholder'] }),
      S('estimate', 'Cost & Impact', 'Rough cost, effort, capacity and risk to fund the epic', 5, 3, 2, 1, { num: 8, aliases: ['costandimpact', 'cost', 'costs', 'impact', 'funding'], tone: 'orange' }),
    ],
  },
  {
    id: 'ia',
    tag: 'ia',
    name: 'Inspect & Adapt Retrospective',
    blurb: 'SAFe end-of-PI event: review results, then turn the biggest problems into improvement work.',
    cols: 6,
    rows: [1, 1, 1],
    aspect: 0.7,
    sections: [
      S('wentwell', 'What Went Well', 'Successes and practices worth keeping', 1, 1, 3, 1, { aliases: ['good', 'successes', 'keep'], tone: 'green' }),
      S('improve', 'What Could Be Better', 'Things that slowed us down or fell short', 4, 1, 3, 1, { aliases: ['couldbebetter', 'didntgowell', 'wentbadly', 'stop'], tone: 'orange' }),
      S('metrics', 'Results & Metrics', 'Quantitative and qualitative evidence: PI objectives, predictability, quality, flow', 1, 2, 2, 1, { aliases: ['resultsandmetrics', 'measurements', 'data', 'measures'], tone: 'blue' }),
      S('problems', 'Problems to Solve', 'Top issues chosen by the group to tackle now', 3, 2, 2, 1, { aliases: ['problemstosolve', 'problem', 'issues'], tone: 'red' }),
      S('causes', 'Root Causes', 'Why the problems really happen, found by asking why repeatedly', 5, 2, 2, 1, { aliases: ['rootcauses', 'rootcause', 'cause', 'why'] }),
      S('actions', 'Improvement Backlog', 'Agreed actions with an owner, to be planned in the next PI', 1, 3, 6, 1, { aliases: ['improvementbacklog', 'improvements', 'backlog', 'improvementitems', 'actionitems'], tone: 'purple' }),
    ],
  },
];

export function getCanvas(id) {
  return CANVASES.find((c) => c.id === id) || null;
}

export function findCanvasByTag(tag) {
  const t = norm(tag);
  return CANVASES.find((c) => norm(c.tag) === t || norm(c.id) === t) || null;
}

// Resolve a user-typed section name (any alias, spacing, case) to a section definition.
export function resolveSection(def, name) {
  const n = norm(name);
  if (!n) return null;
  return def.sections.find((s) => norm(s.key) === n || norm(s.title) === n || s.aliases.some((a) => norm(a) === n)) || null;
}

// All names that may be typed for a canvas (used for typo suggestions).
export function allSectionNames(def) {
  return def.sections.flatMap((s) => [s.key, ...s.aliases]);
}
