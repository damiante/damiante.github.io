---
title: "Thoughts on AI"
date: 2026-10-14 12:00:00 +1000
categories: blog
tags: ["ai", "llm", "software-engineering", "futurism"]
---

# A Night at the Opera

I am probably not the first person to notice or inform you, dear reader, that the world is abuzz with both hype and skepticism about AI. Opinions on the subject range from "fully automated luxury gay space communism is right around the corner" to "the world is about to end and there is nothing any of us can do to stop it" which I have to say is quite the breadth. Naturally I think both of these extremes are nothing short of hyperbole. I want to consolidate my thoughts on the subject and was thinking about it in my head when I decided a blog post might force me to structure my ideas better. So, what follows is my analysis on the state of AI.

# Who Are You? (Who, who, who, who?)

Firstly some context about my background so you can take my opinions with a grain of salt. I have a bachelor's degree in Computer Science from a major Australian university and about 8 years of industry experience working in technology at an established institution in the financial services sector. Industry outsiders might view this as a claim of expertise but I actually mean it (and specialists will certainly take it to mean) that I am closer to an amateur. While my interest and work are more technical than the median person, it is definitely less hands-on and more strategic than your average software engineer, and given that my employer is an institutional player and not a startup, my exposure is much less cutting-edge.

I also have no real mathematics background and have only basic understandings of LLM architecture concepts such as the transformer, attention mechanisms, Mixure-of-Experts structures for inference, etc.

Therefore please understand this piece to be commentary and speculation as futurism and not analysis of specific tools or a comparison of models. I have some view and experience with AI tools and probably understand them slightly better than your average corpo but much less than the experts whose writings you might prefer if you want to understand LLMs at a deeper level. 

# Where Is My Mind?

I also want to preface this piece with a summary on how (I understand that) AI works, or at least the models you are likely to think of when someone says "AI." If you can confidently explain what a transformer is, you can probably skip this section. If however you are not familiar with the technology, please inculge me this section as the sorts of things I will say will make more sense if you have a basic understanding of how LLMs work.

Computer Science has traditionally defined Artificially Intelligent systems as those which can make decisions without handling for those decisions being explicitly being coded in to the system by a human. For example, consider the following basic pseudo-computer program, which outputs the text "Blue" if an analysed image is blue and "Green" if an analysed image is green:

```
image <= input.read_image()
image_colour <= image.determine_colour()

if image_colour = image.BLUE:
  print "Blue"
else if image_colour = image.GREEN:
  print "Green"
```

We would say that this program is either artificially intelligent or not based on the implementation of the method `determine_colour()`. If `determine_colour()` works by, for example, taking the red-blue-green value of every pixel in the provided image, then averaging the values for blue and green, and determining which value is higher, the program would be said to be not artificially intelligent. The way to determine colour has been hand-encoded by a human into the software and you can reasonably predict what the outcome will be, given a sufficient amount of paper and pens.

However, if we instead came up with some way to show the computer a thousand example images with categorisations of either "Blue" or "Green", and then had it store the answers in some kind of memory, and then implemented `determine_colour()` by showing the image to the computer and asking it based on what we already told it about image colours whether this _new_ image is blue or green, we would say that this program is artificially intelligent. The "memory" structure in this example is called the AI's *model*, and it is typically a big ball of structured numbers which can be used to do the activity you want, in this case determining an images colour. The process of feeding the input data (the thousand images with colour labels) is called *training* the model.

The kinds of AI models you have heard of such as OpenAI's ChatGPT, Google's Gemini, Anthropic's Claude, etc. are from a family of models called Large Language Models or LLMs. These models are "large" in the sense that the amount of text they are trained on is enormous. It would not be a stretch to say that the models are trained on more or less every piece of writing that humans have ever produced since the dawn of time, where the main delta between that set and the actual training data set is what is available on the internet to be collected.

LLMs have a training phase (in which the model is created through the ingestion of this text corpus) and what's called an *inference* phase. The inference phase is what you have used; you write to it and it writes back, and it writes back really well! How does that work?

LLMs are defined by the concept of the transformer. This is where the knowledge of your humble author begins to fall off, so I will dramatically oversimplify both for your sake and mine. Effectively, an LLM's model is made up of a titanic number of vectors, which represent dimensions in a super high order space. What on earth does that mean? Let's take a very simple example. Imagine I am going to do some analysis on images again. There are two things I care about in my image: whether the image is of a cat or a dog, and whether the subject is round or pointy.

Given any image, I can assign it a score of how "cat" or how "dog" it is, and I can assign it a score of how "round" or how "pointy" it is. Each of these is a dimension in our model, and we will measure them on a scale from -1 to 1. So the pointiest dog is [1,1] and the roundest cat is [-1,-1]

