---
title: "Free Lunch as a Service"
date: 2026-03-17 03:57:31 +1000
categories: blog
tags: ["melbourne", "shennanigans", "friends", "home-assistant"]
---

# Introduction
My friend and former colleague [Bailey Butler](https://baileybutler.au/) recently ~~committed a betrayal of the highest order~~ got a new job at a different company. Bailey's employer both welcomes guests and provides its employees with substantial non-financial perks. One such perk is that both employees and their guests receive a catered lunch each working day. Bailey, very generously, happily shares this perk with his friends and colleagues. In this post I will detail my attempt to abuse the technology I have available to take advantage of this generousity to the maximum extent possible.

# Part 1: Free Lunch
Bailey has a habit of [publishing information](https://isbaileybutlerintheoffice.today/) [about his life](https://baileyneeds.coffee/) [on the internet](https://track.baileys.app/) for reasons which I am yet to completely understand. Upon learning that he was able to retrieve and publish [menu information for the catered lunches](https://menu.baileys.app/) he gleefully informed his former colleagues one day that anyone wishing to avail themselves of the services was welcome to contact him to do so, provided he was in the office.

We organised to go and visit Bailey to have a bit of a sticky beak into his new workplace and have a free lunch when a thought occurred to me: What if I didn't have to talk to my friend in order to get a free lunch out of him? God forbid I engage in an interpersonal interaction with someone I enjoy talking to. Upon realising that nearly all of the information I needed to facilitate this was already being published to the internet by Bailey or available to me, I planned a way to combine it to automate the process of attending Bailey's office for lunch.

# Part 2: As a Service

I run a HomeAssistant instance for automating several things in my house. My primary use cases for deploying it were vacuuming the house using a robot vacuum whenever I leave home, automating the opening and closing of the electric roller shutters on my windows, and turning on lights whenever the former automation runs so I don't come out of my office to find my home plunged into darkness. As time goes by I have found more and more things to use HA for, a more recent one being logging my office attendance using [Office Tracker](https://officetracker.com.au) (coincidentally this was also built by Bailey). This meant I had already set up location tracking in HA for when I am at work.

Automating free lunches was fairly simple after this: Every day at 11AM, HomeAssistant will check whether I am in the office using my phone's location tracking back to HA. If I am, it will also check if Bailey is in the office using [isbaileybutlerintheoffice.today](https://isbaileybutlerintheoffice.today/). If he is, HA will make an API call to the `/json` endpoint of [menu.baileys.app](https://menu.baileys.app/) and retrieve structured information about this week's menu.

HA will determine the day of the week and pull the appropriate value from the JSON response, then send a push an Actionable Notification (ie a notification with selectable options) to my phone with today's lunch, and options "Yes" and "No." This lets me view today's lunch and decide if I'd like to eat it.

![Screenshot_20260224_090127_One UI Home.jpg](/images/9c1706b6-38df-489b-bf8e-b3eb138ebde6)

At this point I was a little stuck. Attending his office requires me to receive an invitation to get security clearance, and I had no way to request an invitation without manually messaging Bailey; the guest management tool his employer uses does not (as far as I'm aware) have an API endpoint which I could hit, and even if it did, "invite myself to someone else's office" is a use-case which I thought was unlikely to be supported. Was there anything else I could do to 

I therefore did the next thing that came to my mind and made what I thought was a completely ~~insane~~ reasonable request to Bailey - Would you expose a web service with a public, unauthenticated HTTP endpoint which allows anyone with the URL to send a DM to your phone? Bailey, to my ~~abject terror~~ great delight, ~~immediately refused~~ enthusiastically agreed, and provided me with [Hermes](https://hermes.baileys.app/), a web service for this purpose with an endpoint to which I could POST messages.

Thus unblocked, I built another automation in HA which received the "Yes" response action from my push notification and used this endpoint to send Bailey a message requesting he invite me to his office. I would prefer a more guaranteed-to-work solution but given the constraints I was satisfied delegating this part of the process to the Butlerian Mechanical Turk.

# Conclusion

The final workflow is basically the following:

1. Every day at 11am, check my location from my device via the HA app.
2. If I'm at work, call [isbaileybutlerintheoffice.today/raw](https://isbaileybutlerintheoffice.today/raw) and interpret the response
3. If the response was "yes", call [menu.baileys.app/json](https://menu.baileys.app/json) and retrieve the menu
4. Determine the day of the week and pull hot/cold food items from the menu for the corresponding day
5. Send an Actionable Notification to my phone with whichever food item is populated; await notification action
6. If the action was "YES", call [hermes.baileys.app](https://hermes.baileys.app/) with a message requesting that I be invited for lunch
7. I receive an email stating I'm invited to join Bailey for a free lunch

Future extensions to consider:
- Something that the "no" notification action can do
- Logging the meals I received for posterity
- Better reliability - cannot currently tell if sending the request for a free lunch will actually result in a free lunch
- Resiliency against Bailey losing his job (voluntarily or otherwise)