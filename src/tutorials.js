// Step-by-step tutorials. Each step teaches one section (or one syntax feature), says which
// part of the canvas to highlight, checks the live document, and can "show me" by inserting a snippet.

import { blockText, insertBlock, setDirective } from './textops.js';
import { itemsOf } from './parser.js';

// A step that asks the learner to fill one section.
const fill = (key, title, body, example, { min = 1, tip } = {}) => ({
  title,
  body,
  tip,
  focus: [key],
  syntax: `${key} {\n  - First item\n  - Second item\n}`,
  goal: `Add at least ${min} item${min > 1 ? 's' : ''} to "${key}"`,
  check: (doc) => itemsOf(doc, key).length >= min,
  apply: (text) => insertBlock(text, blockText(key, example)).text,
});

const intro = (name, tag, extra) => ({
  title: `Start your ${name}`,
  body: `Every canvas description is plain text between a start and an end line. ${extra} Give it a title so you can recognize it later.`,
  focus: [],
  syntax: `@start${tag}\ntitle My Idea\n@end${tag}`,
  goal: 'Replace the title with your own idea\'s name (anything but "My Canvas")',
  check: (doc) => !!doc.title && doc.title !== 'My Canvas',
  apply: (text) => setDirective(text, 'title', 'My Great Idea'),
});

const polish = (colorKey, colorItem) => ({
  title: 'Make it yours',
  body: 'End any item with a color tag such as #green, #blue, #red, #orange, #pink, #purple, #gray (or a hex code like #ff8800) to color its sticky note. Add a "theme" line to restyle the whole canvas: light, dark, blueprint or mono. Add subtitle, author, date and version lines to fill the header.',
  focus: [],
  syntax: `theme blueprint\n${colorKey} {\n  - ${colorItem} #green\n}`,
  goal: 'Color at least one item, or choose a theme',
  check: (doc) => doc.theme !== 'light' || Object.values(doc.sections).some((s) => s.items.some((i) => i.color)),
  apply: (text) => setDirective(text, 'theme', 'blueprint'),
});

const finish = {
  title: 'Share and keep going',
  body: 'Your description is the source of truth: use Export to save an SVG or PNG image, a Markdown outline, or the text itself, and Share to get a link that contains the whole canvas. Click any box on the canvas to jump to its text. Open the Examples gallery for complete canvases to learn from.',
  focus: [],
  syntax: null,
  goal: 'You made it! Click "Finish" to keep editing freely.',
  check: () => true,
  apply: (text) => text,
};

