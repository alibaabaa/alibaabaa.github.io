---
date: "2015-03-04T14:52:23+01:00"
layout: post
title: "On requiring an email address for registration"

---

This week I had intended to post a deep dive into the technical details of how [PasteMonitor](http://www.pastemonitor.com) operates. However, in the middle of writing the first draft, something came up that I thought I should act upon. That thing was the registration process behind PasteMonitor.

From the beginning, I had built PasteMonitor on the premise that a user would authenticate themselves with an email address and password. I didn't question this or consider why, it was just how things go; when a user registers for a service online, they use an email address and password to authenticate, whether directly or through a delegated OAuth system.

Last week I was looking through some comments on [Hacker News](http://news.ycombinator.com), and was struck by a clear pattern in the negative comments that people's projects received. It went something like this: _I'm not going to give out my email address to try a service I know nothing about_. And of course, they were right.

When did we start accepting that an email address is a suitable substitute for a username? Granted, there are exceptions. Some services still use usernames instead of email addresses (although even of these, many of them still _require_ an email address to be held privately), and some services require an email address because it's fundamental to the service being offered. But PasteMonitor didn't fall into either of those categories. PasteMonitor uses email addresses for email alerts (which are optional), and to send a confirmation email, which is used to — you guessed it — verify the provided email address.

Over the course of about four hours of work, I swapped out the use of email addresses as the unique identifier for an account, to use usernames instead, and in the process made the email address field optional. Potentially this could cause a problem for users who have forgotten their password and haven't registered an email address to their account, but I will deal with this as and when it becomes a problem. In the mean time, I consider it more important that the barrier to entry to the service is as low as possible. This should help to accomplish that, while at the same time, increasing confidence in the legitimacy of PasteMonitor as a service, and not just a collector of users' personal data.