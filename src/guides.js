// Rich hover guidance for every canvas section: what it is, questions to think about, and sample entries.
// GUIDES[canvasId][sectionKey] = { about, ask: [questions], examples: [short sample notes] }

const G = (about, ask, examples) => ({ about, ask, examples });

export const GUIDES = {
  lean: {
    problem: G(
      'The 1-3 most painful problems your target customers have. A clear problem is the foundation everything else rests on.',
      ['Is this a problem people actively try to solve today?', 'How often and how badly does it hurt?', 'Can you describe it in the customer\'s own words?'],
      ['Finding a trustworthy dog walker takes days', 'Schedules change last-minute with no flexibility', 'No proof the dog was actually walked'],
    ),
    alternatives: G(
      'How customers cope with the problems right now, including doing nothing. These are your real competitors.',
      ['What do customers use today (tools, workarounds, spreadsheets)?', 'What do they pay for it in money or time?', 'Why is it not good enough?'],
      ['Ask a neighbor', 'Spreadsheet and email', 'Big incumbent software'],
    ),
    solution: G(
      'The top 3 features that directly answer the problems above. Keep it small: this is a hypothesis, not a roadmap.',
      ['Does each feature map to a specific problem?', 'What is the smallest version you could test?', 'What can you leave out for now?'],
      ['One-tap booking', 'Live GPS walk tracking', 'Photo report after each walk'],
    ),
    metrics: G(
      'The few numbers that tell you whether the business is working. Prefer actions people take over vanity totals.',
      ['Which stage of the customer journey matters most: acquisition, activation, retention, revenue, referral?', 'What number would make you change course if it dropped?', 'Can you measure it today?'],
      ['Weekly active customers', 'Repeat booking rate', 'Cost to acquire a customer'],
    ),
    uvp: G(
      'One clear, compelling sentence on why you are different and worth paying attention to. Lead with the outcome, not the feature.',
      ['What do you do that nobody else does, or does better?', 'Would a customer understand it in five seconds?', 'Does it speak to the problem, not the technology?'],
      ['Trusted walks, booked in 30 seconds', 'Your focus, protected from digital noise'],
    ),
    concept: G(
      'A short "X for Y" analogy that gives people an instant mental model of what you are building.',
      ['What well-known product is closest to yours?', 'What twist makes yours different?'],
      ['Uber for dog walking', 'YouTube = Flickr for videos'],
    ),
    unfair: G(
      'Something that cannot be easily copied or bought. Often empty at the start, and that is fine: say so honestly.',
      ['What would a well-funded competitor struggle to replicate?', 'Do you have insider information, a network, data, expertise, a community, or a patent?', 'Does it get stronger over time?'],
      ['Exclusive partnership with the largest local shelter', 'Proprietary dataset from 5 years of operation', 'Founder is a certified trainer'],
    ),
    channels: G(
      'The path to reach your customers, from first awareness to purchase. Pick the few channels you can actually test.',
      ['Where do your customers already spend time?', 'Which channels are free or cheap to test first?', 'How will you measure each one?'],
      ['Local Facebook groups', 'Vet clinic referrals', 'Search ads for "dog walker near me"'],
    ),
    segments: G(
      'The specific groups of people or organizations you are building for. Narrow beats broad.',
      ['Who has the problem most intensely?', 'Who pays, and who uses (they may differ)?', 'Could you name five real people in this group?'],
      ['Urban professionals with a dog', 'Seniors who cannot walk long distances'],
    ),
    earlyadopters: G(
      'The ideal first customers: people who feel the problem acutely, are already looking for a fix, and will forgive an imperfect product.',
      ['Who has tried to solve this themselves?', 'Who can you reach quickly and talk to in person?', 'What do they have in common?'],
      ['Work 10-hour days, no family nearby', 'Already paying for a walker or daycare'],
    ),
    costs: G(
      'What it costs to run the business: fixed and variable, including getting and serving customers.',
      ['What are the biggest recurring costs?', 'What does it cost to acquire one customer?', 'Which costs grow with each new customer?'],
      ['Customer acquisition', 'Hosting and software', 'Insurance', 'Contractor payouts'],
    ),
    revenue: G(
      'How you make money: the model, pricing, lifetime value and margins.',
      ['Who pays, how much, and how often?', 'What is a customer worth over their lifetime?', 'What is the gross margin per sale?'],
      ['$20 per walk, 20% platform fee', 'Monthly subscription tiers', 'Gross margin target: 30%'],
    ),
  },

  bmc: {
    partners: G(
      'The suppliers and partners that make the model work. Partner when you want to reduce risk, gain scale, or acquire resources you lack.',
      ['Who are your key suppliers?', 'Which activities or resources would you rather get from others?', 'What do partners get in return?'],
      ['Green coffee importers', 'Payment processor', 'Local cafes as retail partners'],
    ),
    activities: G(
      'The most important things you must do for the model to work: producing, solving problems, running the platform or network.',
      ['What does your value proposition absolutely require?', 'What do your channels and relationships require?', 'What drives revenue?'],
      ['Roasting and quality control', 'Platform development', 'Subscription fulfillment'],
    ),
    resources: G(
      'The assets you need: physical, intellectual, human and financial.',
      ['What equipment, IP, people or capital are essential?', 'Which are hard for competitors to get?', 'What do you own versus rent?'],
      ['Commercial roaster', 'Brand and recipes', 'Head roaster', 'Working capital'],
    ),
    value: G(
      'The bundle of products and services that solves a customer problem or satisfies a need. Why would someone choose you?',
      ['Which customer problem are you solving?', 'What do you offer each segment?', 'Is it newness, performance, price, convenience, design, status, risk reduction, or customization?'],
      ['Fresh-roasted coffee delivered within 48 hours', 'Free personalization of roast profile'],
    ),
    relationships: G(
      'The type of relationship each segment expects, from personal assistance to fully automated self-service.',
      ['How do you get, keep and grow customers?', 'What does the relationship cost?', 'Would a community or co-creation help?'],
      ['Personal onboarding call', 'Self-service account portal', 'Community forum'],
    ),
    channels: G(
      'How you communicate with and deliver value to segments: awareness, evaluation, purchase, delivery and after-sales.',
      ['Which channels work best and are most cost-efficient?', 'How are they integrated with customer routines?', 'Which do customers prefer?'],
      ['Website and app', 'Direct sales team', 'Wholesale distributors'],
    ),
    segments: G(
      'The different groups of people or organizations you aim to reach. Group them by distinct needs, behaviors or willingness to pay.',
      ['For whom are you creating value?', 'Who are your most important customers?', 'Is this a mass market, niche, or multi-sided platform?'],
      ['Home coffee enthusiasts', 'Local restaurants', 'Offices'],
    ),
    costs: G(
      'All costs to operate the model. Identify which are fixed and which scale with volume, and which resources and activities are most expensive.',
      ['What are the most important costs inherent in the model?', 'Is the model cost-driven or value-driven?', 'Where do you get economies of scale?'],
      ['Green coffee beans', 'Staff salaries', 'Rent and utilities', 'Shipping'],
    ),
    revenue: G(
      'How each segment pays and for what. Each stream may have a different pricing mechanism.',
      ['What are customers truly willing to pay for?', 'How do they pay today, and how would they prefer to?', 'How much does each stream contribute overall?'],
      ['Subscription fees', 'One-off bag sales', 'Wholesale contracts', 'Advertising'],
    ),
  },

  vpc: {
    gaincreators: G(
      'How your products and services create the gains customers want: extra savings, quality, delight, or social proof.',
      ['Do you save time, money or effort?', 'Do you outperform what they expect?', 'Do you make their life or work easier or more enjoyable?'],
      ['Weekly recipes that never repeat', 'Kids love helping cook'],
    ),
    products: G(
      'The list of products and services your value proposition is built around, physical, digital, intangible or financial.',
      ['What do you actually offer?', 'Which are core and which are supporting?', 'Do they help customers complete their main jobs?'],
      ['Weekly meal kit box', 'Mobile ordering app', 'Recipe videos'],
    ),
    painrelievers: G(
      'How you eliminate or reduce things that annoy customers before, during and after the job.',
      ['Which specific pains do you address?', 'Do you remove obstacles, risks or negative emotions?', 'Which relievers matter most to customers?'],
      ['Pre-portioned ingredients, no waste', 'Skip or pause any week, no fees'],
    ),
    gains: G(
      'The outcomes and benefits customers want, expect, desire or would be surprised by: functional, social, emotional, and cost savings.',
      ['What would delight them?', 'What do they dream about?', 'How do they measure success?'],
      ['Family eats together more often', 'Feel like a good parent'],
    ),
    jobs: G(
      'What customers are trying to get done: tasks, problems to solve or needs to satisfy. Functional, social and emotional jobs all count.',
      ['What do they need to accomplish?', 'What are they trying to solve, in work or life?', 'Which jobs matter most to them?'],
      ['Get a healthy dinner on the table by 6pm', 'Keep kids happy and fed'],
    ),
    pains: G(
      'Bad outcomes, risks and obstacles related to the job: what annoys customers before, during and after getting it done.',
      ['What do they find too costly, slow or difficult?', 'What are their biggest frustrations and fears?', 'What keeps them from getting the job done?'],
      ['No time to plan or shop', 'Food waste from unused groceries'],
    ),
  },

  swot: {
    strengths: G(
      'Internal advantages you control. What you do well, and what others see as your edge.',
      ['What do you do better than others?', 'What unique resources, skills or reputation do you have?', 'What do customers praise?'],
      ['Loyal local customer base', 'Expert, knowledgeable staff', 'Prime downtown location'],
    ),
    weaknesses: G(
      'Internal limits you can work on. Be honest: customers and competitors already see them.',
      ['Where do you lack resources or skills?', 'What do customers complain about?', 'What do you avoid doing?'],
      ['Small online presence', 'Limited budget', 'Reliance on one supplier'],
    ),
    opportunities: G(
      'External conditions you could take advantage of: trends, gaps in the market, or changes in regulation and technology.',
      ['What trends are growing in your field?', 'What are competitors missing?', 'What new technology or partnership could open doors?'],
      ['Rising interest in local shopping', 'Neighboring space opening up', 'Community event partnerships'],
    ),
    threats: G(
      'External forces you cannot control that could hurt you: competition, economy, regulation, supply issues.',
      ['What are competitors doing?', 'Which changes in market or regulation could hurt?', 'What would cause you the most damage?'],
      ['Big online retailers', 'Rising rent', 'Shifting consumer habits'],
    ),
  },

  empathy: {
    says: G(
      'What the person says out loud: direct quotes and statements from interviews or conversations.',
      ['What words or phrases do they use?', 'What do they tell others about the topic?', 'What do they ask for?'],
      ['"I never have enough time for 1:1s"', '"I can\'t tell if the team is engaged"'],
    ),
    thinks: G(
      'What goes on in their head that they may not say out loud: beliefs, worries, aspirations.',
      ['What matters most to them, deep down?', 'What are they worried about?', 'Where do their words and thoughts differ?'],
      ['Am I micromanaging?', 'People may be burning out'],
    ),
    does: G(
      'Observable actions and behaviors: what they do, and how they act in practice.',
      ['What do they do day to day?', 'What workarounds do they use?', 'How do they behave in public versus in private?'],
      ['Schedules extra video calls', 'Checks chat late into the evening'],
    ),
    feels: G(
      'Their emotional state: what excites, frustrates, worries or motivates them.',
      ['What makes them anxious or proud?', 'What would make them feel supported?', 'How do they feel at the moment of the problem?'],
      ['Isolated from the team', 'Proud when projects ship'],
    ),
    pains: G(
      'Fears, frustrations and obstacles standing between this person and what they want.',
      ['What frustrates them most?', 'What risks do they fear?', 'What obstacles are in their way?'],
      ['Time zone mismatches', 'Losing team culture'],
    ),
    gains: G(
      'What they want and need, and how they would measure success. Think of the outcomes that would make them happy.',
      ['What does success look like to them?', 'What would make their life easier?', 'What are they hoping for?'],
      ['A connected, self-directed team', 'Fewer, shorter meetings'],
    ),
  },

  roam: {
    resolved: G(
      'Risks the team agrees are no longer a concern, because the issue was addressed or the threat went away. Record the outcome so nobody re-raises it.',
      ['Who confirmed this is truly settled?', 'What changed that removed the risk?', 'Could it come back later?'],
      ['Vendor API access confirmed in writing', 'Test environment now provisioned'],
    ),
    owned: G(
      'Risks that cannot be closed in the room, so one named person takes responsibility for working them. Every owned risk needs a single owner and a next update.',
      ['Who specifically owns it (one person, not a team)?', 'What is the first step and when will they report back?', 'Which Resolved, Accepted or Mitigated state should it reach?'],
      ['Dependency on Payments team API (Priya)', 'Unclear data-retention rules (Legal liaison)'],
    ),
    accepted: G(
      'Risks that cannot be avoided or reduced at reasonable cost. The team knowingly takes them on, so state the impact you are prepared to live with.',
      ['What is the worst realistic outcome?', 'Who agreed to accept it?', 'What would make you revisit the decision?'],
      ['Holiday absences may slow Sprint 4', 'Third-party service outages occasionally affect checkout'],
    ),
    mitigated: G(
      'Risks you cannot eliminate but can lessen, with a concrete plan that lowers likelihood or impact.',
      ['What specific action reduces the likelihood or impact?', 'Who does it, and by when?', 'What is the fallback if the plan fails?'],
      ['Cross-train a second engineer on the billing module', 'Feature flag allows instant rollback'],
    ),
  },

  lbc: {
    epic: G(
      'The Epic Hypothesis Statement: a testable claim about who benefits and how. It frames the whole business case.',
      ['Who is the customer and what do they need?', 'What is the epic, and what benefit does it deliver?', "How is it different from today's alternative?"],
      ['For field technicians who lose time on paperwork, the Mobile Work Orders epic is an app that cuts admin time. Unlike the paper process, it works offline'],
    ),
    outcomes: G(
      'The measurable benefits you expect if the hypothesis is true. These justify the investment.',
      ['What changes in revenue, cost, speed, quality or satisfaction?', 'By how much, and by when?', 'Who benefits?'],
      ['Reduce admin time per job by 30%', 'Increase first-visit fix rate to 85%'],
    ),
    indicators: G(
      'Early, observable measures that show whether the outcomes are materializing, so you can pivot or stop before spending everything.',
      ['What can you measure within weeks of releasing the MVP?', 'What result would make you stop?', 'Who tracks them?'],
      ['MVP adoption by 20 technicians', 'Median form completion time', 'Weekly active users'],
    ),
    mvp: G(
      'The smallest, fastest increment that can prove or disprove the hypothesis. Not a smaller version of everything: a focused experiment.',
      ['Which single capability tests the riskiest assumption?', 'Who gets it first?', 'What can wait until after the MVP?'],
      ['Offline work-order capture for one region', 'Pilot with 20 technicians'],
    ),
    nfr: G(
      'Qualities the solution must meet beyond features. They often drive cost and architecture.',
      ['What are the performance, security, availability and compliance needs?', 'Which standards or regulations apply?', 'What scale must it support?'],
      ['Works offline for 8 hours', 'Encrypted customer data', 'Supports 5,000 concurrent users'],
    ),
    outofscope: G(
      'What the epic will not do. Stating it up front prevents scope creep and sets stakeholder expectations.',
      ['What related work is tempting but not needed to test the hypothesis?', 'What belongs to another epic or team?', 'What might stakeholders assume is included?'],
      ['Customer-facing portal', 'Replacement of the billing system'],
    ),
    sponsors: G(
      'The people who champion the epic and those who are impacted by it or must approve. The Epic Owner is accountable for it.',
      ['Who is the Epic Owner?', 'Who funds and approves it?', 'Which teams, customers or departments are affected?'],
      ['Epic Owner: Dana (Field Operations)', 'Sponsor: VP Operations', 'Affected: Support, Billing'],
    ),
    estimate: G(
      'A rough estimate of cost, effort and impact so portfolio leaders can compare epics and decide on funding.',
      ['What is the approximate cost and capacity needed?', 'Which teams or value streams are involved?', 'What are the main risks and dependencies?'],
      ['MVP: about 3 teams for 2 PIs', 'Dependency: Identity service upgrade'],
    ),
  },

  ia: {
    wentwell: G(
      'Successes to celebrate and practices worth repeating in the next PI. Naming them keeps them from being lost while fixing problems.',
      ['Which objectives did we meet and why?', 'What practices or collaboration worked unusually well?', 'Who deserves recognition?'],
      ['Delivered 9 of 10 PI objectives', 'Cross-team swarming resolved the data migration quickly'],
    ),
    improve: G(
      'Honest observations about what slowed the train down or fell short. Describe what happened, not who is to blame.',
      ['What surprised us or caused rework?', 'Where did work wait or get blocked?', 'Which dependencies or handoffs hurt?'],
      ['Late integration found issues in the last sprint', 'Unclear ownership of shared services'],
    ),
    metrics: G(
      'The evidence the group reviews first: PI Predictability, planned vs. actual, quality, flow and team feedback. Data keeps the discussion fact-based.',
      ['How did actual business value compare to plan?', 'What do cycle time, defects and flow tell us?', 'What does survey or team sentiment say?'],
      ['PI predictability: 82%', 'Escaped defects up 15%', 'Average cycle time 11 days'],
    ),
    problems: G(
      'Out of everything raised, the few problems the group agrees are most worth solving now. Pick the top three or so by voting.',
      ['Which problems cost us the most?', 'Which can this train actually influence?', 'What did people vote highest?'],
      ['Integration issues found too late', 'Unclear priorities between teams'],
    ),
    causes: G(
      'The underlying reasons behind the chosen problems. Ask "why" repeatedly or use a fishbone diagram until you reach something fixable.',
      ['Why did this happen? And why did that happen?', 'Is it a process, tool, skill, communication or structure issue?', 'If we fixed this, would the problem go away?'],
      ['No shared test environment until late', 'Dependencies identified only at PI Planning'],
    ),
    actions: G(
      'Concrete improvement items, each small enough to finish and with an owner. They go into the next PI Planning as backlog items so they actually get done.',
      ['What exactly will we change?', 'Who owns it and when is it due?', 'How will we know it worked?'],
      ['Stand up a shared test environment (Priya, Sprint 1)', 'Hold mid-PI dependency check-in (RTE)'],
    ),
  },
};

