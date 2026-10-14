---
title: "Card Scanner"
date: 2026-10-14 12:00:00 +1000
categories: blog
tags: ["magic-the-gathering", "cube", "rfid", "android", "claude"]
excerpt: "Using UHF RFID stickers and an Android app to collect draft data from paper Magic: the Gathering Cube drafts."
---

# Introduction

I play a trading card game called Magic: the Gathering and have done since I was about 14 years old. My participation in the game has waxed and waned, and I have strong opinions about the producing company's treatment of the product, but I have always been fairly excited to play it.

In what might be considered my retirement years of playing, the format (gameplay mode) I end up playing the most is Cube. Magic cards are sold in packs of 15 and ostensibly the purpose of this is to Draft them with others. This is a format where 8ish players sit around a table and each open a fresh pack, take one card, and pass the remainder to the player on their left. They then receive a pack from the player on their right, and this process is repeated until 3 packs are consumed, after which players build decks from what they drafted and play against one another. Cube takes this one step further by using a curated list of hundreds of cards dealt into piles of 15 to simulate pack opening but without the constraint that the packs are purchased, printed, and sold in accordance with the company's preferred methods for these.

Cube is a niche but popular within its niche format which has notoriety amongst veteran (read: old) players. Its popularity grew with the Magic: Online Cube list which remains popular today, and many players emulate this cube in paper.

Cube afficionados take much pride in tweaking and optimising their lists in order to produce draft experiences that align with their goals for their Cubes. However, while when playing digitally it is relatively achievable to obtain large amounts of structured data (who took which cards in what order, did those cards end up in their deck, how did that deck perform, what archetype did the deck fit into, what are its best and worst matchups, etc.), when playing in paper this requires a host to force his guests to collect this data manually, or else lose access to it.

This project was inspired by the question posed by the gap in this accessibility to data between paper (subjectively the better play experience) and digital (where the data is easy to get and use):
> **How can I implement a simple, easy, and frictionless way to get comparable data to a digital draft when playing in paper?**

# Constraints

The optimal solution meets all of the following requirements (in rough order of priority):
1. Ease of use. The principal barrier to obtaining this data in paper is in asking people to collect it for you. Whatever solution is implemented, it must make the process as simple and quick as possible.
2. Accuracy. Confounded data is fairly useless because the outcomes this data will drive will only emerge over many drafts.
3. 

# Solution design

In considering how to solve this problem, I considered two major options: OCR and scanning. Without burying the lede and as you may have guessed from the title, scanning was the winning option, but I want to take a moment to discuss why OCR was not selected, as it's typically the first question I am asked in this project.

## OCR

Optical Character Recognition, or perhaps in this case more generally computer vision, is more or less a solved problem in 2026 for constrained use cases such as "identify card names/artwork from amongst a known list of cards in a relatively well aligned photograph of high quality under consistent lighting." The principal issue encountered by this solution is that many of these constraints are not met by the typical experience of a paper Cube draft. Consider the following images which are representative samples of a typical player's draft pool photo:

