import { useState, useRef, useEffect } from "react";

let _supabase = null;
function getSupabase() {
  if (_supabase) return _supabase;
  if (typeof window === "undefined") return null;
  try {
    const { createClient } = require("@supabase/supabase-js");
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      _supabase = createClient(url, key);
    }
  } catch (e) {
    console.error("Supabase init failed:", e);
  }
  return _supabase;
}

const LOGO_SRC = "/logo.png";

/* ═══ PLATFORM CONFIG ═══ */
const P = {
  linkedin: {
    name: "LinkedIn", color: "#0A66C2", max: 3000,
    tips: [
      "Hook in first 2 lines (before 'see more')",
      "White space / line breaks boost readability and dwell time",
      "Personal stories outperform corporate speak 3:1",
      "End with a question or soft CTA to drive comments",
      "External links in post body kill reach ~40% — use first comment",
      "Carousel docs get 3x more reach than text-only",
      "Post 7–8am or 12–1pm weekdays",
    ],
    algo: "Algorithm rewards dwell time, comments in the first hour, and keeping users ON LinkedIn. Posts shown to ~8% of connections first, then expand based on engagement velocity. External links suppressed.",
  },
  instagram: {
    name: "Instagram", color: "#E1306C", max: 2200,
    tips: [
      "First line truncates at ~125 chars — it IS the hook",
      "Saves are the #1 reach signal (3-4x more impactful than likes)",
      "Carousel posts get 1.4x more reach and get re-served by algorithm",
      "Share-to-DM is the #2 distribution signal",
      "Reels under 30s pushed to Explore; carousels pushed to followers",
      "Post 11am–1pm or 7–9pm",
    ],
    algo: "Prioritizes saves and shares over likes. Evaluates interest, timeliness, relationship, session frequency. Reels get Explore; Carousels get followers. Posts can get significant reach DAYS later via Explore long tail.",
  },
  facebook: {
    name: "Facebook", color: "#1877F2", max: 63206,
    tips: [
      "Conversational tone wins — write to one person, not an audience",
      "Comment LENGTH matters more than count — 5 long > 50 short",
      "Share-to-Messenger is weighted extremely heavily",
      "Native video gets 10x more reach than YouTube links",
      "Personal profiles get 3-5x more organic reach than Pages",
      "Algorithm penalizes engagement bait ('like if you agree')",
      "Post 1–4pm weekdays",
    ],
    algo: "Built around 'meaningful interactions' — long comments, replies, Messenger shares. AI classifier pre-scores posts. Consistent posters get reliability bonus. Engagement bait and external links demoted.",
  },
  twitter: {
    name: "X (Twitter)", color: "#000000", max: 280,
    tips: [
      "First 5 words determine if the rest gets read",
      "Bookmarks are a sleeper metric — weighted heavily for For You",
      "Threads outperform single tweets for topic content",
      "Images increase impressions ~1.5x when relevant",
      "Quote tweets with added insight distribute to both audiences",
      "Content half-life 18-30min in Following, but For You resurfaces days later",
      "Post 7–9am or 6–9pm EST",
    ],
    algo: "Two feeds: Following (chronological, low ceiling) and For You (algorithmic, 10-100x). Engagement-to-impression RATIO > raw numbers. Controversy in replies amplifies. High performers resurface days later.",
  },
};