export const TUTORIALS = [
  {
    type: 'lean',
    title: 'Build a Lean Canvas',
    summary: 'Nine focused steps from customer to unfair advantage, in the order Ash Maurya recommends.',
    initialTitle: 'My Canvas',
    steps: [
      intro('Lean Canvas', 'lean', 'The Lean Canvas is a one-page business plan for testing an idea fast.'),
      fill('segments', '1. Customer segments', 'Start with who. Who has the problem you want to solve? Be specific: "everyone" is not a customer. Write each distinct group of customers or users on its own line.', ['Busy urban professionals with dogs', 'Pet owners who travel for work'],
        { tip: 'Also try the optional "earlyadopters" section to describe your ideal first customers.' }),
      fill('problem', '2. Problem', 'List the top one to three problems this customer has. Describe the pain, not your product. Optionally list how they solve it today in an "alternatives" section.', ['Hard to find a walker I can trust', 'Last-minute schedule changes leave the dog alone'],
        { min: 2, tip: 'Try the optional "alternatives" section for how people cope today.' }),
      fill('uvp', '3. Unique value proposition', 'Write one clear, compelling sentence about why you are different and worth paying attention to. Lead with the outcome the customer gets.', ['Vetted walkers with live GPS proof of every walk'],
        { tip: 'The optional "concept" section is perfect for an "X for Y" analogy.' }),
      fill('solution', '4. Solution', 'Now, and only now, think about features. Pick the top three that directly solve the problems above.', ['Background-checked walker network', 'Live GPS tracking and photo updates', 'Same-day booking in two taps'], { min: 2 }),
      fill('channels', '5. Channels', 'How will you reach your customer segments? Free channels (referrals, content) count as much as paid ones.', ['Local vet partnerships', 'Referral credits']),
      fill('revenue', '6. Revenue streams', 'How will money come in? Think about price, revenue model and the lifetime value of a customer.', ['20% commission per walk', 'Premium subscription']),
      fill('costs', '7. Cost structure', 'What does it cost to run this? Include customer acquisition, hosting, people and any variable costs.', ['Walker background checks', 'Insurance', 'App development and hosting']),
      fill('metrics', '8. Key metrics', 'Which numbers tell you the business is working? Choose a few actionable metrics, not vanity metrics.', ['Walks per week', 'Repeat booking rate']),
      fill('unfair', '9. Unfair advantage', "Something that can't easily be copied or bought: insider information, a community, an exclusive partnership. It's fine to leave this empty at first, but try to find one.", ['Exclusive partnerships with three large vet chains']),
      polish('uvp', 'Vetted walkers with live GPS proof of every walk'),
      finish,
    ],
  },
  {
    type: 'bmc',
    title: 'Build a Business Model Canvas',
    summary: "Walk through Osterwalder's nine building blocks, customer side first.",
    initialTitle: 'My Canvas',
    steps: [
      intro('Business Model Canvas', 'bmc', 'The Business Model Canvas describes how an organization creates, delivers and captures value.'),
      fill('segments', '1. Customer segments', 'For whom are you creating value? List each distinct group of customers. Groups differ when they need different offers, channels or relationships.', ['Home coffee enthusiasts', 'Offices and small businesses']),
      fill('value', '2. Value propositions', 'What bundle of products and services creates value for each segment? Which problem do you solve or need do you satisfy?', ['Fresh coffee roasted within 48 hours', 'Zero-effort monthly delivery']),
      fill('channels', '3. Channels', 'Through which touchpoints do customers learn about, buy and receive your value proposition?', ['Website and subscription portal', 'Farmers markets']),
      fill('relationships', '4. Customer relationships', 'What type of relationship does each segment expect? Personal assistance, self-service, community, automated?', ['Personal tasting notes with each box']),
      fill('revenue', '5. Revenue streams', 'For what value is each segment truly willing to pay? How do they pay today and how would they prefer to?', ['Monthly subscriptions', 'Wholesale to cafes']),
      fill('resources', '6. Key resources', 'Which assets are essential: physical, intellectual, human or financial?', ['Roasting equipment', 'Direct-trade relationships']),
      fill('activities', '7. Key activities', 'What must you do really well to deliver the value proposition, reach customers and earn revenue?', ['Sourcing green beans', 'Roasting and quality control']),
      fill('partners', '8. Key partners', 'Who are your key suppliers and partners? Which resources or activities do they provide so you do not have to?', ['Direct-trade farms', 'Packaging supplier']),
      fill('costs', '9. Cost structure', 'What are the most important costs inherent in your model? Which resources and activities are most expensive?', ['Green coffee purchases', 'Rent and utilities']),
      polish('value', 'Fresh coffee roasted within 48 hours'),
      finish,
    ],
  },
  {
    type: 'vpc',
    title: 'Build a Value Proposition Canvas',
    summary: 'Describe your customer first, then design a value map that fits.',
    initialTitle: 'My Canvas',
    steps: [
      intro('Value Proposition Canvas', 'vpc', 'This canvas has two halves: the Customer Profile (right) and the Value Map (left).'),
      fill('jobs', '1. Customer jobs', 'What are customers trying to get done in their work or life? Include functional jobs, social jobs and emotional jobs.', ['Feed the family a healthy dinner', 'Keep weeknights calm']),
      fill('pains', '2. Pains', 'What annoys customers before, during and after getting the job done? List frustrations, risks and obstacles.', ['Decision fatigue about what to cook', 'Wasted groceries']),
      fill('gains', '3. Gains', 'What outcomes and benefits do customers want, expect or would be delighted by?', ['More time together at the table', 'Kids try new foods']),
      fill('products', '4. Products & services', 'Now switch to the Value Map. List the products and services your value proposition is built around.', ['Weekly meal kit subscription', 'Recipe app']),
      fill('painrelievers', '5. Pain relievers', 'How exactly does your offer eliminate or reduce the pains you listed? Aim to answer specific pains.', ['Pre-portioned ingredients, no waste', 'No planning or shopping required']),
      fill('gaincreators', '6. Gain creators', 'How exactly does your offer produce the gains customers want? Again, match specific gains.', ['Recipes ready in 20 minutes', 'Variety that kids actually eat']),
      polish('products', 'Weekly meal kit subscription'),
      finish,
    ],
  },
  {
    type: 'swot',
    title: 'Build a SWOT Analysis',
    summary: 'Four quick steps: two internal factors, two external ones.',
    initialTitle: 'My Canvas',
    steps: [
      intro('SWOT Analysis', 'swot', 'A SWOT looks inward (strengths, weaknesses) and outward (opportunities, threats).'),
      fill('strengths', '1. Strengths', 'What do you do better than others? What do customers praise? Think of resources and advantages you control.', ['Loyal local customer base', 'Expert recommendations']),
      fill('weaknesses', '2. Weaknesses', 'Where do you lack resources or skills? What do others do better? Be honest: this is for you.', ['Small online presence', 'Limited shelf space']),
      fill('opportunities', '3. Opportunities', 'Which trends, gaps or changes in the outside world could you take advantage of?', ['Subscription book boxes', 'School and library contracts']),
      fill('threats', '4. Threats', 'What external forces could hurt you: competitors, regulation, market shifts?', ['Online retailers', 'Rising rent']),
      polish('strengths', 'Loyal local customer base'),
      finish,
    ],
  },
  {
    type: 'empathy',
    title: 'Build an Empathy Map',
    summary: 'Get into the head of one person: what they say, think, do and feel.',
    initialTitle: 'My Canvas',
    steps: [
      intro('Empathy Map', 'empathy', 'An empathy map describes ONE person or persona. Name them in the title, like "Dana, Remote Team Lead".'),
      fill('says', '1. Says', 'What do they say out loud in interviews or conversations? Quote them where you can.', ['"I never know who is blocked."']),
      fill('thinks', '2. Thinks', 'What occupies their mind but they might not say? Worries, aspirations, doubts.', ['Am I being fair to everyone?']),
      fill('does', '3. Does', 'What do you observe them doing? Actions and behaviors, not opinions.', ['Checks chat constantly']),
      fill('feels', '4. Feels', 'What emotions drive them? Name the feelings: anxious, proud, overwhelmed, hopeful.', ['Anxious about losing visibility']),
      fill('pains', '5. Pains', 'What are their fears, frustrations and obstacles?', ['Context scattered across tools']),
      fill('gains', '6. Gains', 'What do they want or need? How would they measure success?', ['A single trusted view of progress']),
      polish('feels', 'Anxious about losing visibility'),
      finish,
    ],
  },
  {
    type: 'roam',
    title: 'Build a ROAM Risk Board',
    summary: 'Sort risks from PI planning into Resolved, Owned, Accepted and Mitigated.',
    initialTitle: 'My Canvas',
    steps: [
      intro('ROAM Risk Board', 'roam', 'ROAM comes from SAFe: during planning, each risk is placed in one of four buckets. Give the board a name such as "PI 12 Risk Board".'),
      fill('resolved', '1. Resolved', 'Which risks did the team discuss and agree are no longer a problem? Note what settled them.', ['Cloud environment quota approved']),
      fill('owned', '2. Owned', 'Which risks still need work? Each one needs exactly one named owner.', ['Payments API dependency (Priya)']),
      fill('accepted', '3. Accepted', 'Which risks cannot be avoided or cheaply reduced? The team knowingly lives with them.', ['Holiday absences in Sprint 4']),
      fill('mitigated', '4. Mitigated', 'Which risks can you lessen with a concrete plan? Describe the action.', ['Cross-train a second engineer on billing']),
      polish('owned', 'Payments API dependency (Priya)'),
      finish,
    ],
  },
  {
    type: 'lbc',
    title: 'Build a Lean Business Case',
    summary: 'Frame a SAFe Epic so leaders can decide whether to fund it.',
    initialTitle: 'My Canvas',
    steps: [
      intro('Lean Business Case', 'lbc', 'A Lean Business Case describes one Epic in a single page. Name it after the epic, such as "Mobile Work Orders".'),
      fill('epic', '1. Epic Hypothesis', 'Who is it for, what need does it meet, and how is it different from what they have today?', ['For field technicians who lose time on paperwork, Mobile Work Orders is an app that captures jobs on site']),
      fill('outcomes', '2. Business Outcomes', 'What measurable benefits will you see if the hypothesis is true?', ['Cut admin time per job by 30%']),
      fill('indicators', '3. Leading Indicators', 'What early signals will tell you the outcomes are on track, within weeks of the MVP?', ['20 technicians using the MVP weekly']),
      fill('mvp', '4. MVP', 'What is the smallest increment that tests the riskiest assumption?', ['Offline job capture for one region']),
      fill('nfr', '5. Non-Functional Requirements', 'What qualities must it meet: performance, security, compliance, scale?', ['Works offline for 8 hours']),
      fill('outofscope', '6. Out of Scope', 'What will this epic deliberately not do?', ['Customer-facing portal']),
      fill('sponsors', '7. Sponsors & Stakeholders', 'Who owns, funds and approves it, and who is affected?', ['Epic Owner: Dana, Field Operations']),
      fill('estimate', '8. Cost & Impact', 'Roughly what will it cost in teams and time, and what are the dependencies?', ['MVP: about 3 teams for 2 PIs']),
      polish('epic', 'Mobile Work Orders'),
      finish,
    ],
  },
  {
    type: 'ia',
    title: 'Run an Inspect & Adapt',
    summary: 'Review the PI, pick problems, find causes and agree improvements.',
    initialTitle: 'My Canvas',
    steps: [
      intro('Inspect & Adapt', 'ia', 'Inspect & Adapt closes each Program Increment. Name it after the PI, such as "PI 12 Inspect & Adapt".'),
      fill('metrics', '1. Results & Metrics', 'Start with data. How did actual results compare to the plan, and what do quality and flow measures show?', ['PI predictability: 82%']),
      fill('wentwell', '2. What Went Well', 'What should the train celebrate and keep doing?', ['Delivered 9 of 10 PI objectives']),
      fill('improve', '3. What Could Be Better', 'What slowed the train down or fell short? Describe events, not people.', ['Late integration revealed defects']),
      fill('problems', '4. Problems to Solve', 'Out of everything raised, which one to three problems matter most? Choose by group vote.', ['Integration issues found too late']),
      fill('causes', '5. Root Causes', 'Why does each problem really happen? Keep asking "why" until you reach something you can fix.', ['No shared test environment until late']),
      fill('actions', '6. Improvement Backlog', 'Agree concrete actions with an owner so they can be planned in the next PI.', ['Stand up shared test environment (Priya, Sprint 1)']),
      polish('problems', 'Integration issues found too late'),
      finish,
    ],
  },
];

export function getTutorial(type) {
  return TUTORIALS.find((t) => t.type === type) || null;
}
