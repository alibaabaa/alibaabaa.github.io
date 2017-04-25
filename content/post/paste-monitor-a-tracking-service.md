+++
date = "2015-02-26T07:07:07+01:00"
draft = false
title = "PasteMonitor: a tracking service for paste sites"

+++

I've been working with the Azure platform for a couple of years now, yet still feel I've barely scratched the surface of available services. One of the areas that I was particularly interested in getting up to speed with was WebJobs. In Azure, a WebJob is a separate process that sits underneath a website and runs either on a trigger (such as a new message in a queue), a schedule (i.e., every six hours), or on demand (when manually triggered from within Azure).

I finished up on my last side project in Azure back in October 2014, so by the time February came around I was itching for something new to work on and I knew I wanted to explore what WebJobs had to offer. With the recent spate of [account breaches](http://lifehacker.com/5-million-gmail-passwords-leaked-check-yours-now-1632983265) and [data leaks](http://www.usatoday.com/story/tech/2015/02/04/health-care-anthem-hacked/22900925/) brought to prominence in the media, digital security and personal information management online is something that's been at the forefront of today's zeitgeist. And since it's so easy for this sort of information to be spread anonymously on "paste sites" such as [Pastebin](http://pastebin.com), my thoughts turned to how I could build something useful around these themes.

#### PasteMonitor

And so [PasteMonitor](http://www.pastemonitor.com) was born.

In case you're unfamiliar with the concept of a "paste site", the idea is a simple one. Typically when visiting a paste site like Pastebin, the user is presented with a text box into which they can type (or paste) whatever text they like. Often, this is snippets of code that one user wants to share with someone else remotely. It's a straight forward and effective mechanism for sharing text with someone else. But that text can be anything, and paste sites are now frequently used to anonymously "dump" account usernames and passwords from breached websites.

#### Similar services

Fortunately, there is already a brilliant free service from [Troy Hunt](http://www.troyhunt.com) that allows consumers to check whether their online accounts have been compromised. [haveibeenpwned.com](http://haveibeenpwned.com) aggregates data from large breaches, such as the Adobe breach where **150 million user accounts** including email addresses and passwords were leaked, and combines that with new pastes from paste sites to keep users informed if their email address appears in any such list. If you're not already registered with this service, I would highly recommend it.

Beyond this there is [Dump Monitor](https://twitter.com/dumpmon) for the more technically inclined. Dump Monitor, or "dumpmon", watches paste sites for common patterns that look like they might contain data leaks, and tweets interesting finds automatically to its Twitter account.

#### A general purpose tool

So if these tools already exist out there, then what exactly is the point of PasteMonitor? While the above mentioned services are excellent at what they do, their utility is (purposefully) limited. Pastes aren't necessarily leaked data, and even when they are,  a data leak may not necessarily contain an email address. What if I want to know if someone mentions my name in a paste? Any of the domain names I manage? And who's to say I'm only interested in data breaches? Maybe I'm interested in something else entirely, and would like to know if anything related is pasted to Pastebin.

I built PasteMonitor for use as a general purpose utility for finding _anything you might be interested in_ that shows up on Pastebin. PasteMonitor will watch everything that is pasted publicly, and create a record for me if any of my search terms turn up.

#### Improved alerting over native Pastebin alerts

So PasteMonitor is an alert system for Pastebin. If you're at all familiar with Pastebin, you probably already know that Pastebin offers its own alert system. But a free Pastebin account only allows you to watch three terms at any one time and also automatically disables alerts for terms that have been matched ten times. It also doesn't allow the use of regular expressions as search terms.

[![PasteMonitor matches screenshot](https://az761005.vo.msecnd.net/uploads/2015/02/ui-preview.png)](http://www.pastemonitor.com)

With PasteMonitor, I have attempted to address these limitations. To start, I didn't impose any limit on the number of different search terms that a user can monitor on their account. The number of matches a search term may find before being deactivated is not unlimited, but is set to a less prohibitive default of 50\. Additionally, regular expressions can be used as search terms, blowing open the possibilities and flexibility when it comes to setting up search terms. Manage an IP address range and want to monitor for mention of any of them? No problem.

With the talk of Azure and WebJobs at the start of this post, you're perhaps looking for more of the technical details about what drives PasteMonitor and how it works. This post was intended as an introduction to the site and its purpose, but you can expect a follow up to this post shortly that dives deeper into the nitty gritty details of PasteMonitor and its architecture.

* * *

As promised above, [a follow up post detailing the technical aspects of PasteMonitor](http://www.tomeggington.co.uk/a-look-inside-pastemonitor/ "A look inside PasteMonitor").