/* ═══ DEEP SKILLS ═══ */
const SKILLS = {
linkedin: {
impressions: `LINKEDIN IMPRESSIONS SKILL:

MISSION: Maximize how many LinkedIn users see this post by dominating Phase 1 (first 60-90 minutes). Every structural decision optimizes for dwell time, "see more" clicks, and share velocity. Format for slow reading — the algorithm rewards attention held, not just reactions.

STRUCTURE: 800-1300 chars. Single-sentence paragraphs, line breaks between every thought. "See more" fold appears at ~210 chars — the hook must compel the click. NO outbound links in the body (suppresses reach ~40%) — move to first comment. Never edit within 10 minutes of posting — resets distribution. Max 1 post per day — rapid-fire posting penalizes each post's reach.

HOOK PATTERNS (ranked):
1) Pattern Interrupt — contradict conventional wisdom on line 1. "I stopped cold outreach for 90 days. Revenue went up."
2) Specificity Hook — insider data that signals access. "I reviewed 847 sales calls last year. The same mistake shows up in 73% of them."
3) Tension Opener — pause at the decision point. "My best client asked me to break our contract on Tuesday. I said yes."
4) Counter-Narrative — flip a belief both sides feel strongly about.

HOOK KILLERS: "I'm excited/thrilled/honored/humbled to announce..." / "In today's world..." / Starting with a name or tag / Any line that could have been written by anyone.

BODY: Build tension across 3-5 short paragraphs before resolving. Place the insight AFTER the fold. Nested open loops — raise a question, then raise another before answering the first. Never front-load the conclusion.

SHAREABILITY: Posts get shared when the SHARER looks good. Triggers: "I wish I'd known this earlier" / "My team needs this." Killers: requires context about the poster, self-promotional, inside references.

CTA: Weak or none. Close with a line that invites sharing without begging. "This is the thing nobody told me when I started." is more shareable than any explicit CTA.

ANTI-PATTERNS:
- Any outbound URL in the body — first comment only
- "Like if you agree" / "Share if this helped" — hard suppression signal
- More than 1 post per day
- Editing within 10 minutes of publishing
- Opening with a hashtag or emoji

90+ SCORE: Hook forces the "see more" click. Body builds tension before the insight lands. Zero links in body. Shareable by someone who doesn't know the poster personally. Post could only have been written by someone who was there.`,

likes: `LINKEDIN LIKES SKILL:

MISSION: Write a post that earns an immediate emotional approval tap — a quick, low-friction nod from professionals who feel validated or recognized. This is NOT an engagement post (no debate), NOT a follower post (no authority-building). It should feel like the thought a sharp colleague has at the end of the day.

STRUCTURE: 400-900 chars. ONE idea per post — two ideas split attention and kill the like. No bullet points or numbered lists (they signal information, not emotion). Single-sentence paragraphs. End on the STRONGEST line — no CTAs, no questions, nothing after the landing.

HOOK PATTERNS:
1) Truth Bomb — articulate what's true but unspoken. "The best managers never mentioned their open-door policy. They just had one."
2) Earned Reframe — familiar frustration seen from a new angle. "We call it scope creep but half the time it's the client finally knowing what they want."
3) Quiet Competence — demonstrate expertise by SHOWING not claiming. "The pattern I see in every failed product launch: the roadmap had dates but no decisions."

BODY: One short arc. Setup (shared tension), then the reframe or insight. No backstory, no "here's what I learned." Just the observation — specific enough to feel firsthand.

CTA: None. The last line IS the response trigger. Any explicit CTA or question dilutes the resonance. End on the line that makes someone nod without expecting anything.

SINCERITY FILTER: Authentic = specific mistake with real consequences, a moment not just a lesson. Cringe = weaponized vulnerability, children's wisdom as professional insight, humble-brags framed as gratitude ("After my third 7-figure exit, I realized...").

ANTI-PATTERNS:
- Bullet points or numbered lists — kills emotional register
- "I'm grateful/honored/blessed" framing
- Ending with a question — shifts goal from likes to engagement
- Any sentence that could have been written by someone in a different industry

90+ SCORE: Read it, nod, like it before finishing. Under 700 chars. Single observation. Last line lands with a small emotional thud. No question mark anywhere.`,

followers: `LINKEDIN FOLLOWER GROWTH SKILL:

MISSION: Make a first-time viewer decide to follow this account. The post must do three things simultaneously: demonstrate deep domain expertise (shown, not claimed), signal there's a consistent body of work behind this, and have a voice distinctive enough that the reader thinks "I want more of this specific person." Followers are won by depth, not broad appeal.

STRUCTURE: 1000-1800 chars. Short paragraphs, aggressive line breaks throughout. If the content is framework-based or list-like, recommend converting to a PDF carousel upload (LinkedIn's highest-reach format — 3x more distribution than text posts, and signals depth visually). Soft follow signal near the end, never an explicit ask.

HOOK PATTERNS:
1) Framework Post — introduce a named concept implying more exist. "The reason most founders can't scale past 10 employees: I call it the Founder Filter. Here's how it works."
2) Behind-the-Curtain — reveal how something actually works vs. the public narrative. With specific, firsthand detail only an insider would have.
3) Prediction Post — connect dots before others do. Name a year, an outcome, a mechanism. "In 18 months, most in-house SEO teams will be restructured. Here's the pattern I'm already seeing."

DEMONSTRATE DON'T CLAIM: Never "As a 15-year veteran..." Instead: insider patterns only experienced people notice, predictions with visible reasoning, frameworks with their actual names, specific detail treated casually.

BODY: Show the thinking process, not just the conclusion. Give the failed attempt before the success. Name counterintuitive patterns. Every claim should carry the fingerprint of someone who was actually there.

CTA: Soft and implicit. "I track this quarterly — next update in April." / "Full breakdown coming Thursday." The suggestion of more content is the follow trigger. Never "Follow me for more!"

ANTI-PATTERNS:
- "As a [title] with [X] years of experience..." — claimed authority, not demonstrated
- Generic advice any professional in any industry could have written
- "Follow me for more [topic]!" — reads as spam on LinkedIn
- Advice lists without a specific mechanism or story behind each point

90+ SCORE: A stranger reads this and thinks "this person knows something I don't." Post implies a deeper body of work. Has a soft signal that more is coming. Could only have been written by someone with specific firsthand experience.`,

engagement: `LINKEDIN ENGAGEMENT SKILL (COMMENTS, SHARES, SAVES):

PSYCHOLOGY: Comments are the HIGHEST-VALUE engagement on LinkedIn. The algorithm treats a comment as 5-10x more valuable than a like. But not all comments are equal — long, thoughtful comments signal "meaningful interaction" and trigger exponential distribution. Shares extend your content to entirely new networks. Your goal is to make it IMPOSSIBLE for someone to read your post and not have an opinion they need to share.

WHY PEOPLE COMMENT: 1) They disagree and need to say so 2) They have a personal story that relates 3) They want to answer a question you asked 4) They want to look smart/knowledgeable in front of YOUR audience 5) They feel emotionally compelled to add something. Design every post to trigger at least TWO of these.

COMMENT-DRIVING PATTERNS (ranked by effectiveness):
1) THE OPEN QUESTION: End with a genuine question that has NO single right answer. "What's the one thing you'd tell your first-year-in-industry self?" — Everyone has an answer. Everyone's is different. Comment goldmine.
2) THE POLARIZING OBSERVATION: State something where reasonable people disagree. "Cold outreach is dead." — Half the audience agrees, half has counterexamples. Both comment.
3) THE FILL-IN-THE-BLANK: "The hardest lesson I learned about [industry] was ___." — Low friction to respond, high personal investment.
4) THE EXPERIENCE PROMPT: Share a specific experience and ask "Has anyone else dealt with this?" — Triggers "me too" responses which are long and detailed.
5) THE RANKED LIST WITH A MISSING ENTRY: "My top 3 tools for [task]: [list]. What am I missing?" — People LOVE correcting or adding to lists.
6) THE CONTRARIAN INVITE: "Unpopular opinion: [take]. Change my mind." — Frames disagreement as welcome, which removes the social friction of commenting.

COMMENT-KILLING MISTAKES:
- Ending with "Thoughts?" (too vague — nobody knows what to say)
- Ending with "Agree?" (yes/no questions kill comment depth)
- Posts that are so complete there's nothing to add
- Posts that are controversial in a way that makes commenting feel RISKY (political, personal attacks)
- Asking a question you've already answered in the post

SHARE-DRIVING TACTICS:
- Posts get shared when the SHARER looks good for sharing. Useful frameworks, counterintuitive data, and "my team needs this" content.
- Content that solves a specific problem gets shared more than content that inspires. Tactical > motivational.
- Lists of resources, tools, or methods are the most shared format on LinkedIn.
- Contrarian takes get shared with "This 👆" — people share to endorse without writing their own post.

STRUCTURE FOR ENGAGEMENT: 900-1500 chars. Long enough to establish a strong position, short enough to leave room for disagreement. Line breaks for pacing. Place the engagement hook in the FINAL line — last thing they read before deciding to comment. Poster's first comment primes the thread — add context or an alternative take.

REPLY STRATEGY: Reply to EVERY comment in the first 2 hours. Each reply is fresh engagement. Reply-threads are weighted heavily. Pose follow-up questions in replies to extend the thread.

ANTI-PATTERNS:
- Ending with "Thoughts?" or "Agree?" — too vague or kills comment depth
- Posts so comprehensive there's nothing left to add
- Questions with a single correct answer
- Not replying to early comments — every reply generates fresh distribution signal

90+ SCORE: 5+ long comments in the first 2 hours. Thread has reply-depth — people responding to each other's comments. Post sparked debate or story-sharing, not just agreement. Engagement kept alive by the poster's replies.`
},

instagram: {
impressions: `INSTAGRAM IMPRESSIONS SKILL:

MISSION: Maximize distribution through Explore, Suggested, and the algorithmic Feed. Instagram's primary signals for Feed/Carousel posts are SAVES and SHARES — not likes. Every optimization targets making this post save-worthy (reference value) and share-worthy (personally relevant to someone specific). Carousel posts are the highest-reach format for non-Reels content.

STRUCTURE:
- Static/Carousel: 400-800 chars caption
- Reels: 100-250 chars (visual does the work)
- First line ≤125 chars — this is what appears before truncation. Tap-to-expand rate is a tracked signal.
- Carousel: 7-10 slides optimal. First slide = hook, last slide = CTA/summary. More swipes = more algorithmic boost.
- Include 2-4 natural topic keywords in the caption — Instagram now keyword-searches captions, not just hashtags.

HOOK PATTERNS (first line, ≤125 chars):
1) Incomplete Reveal — leave an open loop. "The reason your posts aren't converting (it's not the algorithm) →"
2) Specific Claim — number + outcome. "I tested 47 caption hooks last month. Here's what actually worked:"
3) Direct Address — speak to exactly who this is for. "If you've been posting consistently and still not growing, read this."

SAVE-WORTHY BODY: Structure for utility — numbered steps, checklists, before/after with visible method, frameworks. These formats get saved 3-5x more than storytelling. Each point on its own line. Reads like a cheat sheet, not a paragraph.

CTA: "Save this for when you [specific situation]" — genuinely useful, not engagement bait. Place 2-3 lines from the end. Last carousel slide handles the CTA visually.

ANTI-PATTERNS:
- TikTok watermarks — Instagram actively suppresses reposted TikTok content
- First line starting with "@username" — tags don't hook
- Wall of text with no line breaks — won't be read, won't be saved
- Paragraph of context before the hook — the hook IS line 1, always
- "Share if you agree" — suppressed as engagement bait

90+ SCORE: First line makes me tap "more" immediately. Body is structured for saving — looks like a reference I'll return to. Post gets saved AND shared to a DM, not just liked.`,

likes: `INSTAGRAM LIKES SKILL:

MISSION: Write a short caption that earns an immediate tap from someone scrolling fast. Instagram likes are personal — they're about vibe, taste, and instant resonance. Unlike saves (utility) or engagement (discussion), a like is a nod. The caption should feel like it was written in 30 seconds even if it wasn't. This is NOT the goal for educational content.

STRUCTURE: 50-300 chars optimal — most liked captions are under 150. 1-2 lines is the target. Never describe what's in the image — add context, emotion, or an unexpected angle. 0-2 emoji as punctuation only (never as bullets, never to open). No lists, no how-to structure.

HOOK/BODY PATTERNS (this is the whole post — make it count):
1) One-Liner — image does the heavy lifting, caption adds the punchline. "The meeting that should have been a nap."
2) Micro-Story — 2-3 sentences, complete arc. "Charged $500 for this in 2019. Charged $5,000 for the same thing last month. The only thing that changed was me."
3) Caption-Visual Tension — unexpected juxtaposition between image and text. Surprise earns the like.
4) Relatable Confession — the specific thing many feel but don't say out loud.

TONE: Dry wit > sarcasm. Vulnerability > confidence IF specific. Sounds dashed off. Observation, not presentation. Leave space for the reader to project themselves onto it.

CTA: None. The like IS the response. Any "What do you think?" or "Save this" shifts the goal to engagement and hurts the like rate.

ANTI-PATTERNS:
- Captions over 300 chars for this goal
- Emoji as bullets or decoration
- Instructional or how-to content — belongs in a save-worthy post, not a likes post
- "Share if you relate" — engagement bait suppression
- Describing what's in the photo ("Here I am at...")

90+ SCORE: Liked before finishing it. Made the reader feel understood, amused, or seen. Didn't save it, didn't comment — just liked it and kept scrolling. Under 150 chars.`,

followers: `INSTAGRAM FOLLOWER GROWTH SKILL:

MISSION: Convert a first-time viewer into a follower by establishing niche authority, demonstrating a distinctive voice, and signaling consistent value is coming. The #1 format for Instagram follower growth is CAROUSELS — they demonstrate depth that single images can't. Reels drive impressions; carousels build followers.

STRUCTURE:
- Caption: 500-1200 chars. First 125 chars = strongest hook (visible before truncation).
- Carousel: 5-10 slides. First slide stops the scroll. Slides 2-7 deliver layered value. Last slide = soft follow CTA.
- Include 2-4 natural topic keywords in caption for Instagram keyword search.
- Niche must be clear from a single read — viewer should know exactly what this account is about.

HOOK PATTERNS:
1) Signature Framework — introduce a named concept. "The 3-step method I use to close $10K+ clients. I call it the VAR framework:"
2) Transformation Post — before/after with the method visible. "6 months ago my posts got 50 views. Now they average 40K. The exact 4 changes I made:"
3) Curated Authority — position as the filter in the niche. "I've tested 200+ lead gen strategies. Here are the 5 that actually work right now:"

BODY: Demonstrate expertise through specificity — real numbers, named methods, counterintuitive patterns from firsthand experience. Give systems, not just observations. Each slide or section adds a layer of depth.

CTA: Natural and specific. "I post one framework like this every week — follow if you want the next one." Never "Follow for more content!" — reads as desperate.

ANTI-PATTERNS:
- Vague follow CTAs ("follow for more great content!")
- Generic advice without a specific mechanism behind it
- Reel-style short captions on educational carousel posts
- "Hope this helps!" — weakens authority
- Delivering the CTA before finishing the value

90+ SCORE: First-time viewer reads this and thinks "I need to follow this account." Niche is crystal clear. Voice is distinctive. Content is specific enough to signal deep expertise. They can picture what the next 5 posts will look like.`,

engagement: `INSTAGRAM ENGAGEMENT SKILL (SAVES, SHARES, COMMENTS):

MISSION: Instagram engagement has three tiers with distinct algorithmic weight: SAVES > SHARES/DM > COMMENTS. Optimize for all three in a single post — a save-worthy body, a shareable angle, and a comment-driving close. This is the hardest goal to optimize because you're triggering three different psychological actions simultaneously.

SAVE-DRIVING MECHANICS:
- Saves happen when content is REFERENCE-WORTHY — tutorials, checklists, frameworks, tool lists, step-by-step processes.
- The trigger: "I'll need this later." Future utility drives saves.
- Numbered/structured content gets saved 3-5x more than narrative content.
- Carousel posts get 2-3x more saves — each slide adds reference value.
- CTA: "Save this for when you [specific situation]" — genuinely helpful, not bait.

SHARE/DM-DRIVING MECHANICS:
- DM shares happen when content feels PERSONAL — "this is so you" or "we were just talking about this."
- Relatable niche frustrations, specific professional moments, and industry humor drive DM shares.
- "Send this to your [specific person]" outperforms "share if you agree" — it's targeted, not broadcast.
- Contrarian or spicy takes get forwarded for reaction: "Wait, read this" energy.

COMMENT-DRIVING MECHANICS:
- Instagram comments are harder to earn — commenting on mobile is friction.
- Specific questions get 3x more responses. "What tool do you use for this?" > "What do you think?"
- "This or that" prompts are native to Instagram culture and drive high comment volume.
- Personal stories that invite "same" or "me too" responses.
- Hot takes people feel compelled to weigh in on.

STRUCTURE: 400-1000 chars. Hook in first 125 chars. Body delivers save-worthy value. Close with one specific, narrow question. For carousels: last slide = engagement CTA ("Which resonated most? Drop a number below.").

ENGAGEMENT-KILLING MISTAKES:
- "Double tap if you agree" — hard Instagram suppression
- "Tag someone who needs this" — penalized since 2019
- Broad questions ("What are your goals?") — nobody knows what to say
- Visually strong post with no caption hook — image gets liked, caption gets ignored

90+ SCORE: Gets saved AND shared AND commented on — by different people for different reasons. Body is structured enough to save. Story or take is specific enough to forward. Closing question is narrow enough to answer in 5 words.`
},

facebook: {
impressions: `FACEBOOK IMPRESSIONS SKILL:

MISSION: Maximize organic reach on Facebook by satisfying the Phase 1 AI pre-scorer, which predicts whether a post will generate "meaningful interactions." Critical structural insight: posts under 250 characters consistently outperform long-form on Facebook for reach rate. Unlike LinkedIn where long wins, Facebook users scroll fast — punchy and personal wins reach.

STRUCTURE:
- Under 250 chars: highest reach rate (for opinions and provocations)
- 250-800 chars: story-based posts
- Avoid posts over 1500 chars — this is not a long-form platform
- NO outbound links in body — 30-50% reach suppression. Move to first comment. If sharing a link, post a photo with commentary above, then link in comments.
- Personal Profile > Page: profiles get 3-5x more organic reach
- Groups: posting in a relevant Group gets 3-5x more reach than a Page post

DISTRIBUTION PHASES:
Phase 1 (30-60min): AI classifier pre-scores based on predicted comment depth and Messenger shares. Profiles get 3-5x more distribution than Pages.
Phase 2 (1-4hrs): Comment LENGTH > count. Reply-depth (threads within comments) weighted heavily. Messenger shares get maximum amplification.
Phase 3 (4-48hrs): Suggested feeds with social proof. Back-and-forth comment threads get exponential distribution.

HOOK PATTERNS (≤150 chars works best):
1) Conversational Provocation — "Can we talk about something nobody in [industry] wants to admit?"
2) Personal Admission — "I've been doing this wrong for 3 years and just figured it out."
3) Opinion Stake — one clear, debatable position. No hedging. "Cold calling is dead. Most sales teams just haven't accepted it yet."

BODY: Conversational, narrative. Write to ONE person. Short sentences, 1-3 line paragraphs. Personal stories outperform instructional content 3:1 on Facebook. Let the lesson be implied, not explained.

CTA: Specific question at the end that ANYONE can answer from their own experience. "Have you ever had a client say this to you?" > "What do you think?"

ANTI-PATTERNS:
- "Share if you agree" / "Like for X, comment for Y" / "Tag a friend who needs this" — Facebook's most explicitly penalized phrases
- Outbound links in post body — first comment only
- Clickbait phrasing ("You won't believe what happened next")
- Posting as a Page when a personal profile is available
- Any sentence that reads like marketing copy

90+ SCORE: Short enough to read in one glance. Clear opinion or personal hook. No links in body. Zero engagement-bait phrases. Would pass Facebook's pre-scorer as a "meaningful interaction" candidate.`,

likes: `FACEBOOK LIKES & REACTIONS SKILL:

MISSION: Write content that triggers emotional reactions across Facebook's full range (Love, Haha, Wow, Sad, Angry — not just Like). Diverse reactions signal deep emotional resonance to the algorithm and trigger wider distribution. Facebook is the warmest, most emotionally-driven platform — sincere personal stories outperform clever professional observations by 3:1.

REACTION MECHANICS:
- Love: Warm achievement, touching human moment, admiration
- Haha: Relatable frustration with humor, workplace absurdity, self-deprecation
- Wow: Surprising outcome, data that defies expectations, unexpected twist
- Sad: Honest admission of struggle, loss, difficult journey
- Angry: Injustice story, system failure, "this shouldn't happen"
Diverse reactions (Love + Wow + Haha) signal deeper emotional impact than all-Likes.

STRUCTURE: 500-1200 chars. Write in scenes, not summaries. Named people, specific places — this happened to a real person, not a concept. End on the highest emotional note — no CTA, no lesson summary, no question at the end.

HOOK PATTERNS:
1) Scene-Opener — drop the reader into a specific moment. "My father called at 7am the day I signed my first contract."
2) Emotional Admission — the thing most people feel but don't say. "I almost quit last November. I haven't told many people that."
3) Unexpected Twist Setup — signal that what happened defied expectations. "I did everything right. It still fell apart."

BODY: Three acts — Setup (what was happening), Complication (what went wrong or surprised), Resolution or Reflection (what it meant). Stay in the scene throughout. Resist explaining the lesson — let the reader draw it. The more specific the detail, the more universal the feeling.

CTA: None in the post body. Optionally post a follow-up question as the first comment after publishing.

ANTI-PATTERNS:
- Abstract lessons without a personal story ("The key to success is persistence")
- Corporate or professional jargon — Facebook is the most personal platform
- Explaining the moral explicitly ("And that's when I realized...")
- "Hit Love if this resonates" — engagement bait suppression
- Writing in third person about yourself

90+ SCORE: Finish reading and feel something real — relief, warmth, humor, or nostalgia. Love or Wow reaction is the instinct. Thought of someone specific to send it to. Story happened in a real place to a real person with a specific detail that couldn't be invented.`,

followers: `FACEBOOK FOLLOWER GROWTH SKILL:

MISSION: Convert someone seeing this post into a Profile follower or Page follower. On Facebook, followers are earned through the Group-to-Profile pipeline (establish authority in Groups → community visits your profile → follows if they see consistent value) and through personal stories that combine expertise with humanity. Profile follows generate 3-5x more organic reach than Page follows.

STRUCTURE: 800-1800 chars. Personal story with professional lesson embedded — the story is the hook, the lesson is the follow trigger. Reference your consistency explicitly: "I document this every month" or "Third time I've noticed this pattern." End with a specific CTA about what they'll receive, not just that they should follow.

HOOK PATTERNS:
1) Long-form Story Hook — specific scene, lesson emerges naturally. "I lost a $200,000 contract in 2022 over one sentence in my proposal. I've been thinking about it since."
2) Local/Niche Authority — establish specific territory. "I've owned three restaurants in [city] for 12 years. Here's what the last 6 months actually looked like."
3) Process Reveal — show HOW you think, not just what you concluded. Real steps, real dead ends, real outcome.

BODY: Show the thinking process AND the failures before the success. Real numbers. Specific challenges. The failed attempt. Facebook followers follow people who feel like a trusted friend who's also deeply good at what they do. Expertise without warmth doesn't convert; warmth without expertise doesn't either.

GROUP PIPELINE: If active in relevant Facebook Groups, cross-post or reference Group discussions on your profile. Group posts reach pre-qualified audiences and drive profile visits.

CTA: Specific and earned. "I share behind-the-scenes posts like this every [day] — follow if you want more." In a Group: "I talk about this more on my profile if you want to follow along."

ANTI-PATTERNS:
- "Follow my page for more!" — reads as desperation
- Vague value promises ("I share valuable insights regularly")
- Content too polished or corporate — Facebook follows are emotional, not transactional
- Posting exclusively to a Page when a personal profile is available
- Advice without the personal story that earned it

90+ SCORE: Finish reading and feel like you know this person. They know their specific domain deeply and aren't afraid to show the messy parts. The CTA tells you exactly what you'll get. You can picture their next post.`,

engagement: `FACEBOOK ENGAGEMENT SKILL (COMMENTS, SHARES, SAVES):

PSYCHOLOGY: Facebook's ENTIRE algorithm is built around engagement — specifically "meaningful interactions." The 2018 algorithm overhaul made comment depth and share quality the primary distribution signals. Facebook is the BEST platform for comment-driven content because the platform actively rewards it.

COMMENT MECHANICS ON FACEBOOK:
- Long comments (3+ sentences) are weighted 5-10x more than short comments for distribution.
- Comment REPLIES (conversations within comments) are the strongest signal — a post with 10 comments that have 3 replies each outperforms a post with 50 standalone comments.
- Comments from people who don't usually interact with you signal BROAD appeal and trigger expanded distribution.
- First-hour comment velocity is critical — 5 meaningful comments in 60 minutes > 20 over 24 hours.

COMMENT-DRIVING PATTERNS:
1) THE STORY WITH A QUESTION: Tell a personal/professional story, then ask the reader about THEIR experience. "This happened to me last week at a client meeting. I'm curious — have you ever had to handle this?" — The story creates emotional investment, the question gives permission to respond.
2) THE DEBATE STARTER: Pose a professional dilemma with genuinely valid arguments on both sides. "I've been going back and forth: is it better to raise prices and lose some clients, or keep them low and stay overworked? I keep landing on different answers." — Both sides comment, and they reply to each other.
3) THE ADVICE REQUEST: Genuine questions get genuine responses on Facebook more than any other platform. "I'm trying to figure out [specific problem]. Here's what I've tried: [details]. What would you do?" — Specificity makes people feel qualified to help.
4) THE RECOMMENDATION THREAD: "What's one [book/tool/resource/habit] that actually changed how you [specific outcome]? I'll go first: [yours]." — "I'll go first" removes the friction of being the first commenter.
5) THE VULNERABLE CHECK-IN: "Honest question for anyone running a business: does anyone else feel like [specific struggle]? I keep thinking I'm the only one." — Creates safe space for long, personal responses.

SHARE MECHANICS ON FACEBOOK:
- Public shares create new distribution nodes — the post appears in the sharer's friends' feeds.
- Messenger shares (private) are weighted EXTREMELY heavily by the algorithm — they signal "this is worth a personal conversation."
- People share content that makes them look: helpful ("my friend needs this"), smart ("interesting perspective"), caring ("this matters"), or funny ("you'll love this").
- How-to content and resource lists are the most shared formats.
- Emotional stories with universal themes get shared with personal endorsements ("This is exactly right").

SHARE-KILLING MISTAKES:
- Content that's too personal to the poster to reshare (inside jokes, very specific contexts)
- Anything that could make the sharer look bad by association
- Engagement bait — Facebook actively penalizes "share if you agree" and similar phrases
- External links (suppressed 30-50% — if you must link, first comment)

STRUCTURE: 600-1500 chars. Conversational tone — write to ONE person. Build emotional momentum through the body. End with an open-ended question that ANYONE can answer from their own experience. Suggest the poster reply to every comment with a follow-up question to build thread depth.

SHARE MECHANICS:
- Messenger shares (private) are weighted extremely heavily — they signal "worth a personal conversation"
- People share content that makes them look: helpful, smart, caring, or funny
- How-to content and resource lists are the most-shared formats on Facebook
- Emotional stories with universal themes get shared with personal endorsements

ANTI-PATTERNS:
- "Share if you agree" / engagement bait — Facebook actively penalizes these
- External links in body — suppressed 30-50%, move to first comment
- Posts so personal to the poster they can't be reshared
- Not replying to early comments — every reply generates fresh engagement

GROUP ADVANTAGE: If active in relevant Facebook Groups, cross-post or reference Group discussions. Group posts get 3-5x more engagement than feed posts — the audience is pre-qualified and the culture is participatory.

90+ SCORE: 5+ long comments in the first hour with reply-depth within threads. Multiple Messenger shares. People responding to each other's comments, not just to the post. Engagement sustained by the poster's own replies.`
},

twitter: {
impressions: `X IMPRESSIONS SKILL:

MISSION: Maximize reach via the For You algorithmic feed, which requires passing a 15-30 minute velocity test (engagement-to-impression RATIO, not raw numbers). The structural insight: every outbound link in a tweet cuts reach by ~30-50%. For impressions, text-only or image-only tweets consistently outperform linked tweets. Thread format is the highest-ceiling format on X.

DISTRIBUTION PHASES:
Phase 1 (0-30min): Velocity test. Engagement/impression ratio vs. similar accounts. 15 likes from 100 impressions > 50 from 1000.
Phase 2 (30-120min): For You feed gate. Topic relevance + social graph proximity determine entry.
Phase 3 (2-24hrs): Viral loop — high-follower engagements create distribution nodes. Threads get re-served.
Phase 4 (2-7 days): Resurfaces in For You for users who didn't see it first time.

COMPRESSION ENGINE: Every word carries weight. Concrete > abstract. Active > passive. Numbers > adjectives. Names > categories. If you can remove a word without losing meaning, remove it.

HOOK PATTERNS:
1) Compressed Insight — one reframing observation in 1-2 sentences. Under 180 chars. Should be quotable.
2) Thread Hook — tweet #1 is the ad. "I spent 6 months reverse-engineering why some SaaS companies reach $1M ARR and most don't. Everything I found:" Strong enough to stop the scroll.
3) Contrarian Spike — provoke both sides of a real debate. Both agreement and disagreement are engagement.
4) Data Drop — surprising stat + counterintuitive result. State the finding without needing a link.

THREADS: 5-8 tweets. Each standalone-valuable. Never number tweets. Never "Thread 🧵" opener — both are content calendar tells.

NO LINKS IN BODY: If sharing a link, post it as a reply to your own tweet. Link in the tweet body cuts reach significantly.

ANTI-PATTERNS:
- Outbound links in tweet body — first reply only
- "Thread 🧵" openers
- Numbering tweets within a thread
- Identical content posted multiple times — X detects and suppresses
- Asking for retweets explicitly

90+ SCORE: Passes the 15-minute velocity test with a high ratio. For You feed picks it up. Has enough standalone value to be bookmarked AND retweeted by people who don't follow the account.`,

likes: `X LIKES SKILL:

MISSION: Write a tweet that earns a like from someone mid-scroll. On X, a like is public — it's selective endorsement and social positioning. Unlike Instagram likes (vibe-based), X likes are often given to tweets that make the liker look smart or discerning for agreeing. The benchmark: would someone screenshot this and send it to a friend?

STRUCTURE: 60-180 chars optimal. Remove every hedge ("I think," "probably," "kind of"). Remove all filler ("really," "very," "literally," "actually"). First 5 words determine everything — they're what appears in the timeline before anyone decides to read further.

HOOK/BODY PATTERNS (this IS the tweet for this goal):
1) Perfect Compression — pack an insight so densely it sounds inevitable. "Execution is just taste applied repeatedly."
2) Relatable Specific — so specific it feels like mind-reading. Not "remote work is lonely" but "the loneliest part of remote work is when something good happens and there's no one to tell."
3) Well-Earned Hot Take — strong opinion, defensible. Edgy but not inflammatory.
4) Status Observation — name a social dynamic nobody has articulated yet.
5) Industry Truth — what everyone in the space knows but doesn't say out loud.

TONE: Wit > wisdom. Compression above all. Lowercase is fine. Drop the final period. Contractions mandatory. "Shower thought" energy — sounds like a person, not a content calendar.

CTA: None. The like IS the response.

ANTI-PATTERNS:
- Hedges: "I think," "in my opinion," "probably" — removes conviction, removes likes
- Filler words: "really," "very," "literally," "actually"
- Ending with a question — shifts goal from likes to replies
- More than 200 chars for this goal
- "Thoughts?" or any engagement bait

90+ SCORE: Liked before finishing. Makes the liker look smart or relatable for agreeing. Under 150 chars. No hedges. Screenshot-worthy.`,

followers: `X FOLLOWER GROWTH SKILL:

MISSION: Convert someone seeing this tweet into a follower — specifically someone who's never seen the account before. On X, the #1 follower-growth format is THREADS. A well-constructed thread delivering real value converts readers to followers at 5-10x the rate of single tweets. The follow is triggered when someone thinks "this person knows things I don't — I want this in my feed."

STRUCTURE:
- Threads: 5-8 tweets. Hook tweet is the ad — strong enough to make someone read the whole thread.
- Hook tweet: 100-200 chars. No "Thread 🧵" — just the hook.
- Each tweet in thread: 150-280 chars, standalone-valuable. No filler tweets.
- Final tweet: soft CTA + preview of next thread or recurring format.
- Single tweets can also drive follows — but they need to be exceptional enough to trigger a profile visit.

HOOK PATTERNS:
1) Thread Hook — promise + intrigue. "I spent 6 months reverse-engineering why some founders reach $1M ARR and most don't. 8 patterns nobody talks about:"
2) Contrarian Thread — challenge a widely-held belief with evidence. "Everyone says to niche down early. I think that's wrong for most founders. Here's why:"
3) Build-in-Public — real metrics, real moment. "We crossed $10K MRR today. Exact breakdown of what worked and what was a complete waste of time:"

VOICE REQUIREMENT: X follows are voice-driven. The reader must hear a PERSON, not a content calendar. Pick one register and commit: fast and punchy, wry and precise, or earnestly contrarian. Consistency > volume.

PROFILE-CLICK BRIDGE: Strong tweet → curiosity about the person → profile scan → pattern in recent tweets → follow. Every tweet should make the reader curious about who's writing it.

CTA: Soft, at the end of the thread. "I share one thread like this per week — follow if you want the next one." Reference something specific to drive a profile visit.

ANTI-PATTERNS:
- "Follow me for more!" at the start of any tweet — strongest repellent on X
- Purely transitional tweets ("And here's where it gets interesting...")
- Numbering tweets in a thread — content calendar tell
- "Thread 🧵" opener — cliché that marks you as a content machine
- Purely informational threads with no opinion — bookmarked, not followed

90+ SCORE: Hook makes me read the whole thread. Every tweet delivers a standalone insight. I finish and immediately visit the profile. The CTA at the end feels like a natural invitation.`,

engagement: `X ENGAGEMENT SKILL (REPLIES, RETWEETS, BOOKMARKS):

PSYCHOLOGY: Engagement on X is FAST and PUBLIC. Every reply, retweet, and quote tweet is visible to both networks. This makes X engagement inherently viral — each interaction is a distribution event, not just a metric. The goal is to create tweets that people feel compelled to RESPOND TO, not just consume.

X-SPECIFIC ENGAGEMENT HIERARCHY:
- Quote tweets with commentary (HIGHEST value — creates new content + distribution to both audiences)
- Replies/threads that generate conversation (HIGH — back-and-forth visible to both followers)
- Retweets (MEDIUM — distributes to new network but no new content signal)
- Bookmarks (MEDIUM — strong algorithmic signal for For You, but private)
- Likes (LOWEST — counted but least impactful for distribution)

REPLY-DRIVING PATTERNS:
1) THE HOT TAKE WITH AN ESCAPE HATCH: State a strong opinion, then add "but I might be wrong about this." — The opinion attracts agreement AND disagreement, the escape hatch makes disagreeing feel safe. Both sides reply.
2) THE UNFINISHED THOUGHT: Tweet 80% of an insight and let the audience complete it. "The difference between a $50k and $500k business is usually just..." — People reply with THEIR answer, creating a thread of perspectives.
3) THE RANKING CHALLENGE: "Top 3 [things in your field], go." — Extremely low friction, high reply volume. Everyone has a ranking and everyone thinks theirs is right.
4) THE BINARY CHOICE: "Would you rather: [option A] or [option B]?" — Forces a choice, people justify their answer. Works best when both options have genuine trade-offs.
5) THE THREAD CLIFFHANGER: In a thread, end one tweet with a hook for the next. "But that's not the interesting part. The interesting part is what happened next →" — Drives replies from people who are impatient AND engagement on the thread itself.
6) THE QUOTE-TWEET BAIT: Share an observation so sharp that people want to add their own context. Tweets that start with "Underrated:" or "Overrated:" or "Nobody talks about:" — People quote-tweet to add their take, which is the highest-value engagement on X.

RETWEET-DRIVING TACTICS:
- Insight density: if a tweet packs more value per character than anything else in the feed, it gets retweeted.
- "I wish someone told me this" energy — content that makes the retweeter look generous for sharing.
- Data or stats that are surprising and shareable without additional context.
- One-liners that capture a feeling so precisely that the retweet IS the commentary.

BOOKMARK-DRIVING TACTICS:
- Tactical content: specific tools, frameworks, templates, step-by-step processes.
- Threads that serve as reference material — "everything I know about [topic]" threads get bookmarked heavily.
- Content people want to revisit but don't want to publicly endorse (contrarian takes, sensitive topics).

ENGAGEMENT-KILLING MISTAKES:
- Tweets that are too polished/complete — no room for the audience to add anything
- Asking "What do you think?" without giving them something specific to react to
- Threads that are purely informational with no opinion — they get bookmarked but not replied to
- Being preachy or moralistic — X culture punishes sanctimony hard
- Overusing the same engagement format — the audience catches on fast

STRUCTURE: Single tweets 100-280 chars. Threads 5-8 tweets. For engagement, the LAST LINE of a single tweet or the LAST TWEET of a thread is where the engagement hook lives. Build to it. Don't front-load the question.

REPLY STRATEGY: The poster's own replies are engagement multipliers. Suggest replying to early comments with genuine follow-ups, additional context, or "great point — I'd add..." to keep threads growing. Each reply is visible to both networks and counts as fresh engagement.`
}
};