// Canvas-level guides, shown when hovering the canvas type under the title.
export const CANVAS_GUIDES = {
  lean: {
    about: 'A one-page plan for a new product or startup (Ash Maurya). It swaps a long business plan for nine boxes you can write in 20 minutes and revise as you learn.',
    use: ['Testing a new product idea quickly', 'Deciding what to validate first', 'Pitching or aligning a founding team'],
    numbered: 'The numbers are the order to fill it in. Start with the Problem and Customer Segments, then your Unique Value Proposition, and only then the Solution. Designing around a real problem first keeps you from building features nobody needs. Metrics and Unfair Advantage come last, once the rest is clear. The Existing Alternatives, High-Level Concept and Early Adopters boxes are un-numbered notes that support the box next to them.',
  },
  bmc: {
    about: "Osterwalder's nine building blocks describing how an organization creates, delivers and captures value.",
    use: ['Understanding or documenting an existing business', 'Exploring alternative business models', 'Spotting gaps between partners, activities, costs and revenue'],
  },
  vpc: {
    about: 'Matches what you offer (Value Map) to what customers need (Customer Profile) to check for product-market fit.',
    use: ['Designing or improving a product or service', 'Checking that your offer solves real jobs, pains and gains', 'Preparing customer interviews'],
  },
  swot: {
    about: 'Strengths, Weaknesses, Opportunities and Threats: a quick snapshot of internal factors and external forces.',
    use: ['Strategic planning sessions', 'Assessing a project, team or competitor', 'Deciding where to invest or defend'],
  },
  empathy: {
    about: 'Describes one person by what they say, think, do and feel, plus their pains and gains.',
    use: ['Preparing for or summarizing user research', 'Building shared understanding of a persona', 'Spotting needs people do not state out loud'],
  },
  roam: {
    about: 'A SAFe risk board. During planning every risk is sorted as Resolved, Owned, Accepted or Mitigated.',
    use: ['PI Planning risk review', 'Making sure each risk has a clear disposition', 'Tracking risk ownership across the train'],
  },
  ia: {
    about: 'The SAFe event at the end of every Program Increment. The train reviews results, then runs a retrospective and problem-solving workshop to produce improvements.',
    use: ['Closing out a PI with a shared view of results', 'Choosing the biggest problems to solve', 'Feeding improvement items into the next PI Planning'],
  },
  lbc: {
    about: 'A SAFe one-pager for an Epic. It states the hypothesis, expected outcomes and MVP so portfolio leaders can make a go/no-go funding decision.',
    use: ['Proposing an epic through the portfolio Kanban', 'Defining measurable outcomes and leading indicators', 'Agreeing scope before committing funding'],
    numbered: 'The numbers suggest the order to fill it in: state the hypothesis, say what outcomes you expect and how you will spot them early, then define the MVP, its qualities and its limits, and finish with who is involved and what it costs. You can fill boxes in any order, but a hypothesis written first keeps every later box tied to it.',
  },
};

export function getCanvasGuide(id) {
  return CANVAS_GUIDES[id] || null;
}

export function getGuide(canvasId, key) {
  return (GUIDES[canvasId] && GUIDES[canvasId][key]) || null;
}