In order to generate the model, like in the colour classifier, I am going to force my computer to look at thousands of pictures of dogs and cats (just like you do when you are supposed to be working) where I have assigned them scores within these ranges. Then, when I show it a new picture, it can tell me how likely it is that it is a cat vs a dog, and it can tell me how round vs how pointy it is.

Now this is useful enough, but it has an interesting side effect: even though we trained this model for the purpose of taking in and image and putting out the score, we can actually _do the reverse_; we can put in a score, and it can output an image! We can tell it how much of a dog vs a cat we want, and how pointy vs how round we want, and it can output an image that expresses those values!

(NB: image generation is much more complicated than this, and this scenario is just for visualising things)

An LLM does pretty much this thing, with some important differences: firstly, it obviously does this with text and not images, and it does this with text using a concept called a token (effectively 2-4 characters of text) and not with clean concepts like in my example. 
Secondly, the number of axes on the graph is way, _way_ more than 2. If you have ever heard of a model described in terms of [the number of "parameters" it has](https://arxiv.org/pdf/2412.19260v1), this is the number that is being referred to. Cloud-hosted, enterprise-grade models such as those listed earlier usually have on the order of hundreds of billions of parameters, and it is speculated that they may be well into the trillions.

When you interact with an LLM, you feed it tokens in the form of (usually) text, and it performs a repeated prediction using its parameter set to generate the next bit of text (token) which should come after the bit it just wrote (or which you wrote). All applications of these AI models, writing emails, answering questions, analysing image content, and writing computer programs, all work more or less in this way: ingest a huge amount of data to build a model, then when presented with new data, predict its classification. The important thing that these models do differently than those which came before them is that they repeat this process over and over, and include the most recent classification in the next prediction. This lets them keep producing more and more output.

For example, if I give the model the text `"What is the capital city of Australia?"` and it has been trained on factual information and asked to predict what text would come next, it is very likely (although not certain) to predict text such as `"The capital city of Australia is Canberra."` This is how the AI can seem to answer questions or talk to you: it predicts what text should come after what you wrote by scoring it with billions of numbers and then evaluating what the classification of the next part of text _would be_, then outputting that, and repeating the process. This is also why the text usually shows as being written gradually in real time, rather than popping up all at once. The model really is writing it at that rate!

You might notice some interesting things about this whole business. First, you'll notice that I said that the model is _likely_ to say that the capital of Australia is Canberra, but not _certain._ That's because, while the model does in a sense encode real information about the world, it does so in an imperfect ways (chopped up little bits of words instead of logical concepts). There is also an aspect of randomness (so that inputting the same text every time doesn't always result in the same answer). Someone in the past has probably written that the capital of Australia is Sydney, and if that piece of text appears approximately 1/10,000th as often, then you might expect that the model answers this way about 1/10,000 times.

Second, there is a _kind_ of logic here, but that logic is the logic of text ordering. It is not that the computer magically has a brain and thinks to itself about what the answer ought to be. In fact some models have a "thinking mode" but all this does is insert text to make the AI question what it wrote before finalising an answer to you, which interestingly does in fact seem to make the answers better. This is something we discovered about a year after the launch of ChatGPT! Still though, we should not think of these models as being intelligent in the way that you might think of a person or animal to be intelligent. The underlying model is at its core a prediction generation engine - a very, very good non-random number generation.

There really is quite a lot more to how these things work but this is sufficient for the rest of this article. Now we may finally begin to discuss where I think all this AI business is going and where it's not going.

# Year 3000

LLMs are best applied in the following general classes of application:
1. Where large volumes of media, especially text, need to be ingested or generated
2. Where nuance or context is important to a task
3. Where the outcome of a task is easy to verify for correctness, or where correctness is not important to verify
4. Where the quality (read: security, maintainability, efficiency, etc.) of the output is not important

Perhaps more importantly, LLMs are broadly _unreliable_ for problems with the following properties:
1. Where matters of fact are critical
2. Where the correctness of the output is ambiguous, difficult or expensive to verify, or unverifiable
3. Where genuine, original thought leadership is required

Let's look at some applications where AI is being used today and analyse their fitness for purpose based on these criteria.

## Agentic coding
By far the most popular industrial application of LLMs is in computer programming and software engineering. As an application, computer programming:

1. Involves text, both reading and writing, and often quite a lot. Computer programs are just a lot of text, so LLMs suit it well.
2. Is easy to verify; serious software engineering practice already mandates that even bespoke, hand-crafted, artisan code goes through an extensive suite of tests before hitting production, and LLMs can just be instructed to try again and again until the tests pass.
3. Partly cares about nuance. Code has a structure, both micro (ie linting style and coding standards) and macro (system architecture, design principles, idioms of the language, etc.).
4. _Can_ care about quality. Professional software engineers care about security for example.
5. Does not care about matters of fact; either the code passes tests or it doesn't, and this does not require the LLM's model to express truths about reality.
6. Does not normally require novel ideas. While cutting-edge optimisations and the forefront of computer science require original thinking, most software engineering is implementing relatively standard patterns and using libraries, and then doing all the surrounding work associated with care and quality control.

Agentic coding is therefore a decently good use case by the scorecard. It helps that AI is software and just like Hollywood likes films about the industry, software engineers like to eat their own dog food. Applications that make their own lives easier often come first. Claude Code, for example, is one of the most powerful applications of LLMs which exists at the time of writing. It's an agentic coding harness, which is a set of supplementary programs and tools that an LLM can use to make generating code and working inside a computer easier. It also supports customisation, meaning organisations or users can configure it to their own needs very easily.

My experience using Claude Code has been very positive. It's _extremely_ fun to use, if nothing else. You dream up some wacky idea for a web application or a backend dockerised app and in 5-10 mins of chatting to Claude, it's deployed and running.

However, this is _all_ I have managed to get it to do. The first really serious thing I tried it on, a simple clicker game, caused some warts to start showing up. The game had menus and those had inventory slots, and Claude reimplemented the inventory slot system every time I asked for a new menu to be added. I encountered a bug that I couldn't get Claude to fix in 4 or 5 prompts, then I delved into the code and fixed it easily with no knowledge of JavaScript. At one point I had to stop adding features and make Claude refactor the whole codebase. Claude kept making the same mistake where two mutually-exclusive things were being checked as toggled-on at the same time.

I think this is a combination of me using a simpler model (I think this was on Sonnet 4.5) and user error/lack of experience using these tools. I am a fairly amateur engineer and have it on good authority from engineers whom I deeply respect and trust that these tools are like rocket fuel in their hands. I also know from news stories (and believe due to my personal experience) that amateurs using them do amateur things with them. Stories touting that some teen with no coding experience is building a tech startup worth squillions of dollars are lifestyle pieces. No-one with skin in the game would trust these tools with building in the sorts of quality and basics that a professional who knows what he is doing would do without thought.

I therefore think that we are at least 5-10 years away from the death knell of software engineering tolling for thee. For now these tools still need a guiding hand of someone who understands what is needed at a deep level, and the skill then is coaxing this out of the LLM.

I think the real concern for this application is not that we will have too many software engineers because AI replaces them, but that we will have too few software engineers because AI replaced them. By this I mean: I am grateful that I went through university without access to these tools, since learning to code with access to them must be like sitting at a table as a former opioid addict and looking at a needle. The temptation to immediately and instantly solve the problem you have been struggling with for hours, days, maybe even weeks has to be so great that I don't know how you could refuse it. Between this and the belief that companies have that revenue can be increased by sacking engineers and replacing them with a smaller number of engineers with Claude Code access, the number of people who will have the required time in the ring to operate the tools may drop significantly. To me, this seems like a much more genuine problem than that all software engineers are suddenly unemployable when Dario drops Mythos next month.

## Art

From the perspective of an outsider, AI seems to have much more of an impact on communities of artists, not necessarily because the tools are better or have more widespread use, but because they see AI as an existential threat to their craft and ability to make an income from it. I am yet to see or meet the artist who is actively supportive of AI tools; at best they seem to be cautious or have mixed feelings, but the majority (or at least the most vocal) are in active and vocal rebellion. My read of them is that they feel that it is hard enough to gain recognition and make consistent money at all as an artist, and that AI actively nukes this from orbit.

Let's start by looking at the scorecard and then assess whether this idea has any merit. Specifically below I am thinking of commercial applications of art like entertainment media or advertising, not the sort of thing you'll find at your local farmer's market.

1. Art does not have a basis in fact; it is entirely sensory and subjective.
2. Industries that employ creatives are likely to smile upon tools that can produce large volumes of content quickly, where creatives are more eccentric and produce in fits and spurts
3. Quality is moderately important. Companies won't want to hitch their wagon to slop if it's obvious, but if the content is throwaway or just a small piece of a larger campaign, they'll probably cut corners to save money.
4. Original thought is not needed for commercial use cases. Popular media doesn't push the envelope, it's made to be easily digested. Films for consumption by normies do not end with 10 minute ballet performances. 

I think therefore that what we might term "mass-produced art" has an opportunity for replacement. Think of throwaway graphic designs, advertising, personal projects where paying someone is nonviable, etc. AI can't replace the idea of handcrafting, so there will always be a market for bespoke creation. The issue is that I get the impression that the people who create this sort of thing usually do the mass-production to put food on the table and are largely not able to support themselves with their art, and this is the objection from the crowd. From that angle it does seem like AI might be an existential threat. Maybe I pay designers to produce a design system for my brand, but if the AI can ingest it and produce pretty-good assets out of it, after that I don't need as many designers.

The opposite angle is that AI lets individuals create things they could never have done before. Want to make a full-length feature film with flashy visual effects and dramatic camera work? Sure thing, if you can prompt-wrangle you can probable hack together enough clips to make what you want, and this should get better with time. Maybe you can also create art assets for a game you're working on. So there are reasons to be hopeful for what AI can do for art, but overall I think the skeptics here might have reason to be concerned.

## White-collar work

Generic office work is another area where MBAs are claiming AI can lead to substantial improvements in your business. Answering emails, filling in spreadsheets, moving Jira tickets back and forth. Actually I'm not really sure what people in normal offices do, but I'll just imagine that it's the sort of general activity one might use a computer to do. Let's again bring in our analysis tools:

1. Knowledge work has a basis in fact, but facts can be bent. The production of reports looks like factual analysis but it's actually opinion. Writing emails and analysing work or planning projects also look like factual work but is more like opinion. More often than not, the production of such artifacts actually serves managerial goals rather than being objective, and so from that angle the facts matter much less, and a sycophantic AI is actually an asset.
2. I am unsure about the volume of work that is required. I get the impression that more volume probably seems better to managers but that might not matter in reality.
3. Quality is effectively unimportant. Again, where business want to make factual decisions, maybe quality matters, but I don't know that this is usually the case. Content sounding plausible is probably sufficient. Think about the number of consultants' slide decks produced entirely by grads who have no idea what they're saying.
4. Office work isn't breaking any new ground so novel thought is not important.

It seems that the case against office work depends on the underlying value of the work before the advent of AI. Genuinely good work is unlikely to be affected qualitatively, since it is not padded out with fluff to make people's jobs seem necessary. However, it may get drowned out in the sea of trash produced by less reputable organisations. Indeed this may be true today, and if so, the problem will certainly get worse before it gets better. There are already cases of consultants selling AI slop to clients without serious factual support and until the market punishes this behaviour it's likely to be cheaper than employing more grads, or at least the grads will be expectee to produce more output.

One could argue though that these sorts of jobs already add little value and perhaps AI exposing this is a net benefit for the economy in the long term. The question then is what we do with all the people who are suddenly uncovered to not be doing very much.

## Other uses

Other use cases for advances in AI are much less noteworthy:
- Robotics shows some promise but equally good progress seems to be being made through different architectures so the value add of LLMs or predictive models isn't clear yet
- Self-driving cars seem to not have their trajectory impacted at all, but maybe advanced video processing tools can help
- There might be promise in using LLM-like attention and prediction mechanisms for other patterns like weather forecasting or stock trading/financial modelling but these more niche applications are yet to receive as much attention and may have insufficient data

# Conclusion

I think the aspiration with LLMs is that they I'll become some kind of general intelligence machine and the applications will therefore magically emerge. This is where tool use (the ability for LLMs to invoke more structured software applications like calendar managers, web browsers, etc.) is gaining steam; if you just give AI the ability to access existing programs it can use context to infer which ones may be useful for a particular request.

But this aspiration in my view is unfounded; while LLMs as an architecture do seem to encode some genuine parts of reality (as we saw in the examples), they do not have an underlying logical framework, and rely on continual prediction to approach logic by means of generating lots of words and injecting self-questioning statements like "But wait!" to force reflection into the generations.

If there is an AGI architecture out there it probably isn't LLM and continued investment into LLMs and similar generative models, which may be independently useful for the use-cases outlined above, will not get us to it. Another concern I have with the industry at the moment is the massive focus on these models is likely stifling research into new models, and much energy is being placed on improving, optimising, and training the next generation of LLMs. 

Nevertheless, I remain somewhat optimistic. I think LLMs can help many individuals and small businesses who otherwise would not have been able to afford professional software solution services to spin up some basic application to make their lives easier. The ability for hobbyists (like myself) to do new and interesting pet projects which would otherwise have been prohibitively time-intensive is also really exciting. 

There will however come a reckoning when all the companies which threw AI slop out the door into production without serious attention to it will end up being seriously punished for that behaviour and this will cool people off the use of the tools in a way that might be dangerous. If and when the AI bubble pops, substantial economic downturn will follow, because large portions of the market have priced in the valuations of these companies and the supporting infrastructure (chip manufacturers, energy providers, etc.).

In summary I think there are definitely some cool applications for this tech and I hope it accelerates hobbyists and small business owners but the rumours of the software industry's death are greatly exaggerated.