/* ═══ SHARED VOICE RULES ═══ */
const VOICE = `YOUR WRITING PHILOSOPHY — NON-NEGOTIABLE:

NEVER USE (AI tells that get content ignored/mocked):
- Numbered lists as "1. [Bold word]: explanation" — #1 AI tell
- Corporate buzzwords: "leverage," "synergy," "unlock," "game-changer," "ecosystem," "deep dive," "unpack"
- AI clichés: "In today's fast-paced world," "Here's the thing," "Let me be honest," "It's not about X, it's about Y"
- Emoji bullets (🔥📈💡) or emoji as decoration
- "And that's [noun]." closers / "Most people don't realize..." / "[Claim]. And it's not even close."
- Motivational poster energy / Performative wisdom / Moral grandstanding
- Essay transitions (furthermore, additionally, moreover)
- Describing own content as "valuable" / "impactful" / "powerful"
- Perfect parallel structure — vary rhythm

INSTEAD:
- Sharpest person at dinner — casual authority, not performative
- Real opinions without hedging
- Own speech patterns, not templates
- Incomplete sentences sometimes. For emphasis. Like that.
- Trust the reader's intelligence — no over-explaining
- Contractions naturally (I'm, don't, it's)
- Mix sentence lengths
- White space is a weapon
- Every line earns its place
- Must pass "would I say this out loud?" test`;

/* ═══ GENERIC FALLBACK ═══ */
const GENERIC = {
  impressions: "Maximize reach via hooks, shareability, and algorithmic signals.",
  engagement: "Maximize engagement (comments, shares, saves) via conversation starters and interaction-compelling structures.",
  likes: "Maximize likes via relatability, emotional resonance, and instant recognition.",
  followers: "Maximize follower growth via authority, unique value, and compelling voice.",
};