![20260813_185912.jpg](https://github.com/user-attachments/assets/748b15d1-1b0d-4006-b43c-8693102dfd54)

![IMG_5265.jpg](https://github.com/user-attachments/assets/f87fb387-0ae8-4c12-9f8c-ae62305ee3a0)
_(credit: user @zowno on Discord)_

![IMG_3085.jpg](https://github.com/user-attachments/assets/8cf8a9dc-7306-4bbb-8afe-a8f1774bbb45)
_(credit: user @burymeinmsg on Discord)_

Some observations we can make about these images:
- Orientational irregularity: some photos are square, some are portrait, some are landscape
- Resolutional irrregularity: every phone's camera captures different qualities of images
- Lighting irregularity: some cards glare heavily, others are clear
- Identification method irregularity: cards are usually overlapped to save space, meaning both OCR and image recognition (eg artwork identification) may be necessary
- Card image inconsistency: the same card may have different artworks in different printings and solutions that rely on identifying this art need to be aware of this
- Image noise: cards are usually placed on graphic playmats which may interfere with the identification of images

All of these present challenges to an OCR-based solution which, while addressable, in my analysis could not be resolved without significant sacrifice to the user experience (eg laying all cards unoverlapped in a specially-designed container with consistent lighting). Being the most important design constraint, OCR was abandoned in favour of scanning.

## Scanning

After quickly discarding OCR as an option, I invested my research into scanning instead. Specifically, my plan was to find scanning technology low-profile enough to suit the use case of being applied to trading cards without impacting the feel of playing. Some quick web searches and consults with Claude revealed that UHF RFID was a suitable technology for this use case. UHF RFID tags operating in the <TODO: bandwidth> range are highly responsive, low profile, and affordable. They are available in a variety of form factors, in my case the relevant one being stickers. These tags are typically used for more industrial applications such as warehouse inventory, and they're also the way that Uniqlo scans your purchases when you dump them into their little checkout hopper.

<TODO: tag image>

RFID scanners of this class work by broadcasting a radio frequency signal that the tags respond to. Tags contain an antenna and have a signature response which is read by the scanner as a unique character string. This will allow me to map each tag id to a unique card in my Cube by applying a sticker to every card.

Scanning has the following benefits when compared to OCR:
- Accurate: Tag reading is guaranteed to be correct since the tags are uniquely identifiable
- Condition-tolerant: Because tags are radio-responsive, conditions like lighting, angle, card artwork variance, image quality, etc. do not impact the data collection process. This was the primary reason for selecting scanning.

Overall I assessed scanning to be the better solution option, so that's how I proceeded with the project.

# Project implementation

Once I had decided to use RFID scanning for the project, I needed to decide on the model of reader and sticker type. My idea for how to implement the scanning was to have my users put their decks into a container/deck box and then push a button on an app which would fire the scanner and read all cards simultaneously. With this in mind I made the following hardware choices.

## Hardware

### RFID Reader

I purchased a Fongwah <TODO: model> RFID from Amazon for about AUD$320. I chose it for a couple of reasons:
- Power over USB: I wanted to power the reader by plugging it into my phone, since I'd need to do that anyway to read the tag ids and map them to cards.
- Compact size: The reader is fairly small and I was fairly confident it would fit into the box that I kept in my Cube in, making it convenient to carry with the cards.
- Android support: The reader advertised support for Windows, Linux, and importantly, Android. As I use an Android phone, it was critical that I had an available Android SDK for using the reader.

### Stickers

There are two classes of UHF-responsive stickers which are suitable for this purpose: <TODO: sticker classes>

I picked <TODO: sticker> based primarily on vibes, and secondarily on form factor. Since my intent was to have all cards together in a deck box, my research had led me to believe that the orientation of the stickers was important (i.e. they should be positioned in different locations and orientations to minimise overlap and maximise relative distance), so I figured a rectangular shape would be better. They were also just the right size to fit a standard Magic card.

After deciding, I purchased 800 sticker tags at a cost of about AUD$180.

## Implementation

As with all projects, once I started, I immediately ran into major problems. Notably, it turned out that the RFID reader, although advertising compatibility with Android, only had an available SDK for Windows on their website. "Not to worry," I thought, "This is likely their most common use case and most people stop there, so the Android SDK will be available on request." However, after contacting Fongwah, it turned out that the Android SDK was still in development, and it would be another couple of months before it was ready for use.

In the meantime, Fongwah's representative (who goes by Helena) was extremely helpful in understanding my need and providing advice. She even went as far as to have her engineering team test my setup with their hardware and worked with me to try to optimise my physical card arrangement. As it turned out, my goal UX of scanning a full deck at once was likely to be impossible due to the physical characteristics of the tags I chose and the reader. Fongwah recommended I purchase a more powerful reader, which they offered to sell to me at a difference in price between what I had already paid and the normal sale price for that reader (approximately AUD$550, meaning I purchased for only AUD$170)! At this point I wasn't confident that I truly needed this more powerful hardware, but I was so happy with the support and individual attention I had received from Fongwah, which they provided to a normal consumer purchasing only one unit, that I was willing to pay this extra price just to support them. For the interested reader who has a need for RFID technology, I would highly recommend reaching out to and working with Fongwah.

Anyway as it turned out, the more powerful reader required external power from mains and was considerably larger than the model I had already purchased, so I resolved not to use it unless it was absolutely necessary. I still felt there was a chance that I would be able to hit my target UX via some cleverness like 3d printing a container that spreads the cards out when they're placed inside.

### Software

#### RFID reader interface

Now that I had all my hardware handy, I had to implement my software. I put this off for the longest time because I was waiting for Fongwah's official Android SDK to be available, but in my last week of Claude Fable access I thought maybe it was worth attempting my own implementation. Fongwah was unfortunately unwilling to provide the serialisation standards for the USB over which the reader operates, and I know nothing of Windows OS development, so this was entirely a Claude job.

After sicking Claude at the provided Windows CPP/DLL files, I was downgraded from Fable to Opus 4.8 (Opus 5 had not yet released at the time), presumably because I used the very scary words "reverse-engineer" in my prompt. Fortunately this did not present a real issue, and Claude successfully produced a Python file which worked to receive tag scan events and print them to the command line. After a couple more tweaks to the behaviour, I was able to get a working implementation on my Linux PC that I was happy with. This was important because I wanted to ensure that the hardware behaviour and usage patterns could be understood and verified without needing me to worry about whether for example USB pass through to an emulated Android device was causing a problem.

I then had the code restructured to support the interface exposed by the Windows code so that future users of this device may leverage the SDK for their own needs, and this code is available [here](https://github.com/damiante/u6cu91-linux).

Claude was then able to convert the Linux SDK into an Android one which is also available [here](https://github.com/damiante/u6cu91-android).

#### Android application

To develop the app, I started by drawing a screen transition diagram in Excalidraw and providing this to Claude. I actually did this before the Android SDK, so the implementation I used made an assumption that the future SDK would meet the interface promises present in the Windows SDK, and the app screens designed accordingly.

<img width="15190" height="10676" alt="Image" src="https://github.com/user-attachments/assets/edfacea2-9ad4-40f6-b60e-7ca2c5be72c8" />

In addition, I had the first version use a dummy/stubbed scanner which digitally simulates the SDK interface commands so that the app can be tested without a reader connected and working. This was essential so I could manually test the UX without needing the reader to be working.

I was surprised at how easily Claude was able to parse the Excalidraw file. In fact I was completely astonished that it was able to turn the scrappy drawing into a complete Android app with no further prompting (this was done by Fable this time). After a couple of iterative refinements I had the app in a state I was happy with, and then the RFID SDK was wired in.

Although I anticipated having issues getting the reader to pass through my PC's USB port and into virtualisation for the emulated Android device, it seems that my concerns were misplaced. Not because this wasn't an issue, but rather because it seems that since I last tried my hand at Android work, it is now possible to screenshare Android devices to Studio and to directly publish apps to devices linked over the local wifi network. Therefore I skipped the emulator entirely once it came to testing the reader and went straight to the physical device.

At this point I ran into a couple more issues. Firstly, the USB type A to type C dongle I was using didn't seem to want to let me connect the reader. I researched this and found out that it was likely due to lack of support for a technology called USB On-The-Go (OTG). Purchasing a new dongle with this tech aboard for about AUD$7 fixed the issue.

The second issue was related to how the SDK grabs the reader. I still haven't quite cracked this, but the app and SDK seem a bit spotty when deciding when to attempt to start using the physical reader. The easiest fix I have found to this problem is to toggle demo mode on and off, which seems to prompt the device to reattempt physical connection.

After all of this, the project was in an effectively complete state.

# Features

## User Experience - App

### Usage flow

The app holds one cube at a time as "Active" but multiple are supported. The landing page has a cube title and then current and past drafts.

<TODO screenshot>

Selecting "New Draft" prompts the user to name the draft (defaults to datestamp) and then enter a player's name. After this, scanning can begin. The most effective way I found to enter cards after some experimentation was to lay out the cards and then wave the scanner over the top of them.

<TODO video>

This isn't as clean as my original use case, but I found in testing that I also couldn't get the method to work, and in any case players usually do this to view their decks either during construction or prior to disassembly so I don't think it's a real blocker to using the scanner.
