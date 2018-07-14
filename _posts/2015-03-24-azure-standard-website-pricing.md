---
date: "2015-03-24T18:14:48+01:00"
layout: post
title: "Azure standard website pricing"

---

If you've read other posts of mine, you may have come to the conclusion that [I'm not a fan of Azure standard website pricing](/a-look-inside-pastemonitor/#shared-trouble). With shared websites (now rebranded as "app services") available on Azure for less than £6 a month, the jump up to a standard <del>website</del> app service at more than £40 a month looks ludicrous, at least on the surface. But I was wrong, and as of today, no longer have any sites on a shared plan. Here's why.

#### A basic misunderstanding

My opinion was based upon a basic misunderstanding of the difference between the two levels of service (shared and standard), not helped in any way by Microsoft's pricing page, nor by the full management portal (that's the one at manage.azure.com). In both of these places, Microsoft compares these two plans side by side, as though to say: "you can create a website (I'm not calling it an _app service_) in the shared tier, or you can create one in the standard tier."

What this fails to make clear, is that what you are actually choosing between is not a website plan, but a web hosting plan. The former is the equivalent of old-school shared web hosting, where you are provided with a limited set of resources which you must shared with other users whose sites are located on the same physical box (or at least as 'physical' as things can be in the cloud). In contrast, the standard plan provides you with a virtual machine all to yourself, on which you can run as many websites as you can practically fit within the limits of the container's resources.

To put it another way, create two shared websites, and it'll cost you around £12 a month. Set up two standard websites, and as long as you choose the same web hosting plan for them, it'll still only cost £40 a month. As shown below, this distinction is much clearer in the new portal, where sites are more likely to be seen grouped under a plan.

[![portals_compared](https://az761005.vo.msecnd.net/uploads/2015/03/portals_compared-1024x596.png)](https://az761005.vo.msecnd.net/uploads/2015/03/portals_compared.png)

With the other benefits provided by the standard plan over shared, including free SSL support, auto scaling, and no more automatic suspension for exceeding resource limits, the standard plan starts to look like a much more attractive offer.

Either I missed something obvious along the way, or Microsoft isn't making the distinction between websites and web hosting plans clear enough. It was only because I happened to be researching something else, and ended up on [this Scott Hanselman article](http://www.hanselman.com/blog/PennyPinchingInTheCloudWhenDoAzureWebsitesMakeSense.aspx), that I discovered this difference at all. It does appear that Microsoft are heading in the right direction with this in the new portal, and perhaps the name changes to "web app" and "app service plan" will help solidify the distinction going forward.

#### Standard websites are the way forward

While it may be obvious that standard websites are more expensive because you're getting a whole virtual machine to yourself, what isn't made clear is that unlike with shared sites, multiple websites can be hosted inside a single standard plan, with all the same benefits provided by the platform as a service model. This make standard Azure websites a much more attractive offering, and I expect to be using them exclusively going forward.