/* ═══ SYSTEM PROMPT BUILDER ═══ */
const buildPrompt = (platform, goal, context, historyPosts) => {
  const c = P[platform];
  const skill = SKILLS[platform]?.[goal];
  const goalCtx = skill || `Optimization goal: ${GENERIC[goal]}`;
  const contextBlock = context?.trim()
    ? `\nAUTHOR'S INTENT: "${context.trim()}"\nUse this to inform every suggestion — keep optimizations aligned with what the author is trying to achieve.\n`
    : "";
  const historyBlock = historyPosts?.length
    ? `\nCONSISTENCY CONTEXT (Pro feature): The following are this author's recent posts on ${c.name}. Align the tone, voice, style, vocabulary, and content themes of your suggestions with these to maintain consistency across their feed:\n${historyPosts.map((p, i) => `[Post ${i + 1}]: ${p}`).join("\n")}\n`
    : "";

  return `You are an elite social media strategist specializing in ${c.name}.

${VOICE}

Platform: ${c.name}
Algorithm: ${c.algo}
Best practices: ${c.tips.join("; ")}
Character limit: ${c.max}
${contextBlock}${historyBlock}
${goalCtx}

OUTPUT: Return a JSON array of optimization suggestions. Each object:
- "section": "Hook/Opening"|"Body"|"Call to Action"|"Structure/Formatting"|"Overall Tone"|"Dwell Time & Pacing"|"Shareability"|"Voice & Authenticity"|"Authority Signal"|"Follow Trigger"|"Missing Element"
- "severity": "critical"|"important"|"polish"
- "current": specific text/element addressed
- "suggestion": exact recommended change
- "reasoning": 1-2 sentences on WHY referencing algorithm mechanics

Final object: "section":"Rewritten Post", "severity":"final", "current":"", "suggestion": full optimized post, "reasoning": brief priority note.

Return ONLY JSON array. No markdown, no backticks, no preamble.

RULES:
- PRESERVE THE CORE MESSAGE: Never change the central idea, opinion, story, or point of the post. The author's meaning, stance, and subject must remain fully intact. Only change HOW it is communicated, not WHAT is being said.
- 5-8 suggestions + rewrite. Be SPECIFIC — write exact changes. Order by impact. Reference platform mechanics.
- Rewrite must sound like a specific human with real experience.
- If a suggestion would alter the meaning or topic of the post, do not make it.`;
};

/* ═══ SEVERITY STYLES ═══ */
const SEV = {
  critical: { label: "Critical", bg: "#FEF2F2", border: "#FCA5A5", text: "#991B1B", dot: "#EF4444" },
  important: { label: "Important", bg: "#FFF7ED", border: "#FDBA74", text: "#9A3412", dot: "#F97316" },
  polish: { label: "Polish", bg: "#F0FDF4", border: "#86EFAC", text: "#166534", dot: "#22C55E" },
  final: { label: "Optimized", bg: "#EFF6FF", border: "#93C5FD", text: "#1E40AF", dot: "#3B82F6" },
};

const LOADING_SUB = {
  "linkedin-impressions": "Analyzing hook strength, dwell time, shareability, and Phase 1 distribution",
  "linkedin-likes": "Evaluating emotional resonance, sincerity signals, and reaction triggers",
  "linkedin-followers": "Assessing authority signals, consistency promise, and depth indicators",
  "instagram-impressions": "Analyzing first-line hooks, save triggers, share-to-DM potential, and Explore signals",
  "instagram-likes": "Evaluating visual-caption harmony, emotional resonance, and vibe calibration",
  "instagram-followers": "Assessing niche clarity, value density, voice magnetism, and follow triggers",
  "facebook-impressions": "Analyzing meaningful interaction signals, comment depth, and Messenger share triggers",
  "facebook-likes": "Evaluating communal resonance, reaction diversity, and emotional authenticity",
  "facebook-followers": "Assessing local authority signals, community value, and trust-building patterns",
  "twitter-impressions": "Analyzing compression density, For You eligibility, velocity, and bookmark triggers",
  "twitter-likes": "Evaluating first-5-word impact, conviction, compression, and screenshot-worthiness",
  "twitter-followers": "Assessing voice distinctiveness, iceberg signals, and profile-click triggers",
  "linkedin-engagement": "Analyzing comment triggers, share mechanics, reply depth signals, and conversation architecture",
  "instagram-engagement": "Evaluating save triggers, DM share potential, comment prompts, and carousel engagement patterns",
  "facebook-engagement": "Analyzing meaningful interaction signals, comment depth predictors, Messenger share triggers, and Group synergy",
  "twitter-engagement": "Evaluating reply triggers, quote-tweet bait, bookmark signals, and thread engagement architecture",
};

const GOAL_LABELS = { impressions: "Impressions & Reach", likes: "Likes & Reactions", followers: "Follower Growth", engagement: "Engagement (Comments, Shares)" };

/* ═══ HISTORY CARD ═══ */
function HistoryCard({ post, index }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const platColors = { linkedin: "#0A66C2", instagram: "#E1306C", facebook: "#1877F2", twitter: "#000" };
  const platNames = { linkedin: "LinkedIn", instagram: "Instagram", facebook: "Facebook", twitter: "X" };
  const goalNames = { impressions: "Impressions", likes: "Likes", followers: "Followers", engagement: "Engagement" };

  const copyPost = () => { navigator.clipboard.writeText(post.optimized); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const preview = expanded ? post.optimized : (post.optimized.slice(0, 200) + (post.optimized.length > 200 ? "…" : ""));

  return (
    <div className="hist-card" style={{ animationDelay: `${index * 0.05}s` }}>
      <div className="hist-card-top">
        <div className="hist-card-meta">
          <span className="hist-plat" style={{ background: platColors[post.platform] }}>{platNames[post.platform]}</span>
          <span className="hist-goal">{goalNames[post.goal]}</span>
        </div>
        <span className="hist-date">{post.date} · {post.time}</span>
      </div>
      <div className="hist-orig-label">Original draft</div>
      <div className="hist-orig">{post.original}</div>
      <div className="hist-orig-label">Optimized version</div>
      <div className="hist-optimized">{preview}</div>
      {post.optimized.length > 200 && (
        <button className="hist-expand" onClick={() => setExpanded(!expanded)}>{expanded ? "Show less" : "Show full post"}</button>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
        <span className="hist-stats">{post.suggestionCount} suggestion{post.suggestionCount !== 1 ? "s" : ""} applied</span>
        <button className="hist-copy" onClick={copyPost}>{copied ? "Copied ✓" : "Copy optimized post"}</button>
      </div>
    </div>
  );
}

/* ═══ MAIN COMPONENT ═══ */
export default function Home() {
  // Auth state
  const [authView, setAuthView] = useState("loading"); // "loading" | "login" | "signup" | "app"
  const [signupStep, setSignupStep] = useState(1);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ fullName: "", email: "", phone: "", industry: "", password: "", confirmPassword: "" });
  const [authError, setAuthError] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [userPlan, setUserPlan] = useState("free"); // "free" | "base" | "pro"
  const [showPaywall, setShowPaywall] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // App state
  const [page, setPage] = useState("optimizer");
  const [postHistory, setPostHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [draft, setDraft] = useState("");
  const [platform, setPlatform] = useState("linkedin");
  const [goal, setGoal] = useState("impressions");
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [postContext, setPostContext] = useState("");
  const [alignHistory, setAlignHistory] = useState(false);
  const [planExpiresAt, setPlanExpiresAt] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [editedRewrite, setEditedRewrite] = useState("");
  const textareaRef = useRef(null);
  const resultsRef = useRef(null);
  const fileRef = useRef(null);

  // ── Check for existing session on mount ──
  useEffect(() => {
    const checkSession = async () => {
      const supabase = getSupabase(); if (!supabase) { setAuthView("login"); return; }
      try {
        const sessionRes = await supabase.auth.getSession();
        const session = sessionRes?.data?.session;
        if (session) {
          setAuthView("app");
          // Load profile
          const profileRes = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
          const profile = profileRes?.data;
          if (profile) {
            setUserPlan(profile.plan || "free");
            setPlanExpiresAt(profile.plan_expires_at || null);
            setSignupForm(prev => ({
              ...prev,
              fullName: profile.full_name || session.user.user_metadata?.full_name || "",
              email: profile.email || session.user.email || "",
              industry: profile.industry || "",
            }));
            setLoginForm(prev => ({ ...prev, email: session.user.email || "" }));
          }
          // Load post history
          const postsRes = await supabase.from("post_history").select("*").order("created_at", { ascending: false });
          const posts = postsRes?.data;
          if (posts) {
            setPostHistory(posts.map(p => ({
              id: p.id,
              created_at: p.created_at,
              date: new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
              time: new Date(p.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
              platform: p.platform,
              goal: p.goal,
              original: p.original_draft.slice(0, 120) + (p.original_draft.length > 120 ? "\u2026" : ""),
              optimized: p.optimized_post || "",
              suggestionCount: p.suggestion_count,
            })));
          }
        } else {
          setAuthView("login");
        }
      } catch (err) {
        console.error("Session check failed:", err);
        setAuthView("login");
      }
    };
    checkSession();
  }, []);

  const cfg = P[platform];
  const charCount = draft.length;
  const overLimit = charCount > cfg.max;
  const hasSkill = !!SKILLS[platform]?.[goal];
  const loadKey = `${platform}-${goal}`;

  // Usage indicator derived values
  const effectivePlanNow = planExpiresAt && new Date() >= new Date(planExpiresAt) ? "free" : userPlan;
  const now_ = new Date();
  const monthStart_ = new Date(now_.getFullYear(), now_.getMonth(), 1);
  const postsThisMonth_ = postHistory.filter(p => p.created_at && new Date(p.created_at) >= monthStart_).length;
  const usageLimit = effectivePlanNow === "free" ? 3 : effectivePlanNow === "base" ? 50 : effectivePlanNow === "pro" ? 150 : null;
  const usageCount = effectivePlanNow === "free" ? postHistory.length : postsThisMonth_;
  const usageRemaining = usageLimit !== null ? usageLimit - usageCount : null;

  useEffect(() => {
    if (suggestions && resultsRef.current) resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [suggestions]);

  // Refresh plan from DB when the tab regains focus (catches upgrades that happened server-side)
  useEffect(() => {
    const refreshPlan = async () => {
      const supabase = getSupabase();
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data: profile } = await supabase.from("profiles").select("plan, plan_expires_at").eq("id", session.user.id).single();
      if (profile) {
        setUserPlan(profile.plan || "free");
        setPlanExpiresAt(profile.plan_expires_at || null);
      }
    };
    const onFocus = () => { if (authView === "app") refreshPlan(); };
    const onVisibility = () => { if (document.visibilityState === "visible") onFocus(); };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
    };
  }, [authView]);

  // Also refresh plan when navigating to settings
  useEffect(() => {
    if (page !== "settings" || authView !== "app") return;
    const refreshPlan = async () => {
      const supabase = getSupabase();
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data: profile } = await supabase.from("profiles").select("plan, plan_expires_at").eq("id", session.user.id).single();
      if (profile) {
        setUserPlan(profile.plan || "free");
        setPlanExpiresAt(profile.plan_expires_at || null);
      }
    };
    refreshPlan();
  }, [page, authView]);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    const pending = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        pending.push({
          name: file.name, type: file.type, size: file.size,
          base64: ev.target.result.split(",")[1],
          isImage: file.type.startsWith("image/"),
          isPdf: file.type === "application/pdf",
          preview: file.type.startsWith("image/") ? ev.target.result : null,
        });
        if (pending.length === files.length) setAttachments((prev) => [...prev, ...pending]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const fmtSize = (b) => b < 1024 ? b + " B" : b < 1048576 ? (b / 1024).toFixed(1) + " KB" : (b / 1048576).toFixed(1) + " MB";

  const analyze = async () => {
    if (!draft.trim()) return;
    // Always fetch the latest plan from DB before rate-limiting so upgrades are reflected immediately
    let currentPlan = userPlan;
    let currentExpiresAt = planExpiresAt;
    try {
      const supabase = getSupabase();
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: profile } = await supabase.from("profiles").select("plan, plan_expires_at").eq("id", session.user.id).single();
          if (profile) {
            currentPlan = profile.plan || "free";
            currentExpiresAt = profile.plan_expires_at || null;
            setUserPlan(currentPlan);
            setPlanExpiresAt(currentExpiresAt);
          }
        }
      }
    } catch (_) {}
    // Rate limiting / paywall check using live plan data
    const effectivePlan = currentExpiresAt && new Date() >= new Date(currentExpiresAt) ? "free" : currentPlan;
    if (effectivePlan === "free") {
      if (postHistory.length >= 3) { setShowPaywall(true); return; }
    } else if (effectivePlan === "base" || effectivePlan === "pro") {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const postsThisMonth = postHistory.filter(p => p.created_at && new Date(p.created_at) >= monthStart);
      const limit = effectivePlan === "pro" ? 150 : 50;
      if (postsThisMonth.length >= limit) { setShowPaywall(true); return; }
    }
    // "enterprise" has no limit
    setLoading(true); setError(null); setSuggestions(null);
    try {
      const content = [];
      attachments.forEach((a) => {
        if (a.isImage) content.push({ type: "image", source: { type: "base64", media_type: a.type, data: a.base64 } });
        else if (a.isPdf) content.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: a.base64 } });
      });
      const attCtx = attachments.length > 0
        ? `\n\n[ATTACHMENTS: ${attachments.length} file(s): ${attachments.map(a => a.isImage ? `image (${a.name})` : a.isPdf ? `PDF/carousel (${a.name})` : `file (${a.name})`).join(", ")}. Analyze visual content and optimize caption to complement it.]`
        : "";
      content.push({ type: "text", text: draft + attCtx });

      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-opus-4-5-20251101",
          max_tokens: 4000,
          system: buildPrompt(platform, goal, postContext, alignHistory ? postHistory.filter(p => p.platform === platform && p.optimized).slice(0, 5).map(p => p.optimized) : null),
          messages: [{ role: "user", content: content.length === 1 ? draft + attCtx : content }],
        }),
      });
      const data = await res.json();
      const text = data.content.map((b) => b.type === "text" ? b.text : "").join("");
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setSuggestions(parsed);
      // Save to local state
      const rw = parsed.find((s) => s.severity === "final");
      if (rw) setEditedRewrite(rw.suggestion);
      setPostHistory((prev) => [{
        id: Date.now(),
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        platform,
        goal,
        original: draft.slice(0, 120) + (draft.length > 120 ? "\u2026" : ""),
        optimized: rw?.suggestion || "",
        suggestionCount: parsed.filter((s) => s.severity !== "final").length,
      }, ...prev]);
      // Save to Supabase
      try {
        const supabase = getSupabase(); if (supabase) {
          const userRes = await supabase.auth.getUser();
          const user = userRes?.data?.user;
          if (user) {
            await supabase.from("post_history").insert({
              user_id: user.id,
              platform,
              goal,
              original_draft: draft,
              optimized_post: rw?.suggestion || "",
              suggestions: parsed,
              suggestion_count: parsed.filter((s) => s.severity !== "final").length,
            });
          }
        }
      } catch (dbErr) { console.error("Failed to save to database:", dbErr); }
    } catch (err) {
      console.error(err);
      setError("Analysis failed — check your connection and try again.");
    } finally { setLoading(false); }
  };

  const copy = (t) => { navigator.clipboard.writeText(t); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const rewrite = suggestions?.find((s) => s.severity === "final");
  const items = suggestions?.filter((s) => s.severity !== "final") || [];

  // ── Auth handlers ──
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    if (!loginForm.email || !loginForm.password) { setAuthError("Please fill in all fields."); return; }
    if (!/\S+@\S+\.\S+/.test(loginForm.email)) { setAuthError("Please enter a valid email address."); return; }
    try {
      const supabase = getSupabase(); if (!supabase) { setAuthError("Service unavailable. Please try again later."); return; }
      const authRes = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });
      if (authRes.error) { setAuthError(authRes.error.message); return; }
      const user = authRes.data?.user;
      // Load profile
      const profileRes = await supabase.from("profiles").select("*").eq("id", user.id).single();
      const profile = profileRes?.data;
      if (profile) {
        setUserPlan(profile.plan || "free");
        setPlanExpiresAt(profile.plan_expires_at || null);
        setSignupForm(prev => ({
          ...prev,
          fullName: profile.full_name || user.user_metadata?.full_name || "",
          email: profile.email || user.email || "",
          industry: profile.industry || "",
        }));
      }
      // Load post history
      const postsRes = await supabase.from("post_history").select("*").order("created_at", { ascending: false });
      const posts = postsRes?.data;
      if (posts) {
        setPostHistory(posts.map(p => ({
          id: p.id,
          created_at: p.created_at,
          date: new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          time: new Date(p.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          platform: p.platform,
          goal: p.goal,
          original: p.original_draft.slice(0, 120) + (p.original_draft.length > 120 ? "\u2026" : ""),
          optimized: p.optimized_post || "",
          suggestionCount: p.suggestion_count,
        })));
      }
      setAuthView("app");
    } catch (err) {
      setAuthError("Login failed. Please try again.");
    }
  };

  const handleSignupNext = (e) => {
    e.preventDefault();
    setAuthError("");
    if (!signupForm.fullName.trim()) { setAuthError("Please enter your full name."); return; }
    if (!signupForm.email.trim() || !/\S+@\S+\.\S+/.test(signupForm.email)) { setAuthError("Please enter a valid email address."); return; }
    if (!signupForm.industry.trim()) { setAuthError("Please enter your industry or job title."); return; }
    setSignupStep(2);
  };

  const handleSignupComplete = async (e) => {
    e.preventDefault();
    setAuthError("");
    if (!signupForm.password) { setAuthError("Please create a password."); return; }
    if (signupForm.password.length < 8) { setAuthError("Password must be at least 8 characters."); return; }
    if (signupForm.password !== signupForm.confirmPassword) { setAuthError("Passwords do not match."); return; }
    if (!termsAccepted) { setAuthError("Please read and accept the Terms of Use to continue."); return; }
    try {
      const supabase = getSupabase(); if (!supabase) { setAuthError("Service unavailable. Please try again later."); return; }
      const authRes = await supabase.auth.signUp({
        email: signupForm.email,
        password: signupForm.password,
        options: {
          data: {
            full_name: signupForm.fullName,
            phone: signupForm.phone,
            industry: signupForm.industry,
          },
        },
      });
      if (authRes.error) { setAuthError(authRes.error.message); return; }
      const newUser = authRes.data?.user;
      if (newUser) {
        await supabase.from("profiles").upsert({
          id: newUser.id,
          full_name: signupForm.fullName,
          email: signupForm.email,
          phone: signupForm.phone || null,
          industry: signupForm.industry,
          plan: "free",
        }, { onConflict: "id" });
        setUserPlan("free");
        // Send welcome email (fire-and-forget)
        fetch("/api/send-welcome", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: signupForm.email, fullName: signupForm.fullName }),
        }).catch(() => {});
      }
      setAuthView("app");
    } catch (err) {
      setAuthError("Signup failed. Please try again.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setAuthError("");
    if (!resetEmail.trim() || !/\S+@\S+\.\S+/.test(resetEmail)) { setAuthError("Please enter a valid email address."); return; }
    try {
      const supabase = getSupabase(); if (!supabase) { setAuthError("Service unavailable. Please try again later."); return; }
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) { setAuthError(error.message); return; }
      setResetSent(true);
    } catch (err) {
      setAuthError("Failed to send reset email. Please try again.");
    }
  };

  const eyeIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
  const eyeOffIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  // ── Loading screen while checking session ──
  if (authView === "loading") {
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#FAFAF9", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <img src={LOGO_SRC} alt="Postyn.ai" style={{ height: 80, marginBottom: 16 }} />
          <div style={{ fontSize: 14, color: "#78716C" }}>Loading...</div>
        </div>
      </div>
    );
  }

  // ── Auth pages ──
  if (authView !== "app") {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
.auth-root{font-family:'DM Sans',sans-serif;min-height:100vh;background:#FAFAF9;display:flex;align-items:center;justify-content:center;padding:24px}
.auth-card{width:100%;max-width:440px;background:#fff;border:1px solid #E7E5E4;border-radius:16px;padding:40px 36px;box-shadow:0 4px 24px rgba(28,25,23,0.06)}
.auth-logo-row{display:flex;align-items:center;justify-content:center;gap:0;margin-bottom:8px}
.auth-logo{height:100px;width:auto}
.auth-brand{font-family:'Instrument Serif',serif;font-size:30px;font-weight:400;color:#1C1917;margin-left:-24px}
.auth-subtitle{text-align:center;font-size:15px;color:#78716C;margin-bottom:32px;line-height:1.5}
.auth-field{margin-bottom:18px}
.auth-label{display:block;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:#A8A29E;margin-bottom:6px}
.auth-input-wrap{position:relative}
.auth-input{width:100%;padding:12px 14px;border:1.5px solid #E7E5E4;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:14px;color:#1C1917;outline:none;transition:border-color .15s;background:#FAFAF9}
.auth-input:focus{border-color:#A8A29E;background:#fff}
.auth-input::placeholder{color:#D6D3D1}
.auth-input.has-eye{padding-right:44px}
.auth-eye{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:#A8A29E;cursor:pointer;padding:2px;display:flex}
.auth-eye:hover{color:#78716C}
.auth-optional{font-size:11px;color:#D6D3D1;font-weight:400;text-transform:none;letter-spacing:0;margin-left:6px;font-family:'DM Sans',sans-serif}
.auth-btn{width:100%;padding:14px;border:none;border-radius:10px;background:#1C1917;color:#fff;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:all .15s;margin-top:8px}
.auth-btn:hover{background:#292524;transform:translateY(-1px);box-shadow:0 4px 12px rgba(28,25,23,0.15)}
.auth-btn:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none}
.auth-switch{text-align:center;margin-top:20px;font-size:13px;color:#78716C}
.auth-switch a{color:#1C1917;font-weight:600;text-decoration:none;cursor:pointer}
.auth-switch a:hover{text-decoration:underline}
.auth-err{padding:10px 14px;background:#FEF2F2;border:1px solid #FCA5A5;border-radius:8px;color:#991B1B;font-size:13px;margin-bottom:18px;animation:fu .2s ease}
.auth-step-row{display:flex;gap:8px;margin-bottom:28px}
.auth-step{flex:1;height:4px;border-radius:2px;background:#E7E5E4;transition:background .3s}
.auth-step.active{background:#1C1917}
.auth-back{display:inline-flex;align-items:center;gap:6px;background:none;border:none;font-family:'DM Sans',sans-serif;font-size:13px;color:#78716C;cursor:pointer;margin-bottom:16px;padding:0}
.auth-back:hover{color:#1C1917}
.auth-divider{display:flex;align-items:center;gap:12px;margin:20px 0}
.auth-divider-line{flex:1;height:1px;background:#E7E5E4}
.auth-divider-text{font-size:11px;color:#A8A29E;text-transform:uppercase;letter-spacing:.08em;font-family:'JetBrains Mono',monospace}
.auth-info-note{font-size:12px;color:#A8A29E;text-align:center;margin-top:12px;line-height:1.5}
.terms-wrap{margin-top:16px;margin-bottom:4px}
.terms-scroll{max-height:140px;overflow-y:auto;background:#F5F5F4;border:1px solid #E7E5E4;border-radius:8px;padding:12px 14px;font-size:12px;color:#57534E;line-height:1.6;margin-bottom:10px}
.terms-scroll p{margin:0 0 8px}
.terms-scroll p:last-child{margin-bottom:0}
.terms-check-row{display:flex;align-items:flex-start;gap:8px;cursor:pointer;font-size:13px;color:#1C1917;line-height:1.4}
.terms-check-row input[type=checkbox]{width:15px;height:15px;min-width:15px;margin-top:1px;accent-color:#1C1917;cursor:pointer}
.auth-username-display{padding:12px 14px;border:1.5px solid #E7E5E4;border-radius:10px;background:#F5F5F4;font-size:14px;color:#78716C;font-family:'DM Sans',sans-serif;width:100%}
@keyframes fu{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:480px){.auth-card{padding:28px 24px}.auth-logo{height:72px}.auth-brand{font-size:24px;margin-left:-18px}}
        `}</style>

        <div className="auth-root">
          <div className="auth-card">
            <div className="auth-logo-row">
              <img src={LOGO_SRC} alt="Postyn.ai" className="auth-logo" />
              <span className="auth-brand">Postyn.ai</span>
            </div>

            {authView === "login" && (
              <>
                <p className="auth-subtitle">Sign in to optimize your posts.</p>
                {authError && <div className="auth-err">{authError}</div>}
                <div className="auth-field">
                  <label className="auth-label">Email</label>
                  <input className="auth-input" type="email" placeholder="you@company.com" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Password</label>
                  <div className="auth-input-wrap">
                    <input className="auth-input has-eye" type={showLoginPass ? "text" : "password"} placeholder="Enter your password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
                    <button className="auth-eye" onClick={() => setShowLoginPass(!showLoginPass)} type="button">{showLoginPass ? eyeOffIcon : eyeIcon}</button>
                  </div>
                </div>
                <button className="auth-btn" onClick={handleLogin}>Sign In</button>
                <p className="auth-switch" style={{marginTop:12}}><a onClick={() => { setAuthView("reset"); setAuthError(""); setResetSent(false); setResetEmail(""); }}>Forgot your password?</a></p>
                <p className="auth-switch">Don't have an account? <a onClick={() => { setAuthView("signup"); setSignupStep(1); setAuthError(""); }}>Create one</a></p>
              </>
            )}

            {authView === "signup" && signupStep === 1 && (
              <>
                <p className="auth-subtitle">Let's get to know you first.</p>
                <div className="auth-step-row">
                  <div className="auth-step active" />
                  <div className="auth-step" />
                </div>
                {authError && <div className="auth-err">{authError}</div>}
                <div className="auth-field">
                  <label className="auth-label">Full Name</label>
                  <input className="auth-input" type="text" placeholder="Jane Smith" value={signupForm.fullName} onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })} />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Email</label>
                  <input className="auth-input" type="email" placeholder="you@company.com" value={signupForm.email} onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })} />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Phone Number <span className="auth-optional">Optional</span></label>
                  <input className="auth-input" type="tel" placeholder="(555) 123-4567" value={signupForm.phone} onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })} />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Industry or Job Title</label>
                  <input className="auth-input" type="text" placeholder="e.g. Marketing, Real Estate, SaaS Founder" value={signupForm.industry} onChange={(e) => setSignupForm({ ...signupForm, industry: e.target.value })} />
                </div>
                <button className="auth-btn" onClick={handleSignupNext}>Continue</button>
                <p className="auth-switch">Already have an account? <a onClick={() => { setAuthView("login"); setAuthError(""); }}>Sign in</a></p>
              </>
            )}

            {authView === "signup" && signupStep === 2 && (
              <>
                <button className="auth-back" onClick={() => { setSignupStep(1); setAuthError(""); }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 12L6 8l4-4"/></svg>
                  Back
                </button>
                <p className="auth-subtitle">Create your account credentials.</p>
                <div className="auth-step-row">
                  <div className="auth-step active" />
                  <div className="auth-step active" />
                </div>
                {authError && <div className="auth-err">{authError}</div>}
                <div className="auth-field">
                  <label className="auth-label">Username</label>
                  <div className="auth-username-display">{signupForm.email}</div>
                  <p className="auth-info-note">Your email is your username</p>
                </div>
                <div className="auth-field">
                  <label className="auth-label">Password</label>
                  <div className="auth-input-wrap">
                    <input className="auth-input has-eye" type={showSignupPass ? "text" : "password"} placeholder="At least 8 characters" value={signupForm.password} onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })} />
                    <button className="auth-eye" onClick={() => setShowSignupPass(!showSignupPass)} type="button">{showSignupPass ? eyeOffIcon : eyeIcon}</button>
                  </div>
                </div>
                <div className="auth-field">
                  <label className="auth-label">Confirm Password</label>
                  <div className="auth-input-wrap">
                    <input className="auth-input has-eye" type={showConfirmPass ? "text" : "password"} placeholder="Re-enter your password" value={signupForm.confirmPassword} onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                      style={signupForm.confirmPassword && signupForm.password !== signupForm.confirmPassword ? { borderColor: "#FCA5A5" } : signupForm.confirmPassword && signupForm.password === signupForm.confirmPassword ? { borderColor: "#86EFAC" } : {}} />
                    <button className="auth-eye" onClick={() => setShowConfirmPass(!showConfirmPass)} type="button">{showConfirmPass ? eyeOffIcon : eyeIcon}</button>
                  </div>
                  {signupForm.confirmPassword && signupForm.password === signupForm.confirmPassword && (
                    <p style={{ fontSize: 12, color: "#22C55E", marginTop: 4 }}>Passwords match</p>
                  )}
                  {signupForm.confirmPassword && signupForm.password !== signupForm.confirmPassword && (
                    <p style={{ fontSize: 12, color: "#EF4444", marginTop: 4 }}>Passwords do not match</p>
                  )}
                </div>
                <div className="terms-wrap">
                  <div className="terms-scroll">
                    <p><strong>Terms of Use &amp; Disclaimer</strong></p>
                    <p>By creating an account on Postyn.ai, you acknowledge and agree to the following:</p>
                    <p><strong>No Guarantee of Results.</strong> Postyn.ai provides AI-generated suggestions to help optimize social media posts. We do not guarantee any specific results, including but not limited to increased impressions, engagement, follower growth, likes, or any business outcome. Results vary by account, audience, platform algorithm, and content.</p>
                    <p><strong>Content Responsibility.</strong> You are solely responsible for all content you create, edit, and publish using Postyn.ai. Postyn.ai is a writing assistance tool only. We do not review, moderate, or approve content before it is published. You are responsible for ensuring your posts comply with the terms of service of any platform you post to, as well as all applicable laws and regulations.</p>
                    <p><strong>No Liability.</strong> Postyn.ai, its owners, employees, and affiliates are not liable for any direct, indirect, incidental, or consequential damages resulting from your use of this service or from content you publish. This includes but is not limited to account suspensions, loss of followers, reputational harm, or business losses.</p>
                    <p><strong>AI Limitations.</strong> Suggestions generated by Postyn.ai are produced by AI and may be inaccurate, incomplete, or not suitable for your specific situation. Always apply your own judgment before publishing.</p>
                    <p><strong>Platform Independence.</strong> Postyn.ai is not affiliated with, endorsed by, or partnered with LinkedIn, Instagram, Facebook, X (Twitter), or any other social media platform.</p>
                  </div>
                  <label className="terms-check-row">
                    <input type="checkbox" checked={termsAccepted} onChange={e => { setTermsAccepted(e.target.checked); if (authError) setAuthError(""); }} />
                    <span>I have read and agree to the Terms of Use &amp; Disclaimer</span>
                  </label>
                </div>
                <button className="auth-btn" onClick={handleSignupComplete}>Create Account</button>
                <p className="auth-switch">Already have an account? <a onClick={() => { setAuthView("login"); setAuthError(""); }}>Sign in</a></p>
              </>
            )}

            {authView === "reset" && (
              <>
                <button className="auth-back" onClick={() => { setAuthView("login"); setAuthError(""); setResetSent(false); }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 12L6 8l4-4"/></svg>
                  Back to sign in
                </button>
                {resetSent ? (
                  <>
                    <p className="auth-subtitle" style={{textAlign:"left"}}>Check your email</p>
                    <div style={{background:"#F0FDF4",border:"1px solid #86EFAC",borderRadius:10,padding:"16px 18px",fontSize:14,color:"#166534",lineHeight:1.6,marginBottom:20}}>
                      We sent a password reset link to <strong>{resetEmail}</strong>. Check your inbox and follow the link to set a new password.
                    </div>
                    <p className="auth-info-note">Didn't get it? Check your spam folder or <a style={{color:"#1C1917",cursor:"pointer",textDecoration:"underline"}} onClick={() => setResetSent(false)}>try again</a>.</p>
                  </>
                ) : (
                  <>
                    <p className="auth-subtitle">Enter your email and we'll send you a reset link.</p>
                    {authError && <div className="auth-err">{authError}</div>}
                    <div className="auth-field">
                      <label className="auth-label">Email</label>
                      <input className="auth-input" type="email" placeholder="you@company.com" value={resetEmail} onChange={e => setResetEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleResetPassword(e)} />
                    </div>
                    <button className="auth-btn" onClick={handleResetPassword}>Send Reset Link</button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  // ── Main app ──
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
.app-layout{font-family:'DM Sans',sans-serif;display:flex;min-height:100vh;background:#FAFAF9;color:#1C1917}

/* ── Sidebar ── */
.sidebar{width:240px;background:#fff;border-right:1px solid #E7E5E4;display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:50;transition:transform .25s ease}
.sidebar.closed{transform:translateX(-240px)}
.sb-header{padding:20px 20px 16px;border-bottom:1px solid #E7E5E4;display:flex;align-items:center;gap:0}
.sb-logo{height:52px;width:auto}
.sb-brand{font-family:'Instrument Serif',serif;font-size:18px;font-weight:400;color:#1C1917;margin-left:-12px}
.sb-nav{flex:1;padding:12px;display:flex;flex-direction:column;gap:4px}
.sb-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;border:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;color:#78716C;cursor:pointer;transition:all .15s;text-align:left;width:100%}
.sb-item:hover{background:#F5F5F4;color:#57534E}
.sb-item.active{background:#F5F5F4;color:#1C1917;font-weight:600}
.sb-item svg{flex-shrink:0}
.sb-footer{padding:12px;border-top:1px solid #E7E5E4}
.sb-user{display:flex;align-items:center;gap:10px;padding:8px 12px;margin-bottom:8px}
.sb-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#E1306C,#0A66C2);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:#fff}
.sb-user-info{flex:1;min-width:0}
.sb-user-name{font-size:13px;font-weight:600;color:#1C1917;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sb-user-email{font-size:11px;color:#A8A29E;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sb-signout{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;border:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:#A8A29E;cursor:pointer;transition:all .15s;width:100%;text-align:left}
.sb-signout:hover{background:#FEF2F2;color:#991B1B}

/* ── Main content ── */
.main-wrap{flex:1;margin-left:240px;transition:margin-left .25s ease}
.main-wrap.expanded{margin-left:0}
.sb-toggle{position:fixed;top:16px;left:16px;z-index:51;width:36px;height:36px;border-radius:8px;border:1px solid #E7E5E4;background:#fff;display:none;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.sb-toggle:hover{background:#F5F5F4}
.sb-toggle.show{display:flex}

.root{min-height:100vh;background:#FAFAF9;color:#1C1917}
.hdr{padding:0;border-bottom:1px solid #E7E5E4;background:#FAFAF9}
.hdr-inner{max-width:800px;margin:0 auto;padding:20px 32px 32px;text-align:center}
.hdr-bar{display:flex;align-items:center;gap:0;margin-bottom:4px;width:100%;justify-content:space-between}
.hdr-actions{display:flex;align-items:center;gap:8px;margin-left:auto}
.hdr-ghost-btn{padding:7px 14px;background:transparent;color:#78716C;border:1px solid #E7E5E4;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;text-decoration:none;transition:all .15s;white-space:nowrap}
.hdr-ghost-btn:hover{background:#F5F5F4;color:#1C1917;border-color:#D6D3D1}
.upgrade-btn{padding:8px 18px;background:#7C3AED;color:#fff;border:none;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:background .15s;white-space:nowrap}
.upgrade-btn:hover{background:#6D28D9}
.hdr-logo{height:160px;width:auto;display:block}
.hdr-brand{font-family:'Instrument Serif',serif;font-size:38px;font-weight:400;color:#1C1917;letter-spacing:-0.01em;margin-left:-40px}
.hdr-t{font-family:'Instrument Serif',serif;font-size:40px;font-weight:400;line-height:1.1;color:#1C1917;margin-bottom:8px}
.hdr-s{font-size:15px;color:#78716C;line-height:1.5;max-width:560px;margin:0 auto}
.main{max-width:800px;margin:0 auto;padding:32px}
.row{display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap}
.grp{flex:1;min-width:180px}
.lbl{font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:#A8A29E;margin-bottom:6px}
.pbtn-row{display:flex;gap:6px}
.pbtn{flex:1;padding:10px 8px;border:1.5px solid #E7E5E4;border-radius:8px;background:#fff;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;text-align:center;color:#57534E}
.pbtn:hover{border-color:#D6D3D1;background:#F5F5F4}
.pbtn.on{border-color:var(--pc);background:var(--pc);color:#fff;box-shadow:0 2px 8px color-mix(in srgb,var(--pc) 30%,transparent)}
.sel{width:100%;padding:10px 12px;border:1.5px solid #E7E5E4;border-radius:8px;background:#fff url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%2378716C' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 12px center;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:#1C1917;cursor:pointer;appearance:none}
.skill-badge{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;background:linear-gradient(135deg,#F0FDF4,#ECFDF5);border:1px solid #86EFAC;border-radius:8px;margin-bottom:16px}
.skill-dot{width:8px;height:8px;border-radius:50%;background:#22C55E;animation:pulse 2s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(34,197,94,.4)}50%{opacity:.8;box-shadow:0 0 0 6px rgba(34,197,94,0)}}
.skill-txt{font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:#166534}
.info-tog{display:inline-flex;align-items:center;gap:6px;margin-bottom:20px;padding:6px 12px;background:transparent;border:1px solid #E7E5E4;border-radius:6px;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.05em;text-transform:uppercase;color:#78716C;cursor:pointer;transition:all .15s}
.info-tog:hover{background:#F5F5F4;color:#57534E}
.info-panel{background:#fff;border:1px solid #E7E5E4;border-radius:10px;padding:20px;margin-bottom:24px;animation:slideD .2s ease}
@keyframes slideD{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
.info-panel h4{font-size:14px;font-weight:600;margin-bottom:12px}
.info-panel li{font-size:13px;color:#57534E;line-height:1.6;margin-bottom:4px;list-style:none;padding-left:16px;position:relative}
.info-panel li::before{content:'→';position:absolute;left:0;color:#A8A29E}
.algo-note{margin-top:14px;padding:12px;background:#FAFAF9;border-radius:6px;font-size:12px;color:#78716C;line-height:1.5;font-style:italic}
.ta-wrap{position:relative;margin-bottom:16px}
.ta{width:100%;min-height:200px;padding:20px;border:1.5px solid #E7E5E4;border-radius:10px;background:#fff;font-family:'DM Sans',sans-serif;font-size:15px;line-height:1.65;color:#1C1917;resize:vertical;transition:border-color .15s;outline:none}
.ta:focus{border-color:#A8A29E}
.ta::placeholder{color:#D6D3D1}
.cc{position:absolute;bottom:12px;right:16px;font-family:'JetBrains Mono',monospace;font-size:11px;color:#A8A29E}
.cc.over{color:#EF4444;font-weight:600}
.att-row{display:flex;align-items:center;gap:12px;margin-bottom:16px}
.att-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;background:#fff;border:1.5px dashed #D6D3D1;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:#57534E;cursor:pointer;transition:all .15s}
.att-btn:hover{border-color:#A8A29E;background:#F5F5F4;color:#1C1917}
.att-hint{font-size:11px;color:#A8A29E;font-style:italic}
.ctx-wrap{margin-bottom:16px}
.ctx-label{display:flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:#A8A29E;margin-bottom:6px}
.ctx-optional{font-family:'DM Sans',sans-serif;font-size:11px;font-weight:400;text-transform:none;letter-spacing:0;color:#D6D3D1}
.ctx-ta{width:100%;padding:10px 14px;border:1.5px solid #E7E5E4;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:13px;color:#1C1917;background:#FAFAF9;outline:none;resize:none;transition:border-color .15s;line-height:1.5}
.ctx-ta:focus{border-color:#A8A29E;background:#fff}
.ctx-ta::placeholder{color:#D6D3D1}
.align-row{display:flex;align-items:center;gap:10px;margin-bottom:16px;cursor:pointer;user-select:none}
.align-check{width:16px;height:16px;accent-color:#7C3AED;cursor:pointer;flex-shrink:0}
.align-text{font-family:'DM Sans',sans-serif;font-size:14px;color:#57534E}
.align-pro{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:#7C3AED;background:#F5F3FF;border:1px solid #DDD6FE;border-radius:4px;padding:2px 6px}
.att-prev{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px}
.att-chip{display:flex;align-items:center;gap:8px;padding:6px 10px 6px 6px;background:#fff;border:1px solid #E7E5E4;border-radius:8px}
.att-thumb{width:36px;height:36px;border-radius:5px;object-fit:cover}
.att-icon{width:36px;height:36px;border-radius:5px;background:#F5F5F4;display:flex;align-items:center;justify-content:center}
.att-info{display:flex;flex-direction:column;gap:1px}
.att-name{font-size:12px;font-weight:500;color:#1C1917}
.att-size{font-family:'JetBrains Mono',monospace;font-size:10px;color:#A8A29E}
.att-rm{margin-left:4px;padding:4px;background:none;border:none;color:#A8A29E;cursor:pointer;border-radius:4px;transition:all .15s;display:flex}
.att-rm:hover{background:#FEF2F2;color:#EF4444}
.go{width:100%;padding:14px 24px;border:none;border-radius:10px;background:#1C1917;color:#fff;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:all .15s;margin-bottom:32px}
.go:hover:not(:disabled){background:#292524;transform:translateY(-1px);box-shadow:0 4px 12px rgba(28,25,23,.15)}
.go:disabled{opacity:.4;cursor:not-allowed}
.ld{text-align:center;padding:48px 24px}
.spin{width:32px;height:32px;border:2.5px solid #E7E5E4;border-top-color:#1C1917;border-radius:50%;animation:sp .8s linear infinite;margin:0 auto 16px}
@keyframes sp{to{transform:rotate(360deg)}}
.ld-t{font-size:14px;color:#78716C}
.ld-s{font-size:12px;color:#A8A29E;margin-top:4px}
.rh{display:flex;align-items:baseline;gap:12px;margin-bottom:24px}
.rt{font-family:'Instrument Serif',serif;font-size:28px;color:#1C1917}
.rc{font-family:'JetBrains Mono',monospace;font-size:11px;color:#A8A29E;letter-spacing:.05em}
.card{background:#fff;border:1px solid #E7E5E4;border-radius:10px;padding:20px;margin-bottom:12px;transition:box-shadow .15s;animation:fu .3s ease both}
.card:hover{box-shadow:0 2px 12px rgba(28,25,23,.06)}
@keyframes fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.card-top{display:flex;align-items:center;gap:10px;margin-bottom:14px}
.sev{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:100px;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.04em;text-transform:uppercase}
.sev-dot{width:6px;height:6px;border-radius:50%}
.sec{font-size:14px;font-weight:600;color:#1C1917}
.c-lbl{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:#A8A29E;margin-bottom:6px}
.c-cur{padding:12px 16px;background:#FEF2F2;border-left:3px solid #FCA5A5;border-radius:0 6px 6px 0;margin-bottom:12px;font-size:13px;line-height:1.6;color:#991B1B}
.c-sug{padding:12px 16px;background:#F0FDF4;border-left:3px solid #86EFAC;border-radius:0 6px 6px 0;margin-bottom:12px;font-size:13px;line-height:1.6;color:#166534}
.c-why{font-size:13px;line-height:1.6;color:#78716C;padding-top:8px;border-top:1px solid #F5F5F4}
.rw{background:#1C1917;border-radius:12px;padding:24px;margin-top:24px;margin-bottom:12px;animation:fu .3s ease both}
.rw-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.rw-t{font-family:'Instrument Serif',serif;font-size:20px;color:#fff}
.cp{padding:8px 16px;border:1px solid rgba(255,255,255,.2);border-radius:6px;background:transparent;color:#fff;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;cursor:pointer;transition:all .15s}
.cp:hover{background:rgba(255,255,255,.1)}
.cp.ok{border-color:#22C55E;color:#22C55E}
.rw-b{width:100%;font-size:15px;line-height:1.7;color:rgba(255,255,255,.85);white-space:pre-wrap;word-break:break-word;background:transparent;border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:12px 14px;font-family:'DM Sans',sans-serif;resize:vertical;outline:none;min-height:120px;transition:border-color .15s}
.rw-b:focus{border-color:rgba(255,255,255,.3)}
.rw-footer{display:flex;align-items:center;justify-content:space-between;margin-top:10px}
.rw-charcount{font-size:12px;font-family:'JetBrains Mono',monospace;color:rgba(255,255,255,.35)}
.rw-charcount.over{color:#FCA5A5}
.err{padding:16px;background:#FEF2F2;border:1px solid #FCA5A5;border-radius:8px;color:#991B1B;font-size:14px;margin-bottom:24px}

/* ── History Page ── */
.hist-hdr{max-width:800px;margin:0 auto;padding:32px 32px 24px}
.hist-t{font-family:'Instrument Serif',serif;font-size:32px;color:#1C1917;margin-bottom:4px}
.hist-sub{font-size:14px;color:#78716C}
.hist-list{max-width:800px;margin:0 auto;padding:0 32px 32px}
.hist-empty{text-align:center;padding:64px 24px}
.hist-empty-icon{font-size:48px;margin-bottom:12px;opacity:.3}
.hist-empty-t{font-size:16px;font-weight:600;color:#78716C;margin-bottom:4px}
.hist-empty-s{font-size:13px;color:#A8A29E}
.hist-card{background:#fff;border:1px solid #E7E5E4;border-radius:10px;padding:20px;margin-bottom:12px;transition:box-shadow .15s;animation:fu .3s ease both}
.hist-card:hover{box-shadow:0 2px 12px rgba(28,25,23,.06)}
.hist-card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.hist-card-meta{display:flex;align-items:center;gap:8px}
.hist-plat{padding:3px 10px;border-radius:100px;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:#fff}
.hist-goal{font-family:'JetBrains Mono',monospace;font-size:10px;color:#A8A29E;letter-spacing:.04em;text-transform:uppercase}
.hist-date{font-size:12px;color:#A8A29E}
.hist-orig{font-size:13px;color:#78716C;line-height:1.5;margin-bottom:12px;padding:10px 14px;background:#FAFAF9;border-radius:6px}
.hist-orig-label{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:#A8A29E;margin-bottom:4px}
.hist-optimized{font-size:13px;color:#1C1917;line-height:1.6;white-space:pre-wrap;word-break:break-word}
.hist-expand{background:none;border:none;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;color:#0A66C2;cursor:pointer;padding:0;margin-top:8px}
.hist-expand:hover{text-decoration:underline}
.hist-stats{font-family:'JetBrains Mono',monospace;font-size:10px;color:#A8A29E;margin-top:10px;padding-top:10px;border-top:1px solid #F5F5F4}
.hist-copy{padding:6px 12px;border:1px solid #E7E5E4;border-radius:6px;background:#fff;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:500;color:#57534E;cursor:pointer;transition:all .15s}
.hist-copy:hover{background:#F5F5F4;border-color:#D6D3D1}

@media(max-width:768px){.sidebar{transform:translateX(-240px)}.sidebar.open{transform:translateX(0)}.main-wrap{margin-left:0}.sb-toggle{display:flex}}
@media(max-width:640px){.hdr-inner{padding:16px 20px 24px}.hdr-t{font-size:30px}.hdr-logo{height:110px;margin-left:-10px}.hdr-brand{font-size:28px;margin-left:-28px}.main{padding:20px}.pbtn-row{flex-wrap:wrap}.pbtn{min-width:calc(50% - 4px)}.row{flex-direction:column}.hist-hdr{padding:24px 20px 16px}.hist-list{padding:0 20px 20px}}
.sett-body{max-width:600px;margin:0 auto;padding:0 32px 32px;display:flex;flex-direction:column;gap:16px}
.sett-card{background:#fff;border:1px solid #E7E5E4;border-radius:12px;padding:24px}
.sett-danger-card{border-color:#FCA5A5}
.sett-cancelled-card{border-color:#FCD34D;background:#FFFBEB}
.sett-card-title{font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:#A8A29E;margin-bottom:16px}
.sett-plan-row{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}
.sett-plan-badge{display:inline-block;padding:4px 12px;border-radius:100px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;margin-bottom:6px}
.sett-plan-free{background:#F5F5F4;color:#57534E}
.sett-plan-base{background:#EFF6FF;color:#1D4ED8}
.sett-plan-pro{background:#F5F3FF;color:#7C3AED}
.sett-plan-enterprise{background:#F0FDF4;color:#15803D}
.sett-plan-limit{font-size:13px;color:#78716C}
.sett-expiry{font-size:12px;color:#D97706;margin-top:4px;font-weight:500}
.sett-usage{text-align:right}
.sett-usage-num{font-family:'DM Sans',sans-serif;font-size:20px;font-weight:700;color:#1C1917}
.sett-usage-label{font-size:12px;color:#A8A29E}
.sett-cancel-desc{font-size:14px;color:#78716C;line-height:1.6;margin-bottom:16px}
.sett-cancel-btn{padding:10px 20px;border:1.5px solid #FCA5A5;border-radius:8px;background:#fff;color:#991B1B;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all .15s}
.sett-cancel-btn:hover{background:#FEF2F2}
.sett-confirm-wrap{background:#FEF2F2;border-radius:8px;padding:16px}
.sett-confirm-text{font-size:13px;color:#991B1B;margin-bottom:12px;line-height:1.5}
.sett-confirm-row{display:flex;gap:10px;flex-wrap:wrap}
.sett-confirm-yes{padding:9px 18px;background:#991B1B;color:#fff;border:none;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:background .15s}
.sett-confirm-yes:hover{background:#7F1D1D}
.sett-confirm-yes:disabled{opacity:.5;cursor:not-allowed}
.sett-confirm-no{padding:9px 18px;background:#fff;color:#57534E;border:1.5px solid #E7E5E4;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer}
.sett-reactivate-btn{padding:10px 20px;background:#1C1917;color:#fff;border:none;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:background .15s}
.sett-reactivate-btn:hover{background:#292524}
.paywall-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px}
.paywall-modal{background:#fff;border-radius:16px;padding:40px 36px;max-width:480px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.18);text-align:center}
.paywall-title{font-family:'DM Sans',sans-serif;font-size:22px;font-weight:700;color:#1C1917;margin:0 0 10px}
.paywall-sub{font-family:'DM Sans',sans-serif;font-size:14px;color:#78716C;margin:0 0 28px;line-height:1.6}
.paywall-plans{display:flex;flex-direction:column;gap:10px;margin-bottom:20px}
.paywall-plan-btn{border:1.5px solid #E7E5E4;border-radius:10px;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;transition:border-color .15s,background .15s;background:#fff;width:100%;text-align:left}
.paywall-plan-btn:hover{border-color:#A78BFA;background:#FAFAFF}
.paywall-plan-btn.featured{border-color:#7C3AED;background:#F5F3FF}
.paywall-plan-name{font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;color:#1C1917;display:block}
.paywall-plan-desc{font-family:'DM Sans',sans-serif;font-size:12px;color:#78716C;display:block;margin-top:2px}
.paywall-plan-arrow{font-size:16px;color:#7C3AED}
.paywall-divider{font-family:'JetBrains Mono',monospace;font-size:10px;color:#A8A29E;letter-spacing:.08em;text-transform:uppercase;margin:4px 0 12px}
.paywall-enterprise{font-family:'DM Sans',sans-serif;font-size:13px;color:#57534E;margin-bottom:20px}
.paywall-enterprise a{color:#1C1917;font-weight:600;text-decoration:none}
.paywall-enterprise a:hover{text-decoration:underline}
.paywall-renewal-box{display:inline-flex;flex-direction:column;align-items:center;background:#F5F3FF;border:1.5px solid #DDD6FE;border-radius:10px;padding:12px 28px;margin-bottom:20px}
.paywall-renewal-label{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#7C3AED;margin-bottom:2px}
.paywall-renewal-days{font-family:'DM Sans',sans-serif;font-size:28px;font-weight:700;color:#7C3AED}
.paywall-dismiss{background:none;border:none;font-family:'DM Sans',sans-serif;font-size:13px;color:#A8A29E;cursor:pointer;text-decoration:underline}
      `}</style>

      <div className="app-layout">
        {showPaywall && (() => {
          const now = new Date();
          const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          const daysUntilRenewal = Math.ceil((nextMonthStart - now) / (1000 * 60 * 60 * 24));
          return (
          <div className="paywall-overlay" onClick={() => setShowPaywall(false)}>
            <div className="paywall-modal" onClick={e => e.stopPropagation()}>
              {userPlan === "free" ? (
                <>
                  <div style={{ fontSize: 36, marginBottom: 14 }}>🔒</div>
                  <div className="paywall-title">You've used your 3 free posts</div>
                  <div className="paywall-sub">Upgrade to keep optimizing posts. Choose a plan below to unlock monthly usage.</div>
                  <div className="paywall-plans">
                    <button className="paywall-plan-btn" onClick={() => window.open("https://www.postyn.ai/store/p/base-plan", "_blank")}>
                      <div>
                        <span className="paywall-plan-name">Base Plan</span>
                        <span className="paywall-plan-desc">50 optimizations / month</span>
                      </div>
                      <span className="paywall-plan-arrow">→</span>
                    </button>
                    <button className="paywall-plan-btn featured" onClick={() => window.open("https://www.postyn.ai/store/p/pro-plan", "_blank")}>
                      <div>
                        <span className="paywall-plan-name">Pro Plan</span>
                        <span className="paywall-plan-desc">150 optimizations / month</span>
                      </div>
                      <span className="paywall-plan-arrow">→</span>
                    </button>
                  </div>
                  <div className="paywall-divider">or</div>
                  <div className="paywall-enterprise">Need more? <a href="https://www.postyn.ai/contact" target="_blank" rel="noreferrer">Contact us</a> for Enterprise.</div>
                  <button className="paywall-dismiss" onClick={() => setShowPaywall(false)}>Maybe later</button>
                </>
              ) : userPlan === "base" ? (
                <>
                  <div style={{ fontSize: 36, marginBottom: 14 }}>📅</div>
                  <div className="paywall-title">You've used all 50 posts this month</div>
                  <div className="paywall-sub">Your limit resets in <strong>{daysUntilRenewal} day{daysUntilRenewal !== 1 ? "s" : ""}</strong> on the 1st. You can wait, or upgrade to Pro for 150 posts a month.</div>
                  <div className="paywall-renewal-box">
                    <span className="paywall-renewal-label">Resets in</span>
                    <span className="paywall-renewal-days">{daysUntilRenewal}d</span>
                  </div>
                  <div className="paywall-plans">
                    <button className="paywall-plan-btn featured" onClick={() => window.open("https://www.postyn.ai/store/p/pro-plan", "_blank")}>
                      <div>
                        <span className="paywall-plan-name">Upgrade to Pro</span>
                        <span className="paywall-plan-desc">150 optimizations / month</span>
                      </div>
                      <span className="paywall-plan-arrow">→</span>
                    </button>
                  </div>
                  <div className="paywall-divider">or</div>
                  <div className="paywall-enterprise">Need even more? <a href="https://www.postyn.ai/contact" target="_blank" rel="noreferrer">Contact us</a> for Enterprise.</div>
                  <button className="paywall-dismiss" onClick={() => setShowPaywall(false)}>I'll wait {daysUntilRenewal} day{daysUntilRenewal !== 1 ? "s" : ""}</button>
                </>
              ) : userPlan === "pro" ? (
                <>
                  <div style={{ fontSize: 36, marginBottom: 14 }}>📅</div>
                  <div className="paywall-title">You've used all 150 posts this month</div>
                  <div className="paywall-sub">Your limit resets in <strong>{daysUntilRenewal} day{daysUntilRenewal !== 1 ? "s" : ""}</strong> on the 1st. You can wait, or contact us for an Enterprise plan with higher limits.</div>
                  <div className="paywall-renewal-box">
                    <span className="paywall-renewal-label">Resets in</span>
                    <span className="paywall-renewal-days">{daysUntilRenewal}d</span>
                  </div>
                  <div className="paywall-enterprise" style={{ marginBottom: 20 }}>Want more than 150 posts? <a href="https://www.postyn.ai/contact" target="_blank" rel="noreferrer">Contact us</a> for Enterprise.</div>
                  <button className="paywall-dismiss" onClick={() => setShowPaywall(false)}>I'll wait {daysUntilRenewal} day{daysUntilRenewal !== 1 ? "s" : ""}</button>
                </>
              ) : null}
            </div>
          </div>
          );
        })()}
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? "" : "closed"}`}>
          <div className="sb-header">
            <img src={LOGO_SRC} alt="Postyn.ai" className="sb-logo" />
            <span className="sb-brand">Postyn.ai</span>
          </div>
          <nav className="sb-nav">
            <button className={`sb-item ${page === "optimizer" ? "active" : ""}`} onClick={() => setPage("optimizer")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              Optimize Post
            </button>
            <button className={`sb-item ${page === "history" ? "active" : ""}`} onClick={() => setPage("history")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Previous Posts
              {postHistory.length > 0 && <span style={{ marginLeft: "auto", background: "#E7E5E4", borderRadius: 100, padding: "1px 7px", fontSize: 11, fontWeight: 600, color: "#57534E" }}>{postHistory.length}</span>}
            </button>
            <button className={`sb-item ${page === "settings" ? "active" : ""}`} onClick={() => setPage("settings")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
              Settings
            </button>
          </nav>
          <div className="sb-footer">
            <div className="sb-user">
              <div className="sb-avatar">{(signupForm.fullName || loginForm.email || "U").charAt(0).toUpperCase()}</div>
              <div className="sb-user-info">
                <div className="sb-user-name">{signupForm.fullName || "User"}</div>
                <div className="sb-user-email">{signupForm.email || loginForm.email || ""}</div>
              </div>
            </div>
            <button className="sb-signout" onClick={async () => { const sb = getSupabase(); if (sb) await sb.auth.signOut(); setAuthView("login"); setLoginForm({ email: "", password: "" }); setSignupForm({ fullName: "", email: "", phone: "", industry: "", password: "", confirmPassword: "" }); setSignupStep(1); setTermsAccepted(false); setPage("optimizer"); setSuggestions(null); setDraft(""); setPostHistory([]); setUserPlan("free"); setPlanExpiresAt(null); setCancelConfirm(false); setShowPaywall(false); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile toggle */}
        <button className={`sb-toggle ${!sidebarOpen ? "show" : ""}`} onClick={() => setSidebarOpen(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>

        {/* Main content */}
        <div className={`main-wrap ${!sidebarOpen ? "expanded" : ""}`}>

        {page === "optimizer" && (
      <div className="root">
        <header className="hdr">
          <div className="hdr-inner">
            <div className="hdr-bar">
              <img src={LOGO_SRC} alt="Postyn.ai" className="hdr-logo" />
              <span className="hdr-brand">Postyn.ai</span>
              <div className="hdr-actions">
                <a className="hdr-ghost-btn" href="mailto:support@postyn.ai">Support</a>
                <a className="hdr-ghost-btn" href="mailto:feedback@postyn.ai">Feedback</a>
                {userPlan === "free" && (
                  <button className="upgrade-btn" onClick={() => setShowPaywall(true)}>
                    Upgrade
                  </button>
                )}
              </div>
            </div>
            <h1 className="hdr-t">Write posts that actually perform.</h1>
            <p className="hdr-s">Paste your draft. Pick your platform. Get specific, explainable changes backed by how each algorithm actually works.</p>
          </div>
        </header>

        <main className="main">
          <div className="row">
            <div className="grp" style={{ flex: 2 }}>
              <div className="lbl">Platform</div>
              <div className="pbtn-row">
                {Object.entries(P).map(([k, c]) => (
                  <button key={k} className={`pbtn ${platform === k ? "on" : ""}`} style={{ "--pc": c.color }} onClick={() => setPlatform(k)}>{c.name}</button>
                ))}
              </div>
            </div>
            <div className="grp">
              <div className="lbl">Optimize for</div>
              <select className="sel" value={goal} onChange={(e) => setGoal(e.target.value)}>
                <option value="impressions">Impressions & Reach</option>
                <option value="engagement">Engagement (comments, shares)</option>
                <option value="likes">Likes & Reactions</option>
                <option value="followers">Follower Growth</option>
              </select>
            </div>
          </div>

          {hasSkill && (
            <div className="skill-badge">
              <span className="skill-dot" />
              <span className="skill-txt">Deep Skill Active: {cfg.name} {GOAL_LABELS[goal]} Engine</span>
            </div>
          )}

          <button className="info-tog" onClick={() => setShowInfo(!showInfo)}>
            {showInfo ? "−" : "+"} {cfg.name} algorithm intel
          </button>

          {showInfo && (
            <div className="info-panel">
              <h4>What works on {cfg.name}</h4>
              <ul>{cfg.tips.map((t, i) => <li key={i}>{t}</li>)}</ul>
              <div className="algo-note"><strong>How the algorithm thinks:</strong> {cfg.algo}</div>
            </div>
          )}

          <div className="ta-wrap">
            <textarea ref={textareaRef} className="ta" value={draft} onChange={(e) => setDraft(e.target.value)}
              placeholder={`Paste your ${cfg.name} post draft here...\n\nWrite it however you normally would — even if it's rough. The optimizer will tell you exactly what to change and why.`} />
            <span className={`cc ${overLimit ? "over" : ""}`}>{charCount.toLocaleString()} / {cfg.max.toLocaleString()}</span>
          </div>

          <input ref={fileRef} type="file" multiple accept="image/*,.pdf" onChange={handleFiles} style={{ display: "none" }} />
          <div className="att-row">
            <button className="att-btn" onClick={() => fileRef.current?.click()}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 8.5l-5.5 5.5a3.5 3.5 0 01-5-5l6.5-6.5a2.5 2.5 0 013.5 3.5L7 12.5a1.5 1.5 0 01-2-2L10.5 5"/></svg>
              Attach image or PDF
            </button>
            <span className="att-hint">{platform === "instagram" || platform === "linkedin" ? "Carousel PDFs and images will be analyzed for caption optimization" : "Images will be factored into caption suggestions"}</span>
          </div>

          {attachments.length > 0 && (
            <div className="att-prev">
              {attachments.map((a, i) => (
                <div className="att-chip" key={i}>
                  {a.preview ? <img src={a.preview} alt={a.name} className="att-thumb" /> : (
                    <div className="att-icon"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#78716C" strokeWidth="1.2"><path d="M8 1H3.5A1.5 1.5 0 002 2.5v9A1.5 1.5 0 003.5 13h7a1.5 1.5 0 001.5-1.5V5L8 1z"/><path d="M8 1v4h4"/></svg></div>
                  )}
                  <div className="att-info">
                    <span className="att-name">{a.name.length > 24 ? a.name.slice(0, 22) + "…" : a.name}</span>
                    <span className="att-size">{fmtSize(a.size)}</span>
                  </div>
                  <button className="att-rm" onClick={() => setAttachments((p) => p.filter((_, j) => j !== i))}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 3L3 9M3 3l6 6"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="ctx-wrap">
            <div className="ctx-label">
              <span>What are you going for with this post?</span>
              <span className="ctx-optional">optional</span>
            </div>
            <textarea
              className="ctx-ta"
              value={postContext}
              onChange={e => setPostContext(e.target.value)}
              placeholder="e.g. I want to establish myself as a thought leader in SaaS, this post is meant to spark debate around pricing models..."
              rows={2}
            />
          </div>

          {userPlan === "pro" || userPlan === "enterprise" ? (
            <label className="align-row">
              <input type="checkbox" className="align-check" checked={alignHistory} onChange={e => setAlignHistory(e.target.checked)} />
              <span className="align-text">Align with my previous posts for consistency</span>
              <span className="align-pro">Pro</span>
            </label>
          ) : null}

          {usageLimit !== null && usageRemaining <= 1 && usageRemaining >= 0 && (
            <div style={{
              display:"flex", alignItems:"center", justifyContent:"space-between",
              padding:"8px 12px", borderRadius:8, marginBottom:8,
              background: usageRemaining === 0 ? "#FEF2F2" : "#FFF7ED",
              border: `1px solid ${usageRemaining === 0 ? "#FCA5A5" : "#FDBA74"}`,
            }}>
              <span style={{fontSize:13, color: usageRemaining === 0 ? "#991B1B" : "#9A3412"}}>
                {usageRemaining === 0
                  ? `You've used all ${usageLimit} ${effectivePlanNow === "free" ? "lifetime" : "monthly"} posts.`
                  : `1 post remaining ${effectivePlanNow === "free" ? "on your free plan" : "this month"}.`}
              </span>
              {effectivePlanNow !== "enterprise" && (
                <button onClick={() => setShowPaywall(true)} style={{
                  background:"none", border:"none", cursor:"pointer", fontSize:12, fontWeight:600,
                  color: usageRemaining === 0 ? "#991B1B" : "#9A3412", textDecoration:"underline", padding:0,
                }}>Upgrade</button>
              )}
            </div>
          )}

          <button className="go" onClick={analyze} disabled={!draft.trim() || loading}>{loading ? "Analyzing..." : "Optimize this post"}</button>

          {error && <div className="err">{error}</div>}

          {loading && (
            <div className="ld">
              <div className="spin" />
              <div className="ld-t">{hasSkill ? `Running ${cfg.name} ${GOAL_LABELS[goal]} optimization skill...` : `Breaking down your post against ${cfg.name}'s algorithm...`}</div>
              <div className="ld-s">{LOADING_SUB[loadKey] || "Analyzing hook strength, structure, tone, and engagement signals"}</div>
            </div>
          )}

          {suggestions && (
            <div ref={resultsRef}>
              <div className="rh">
                <h2 className="rt">Analysis</h2>
                <span className="rc">{items.length} suggestion{items.length !== 1 ? "s" : ""}</span>
              </div>

              {items.map((s, i) => {
                const sv = SEV[s.severity] || SEV.polish;
                return (
                  <div className="card" key={i} style={{ animationDelay: `${i * 0.06}s` }}>
                    <div className="card-top">
                      <span className="sev" style={{ background: sv.bg, color: sv.text, border: `1px solid ${sv.border}` }}>
                        <span className="sev-dot" style={{ background: sv.dot }} />{sv.label}
                      </span>
                      <span className="sec">{s.section}</span>
                    </div>
                    {s.current && (<><div className="c-lbl">Current</div><div className="c-cur">{s.current}</div></>)}
                    <div className="c-lbl">Suggested change</div>
                    <div className="c-sug">{s.suggestion}</div>
                    <div className="c-why">{s.reasoning}</div>
                  </div>
                );
              })}

              {rewrite && (
                <div className="rw">
                  <div className="rw-hd">
                    <span className="rw-t">Optimized Post</span>
                  </div>
                  <textarea
                    className="rw-b"
                    value={editedRewrite}
                    onChange={e => setEditedRewrite(e.target.value)}
                  />
                  <div className="rw-footer">
                    <span className={`rw-charcount${editedRewrite.length > cfg.max ? " over" : ""}`}>
                      {editedRewrite.length} / {cfg.max.toLocaleString()} chars
                    </span>
                    <button className={`cp ${copied ? "ok" : ""}`} onClick={() => copy(editedRewrite)}>{copied ? "Copied ✓" : "Copy post"}</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
        )}

        {page === "settings" && (() => {
          const now = new Date();
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const postsThisMonth = postHistory.filter(p => p.created_at && new Date(p.created_at) >= monthStart).length;
          const totalPosts = postHistory.length;
          const isCancelled = !!planExpiresAt;
          const expiryDate = planExpiresAt ? new Date(planExpiresAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : null;
          const planLabel = { free: "Free", base: "Base", pro: "Pro", enterprise: "Enterprise" }[userPlan] || "Free";
          const planLimit = { free: "3 lifetime posts", base: "50 posts / month", pro: "150 posts / month", enterprise: "Unlimited" }[userPlan] || "3 lifetime posts";
          const usageDisplay = userPlan === "free" ? `${totalPosts} / 3 lifetime` : userPlan === "enterprise" ? `${postsThisMonth} this month` : `${postsThisMonth} / ${userPlan === "pro" ? 150 : 50} this month`;
          const handleCancelPlan = async () => {
            setCancelLoading(true);
            try {
              const sb = getSupabase();
              const { data: { session } } = await sb.auth.getSession();
              const res = await fetch("/api/cancel-plan", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${session.access_token}` } });
              const data = await res.json();
              if (data.expiresAt) { setPlanExpiresAt(data.expiresAt); setCancelConfirm(false); }
            } catch(err) { console.error("Cancel failed:", err); }
            setCancelLoading(false);
          };
          return (
          <div className="root">
            <div className="hist-hdr">
              <h1 className="hist-t">Settings</h1>
              <p className="hist-sub">Manage your account and subscription</p>
            </div>
            <div className="sett-body">
              <div className="sett-card">
                <div className="sett-card-title">Your Plan</div>
                <div className="sett-plan-row">
                  <div>
                    <span className={`sett-plan-badge sett-plan-${userPlan}`}>{planLabel}</span>
                    <div className="sett-plan-limit">{planLimit}</div>
                    {isCancelled && <div className="sett-expiry">Access ends {expiryDate}</div>}
                  </div>
                  <div className="sett-usage">
                    <div className="sett-usage-num">{usageDisplay}</div>
                    <div className="sett-usage-label">posts used</div>
                  </div>
                </div>
              </div>

              {userPlan !== "free" && !isCancelled && (
                <div className="sett-card sett-danger-card">
                  <div className="sett-card-title">Cancel Plan</div>
                  <p className="sett-cancel-desc">You'll keep full access until the end of your current billing month. After that your account reverts to the free tier (3 lifetime posts).</p>
                  {!cancelConfirm ? (
                    <button className="sett-cancel-btn" onClick={() => setCancelConfirm(true)}>Cancel my plan</button>
                  ) : (
                    <div className="sett-confirm-wrap">
                      <p className="sett-confirm-text">Are you sure? Your {planLabel} plan will remain active until the end of this month, then switch to Free.</p>
                      <div className="sett-confirm-row">
                        <button className="sett-confirm-yes" onClick={handleCancelPlan} disabled={cancelLoading}>{cancelLoading ? "Cancelling..." : "Yes, cancel my plan"}</button>
                        <button className="sett-confirm-no" onClick={() => setCancelConfirm(false)}>Keep my plan</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {isCancelled && (
                <div className="sett-card sett-cancelled-card">
                  <div className="sett-card-title">Plan Cancelled</div>
                  <p className="sett-cancel-desc">Your {planLabel} plan is still active and will remain so until <strong>{expiryDate}</strong>. After that your account switches to Free.</p>
                  <button className="sett-reactivate-btn" onClick={() => window.open(userPlan === "base" ? "https://www.postyn.ai/store/p/base-plan" : "https://www.postyn.ai/store/p/pro-plan", "_blank")}>Reactivate plan</button>
                </div>
              )}
            </div>
          </div>
          );
        })()}

        {page === "history" && (
          <div className="root">
            <div className="hist-hdr">
              <h1 className="hist-t">Previous Posts</h1>
              <p className="hist-sub">{postHistory.length} optimized post{postHistory.length !== 1 ? "s" : ""}</p>
            </div>
            <div className="hist-list">
              {postHistory.length === 0 && (
                <div className="hist-empty">
                  <div className="hist-empty-icon">📝</div>
                  <div className="hist-empty-t">No posts yet</div>
                  <div className="hist-empty-s">Your optimized posts will appear here after you run your first optimization.</div>
                </div>
              )}
              {postHistory.map((post, i) => (
                <HistoryCard key={post.id} post={post} index={i} />
              ))}
            </div>
          </div>
        )}

        </div>
      </div>
    </>
  );
}
