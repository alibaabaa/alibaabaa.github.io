---
date: "2015-03-15T16:15:50+01:00"
layout: post
title: "A look inside PasteMonitor"

---

[PasteMonitor](http://www.pastemonitor.com) is a service I built to improve the monitoring possibilities for paste sites. I worked on and built PasteMonitor in early 2015 and it went live at the end of February. This post covers the technical aspects of PasteMonitor and the technology it runs on. If you haven't already, you might first wish to read my [introduction to PasteMonitor](http://www.tomeggington.co.uk/pastemonitor-a-tracking-service-for-paste-sites/ "PasteMonitor: a tracking service for paste sites").

#### Overall architecture

PasteMonitor is a made up of separate Azure components that work together to drive the functionality behind the user interface. There are currently four WebJobs, 10 Azure Storage containers, and one Website under a single storage account. There is no SQL layer in PasteMonitor. All data associated with the service lives inside the storage containers.

The website is a standard ASP.NET MVC website project, serving up the web front-end the user interacts with. It is driven by the data stored in the site's table storage containers. The rows in these tables are populated both by the website, such as when a new user registers, and by the other integral part of the service: the WebJobs.

[![PasteMonitor Architecture](https://az761005.vo.msecnd.net/uploads/2015/03/pastemonitor_architecture.png)](https://az761005.vo.msecnd.net/uploads/2015/03/pastemonitor_architecture.png)WebJobs perform all the heavy lifting in PasteMonitor and we'll look in detail at how functionality is split up between them to allow them to work independently. You'll also notice from the diagram above a fair few different storage containers. The storage containers store data used by the various different processes in the system, and enable those processes to send messages to each other, without a need to know anything about one other.

#### The website

My plan for the website from the beginning was to keep it simple and fast. It's a truth universally acknowledged that design is hard. All I knew was that I wanted to produce something usable, that wouldn't annoy my users or get in their way too much. While thinking along these lines, my thoughts kept coming back to one website in particular: [Pinboard](http://pinboard.in). Pinboard is a paid bookmark service, self styled as "Social Bookmarking for Introverts" and I am a very happy customer. The beauty of Pinboard lies in its no-nonsense approach. It knows what it's trying to do and does its best to stay out of the user's way while doing it. If there was any theme I wanted to carry across to PasteMonitor, it was simplicity over smarts.

[![The homepage offers a description and screenshot of the service. It also swaps out the login box for the register box if there's never been a login from the current browser.](https://az761005.vo.msecnd.net/uploads/2015/03/pastemonitor_in_ie-1024x677.png)](https://az761005.vo.msecnd.net/uploads/2015/03/pastemonitor_in_ie.png) The homepage offers a description and screenshot of the service. It also swaps out the login box for the register box if there's never been a login from the current browser.[/caption]

Not only did I want PasteMonitor to be simple, I also wanted it to feel fast. Although in all honesty, I put little specific effort into making it feel fast, beyond remaining conscious about performance through the process of building the website. The web seems to be going through a miserable phase where style is everything, and substance and usability come a distance second. Javascript so heavy that browsers take several seconds to process the page on load, font imports that result in annoying page flashes and re-renderings, and nasty modals that popup in front of the content asking if you'd like to subscribe to something or other. Anyway, before I become completely side tracked...

For the sake of the simplicity and speed that I wanted, there are no pop-overs in the PasteMonitor user interface, and no animations. Where I need to confirm a user action, I make use of the browser's native confirmation dialogue. It's not the prettiest solution available, but it sure is fast, and the user is familiar with it and understands it.

One gotcha with ASP.NET websites worth mentioning is the automatic request validation that, by default, will filter out requests that could be considered harmful (those containing < or >). This behaviour is an effective strategy for mitigating the threat from [cross-site scripting attacks](https://www.owasp.org/index.php/Top_10_2013-A3-Cross-Site_Scripting_%28XSS%29), but is also pretty annoying when globally enforced. Any user trying to set a password with these blacklisted characters is going to get an error, which is nonsense considering a password's characters aren't even stored, let alone displayed back to the user. I turn off this request validation on a case by case basis with the MVC `[ValidateInput(false)]` directive. Though it should go without saying that this method attribute should be used with caution and only in specific circumstances where called for.

#### The brains of the operation: WebJobs

[I mentioned](http://www.tomeggington.co.uk/pastemonitor-a-tracking-service-for-paste-sites/ "PasteMonitor: a tracking service for paste sites") in the introduction to PasteMonitor that part of the motivation for building it was to gain some experience with Azure WebJobs. In Azure, a WebJob is a process that runs either on demand, on a schedule, or in reaction to a trigger. The "process" can be any sort of executable or script supported by the [kudu deployment system](https://github.com/projectkudu/kudu/wiki/Web-jobs) in Azure.

The process flow inside the system goes something like this:

1.  A WebJob running on a regular schedule checks Pastebin for new pastes that aren't already in the system and downloads them into blob storage. It then adds a message to New Raw Paste queue with details of the blob.
2.  A separate WebJob running on a queue trigger watches the New Raw Paste queue and runs every time a message is posted to it. It checks the content of the blob against all the active keywords in the system, recording a match each time it finds one.

Currently I only watch Pastebin for pastes, but I wanted to leave open the door for bolting on new paste sites without having to make any major internal changes to support it. For each additional paste site, I would create a new WebJob containing the custom logic specific to fetching the pastes from that site and creating blobs for them. Because all the messages on the queue are structured the same, and all blobs live in the same container, the matching WebJob doesn't care where the paste is originally from, and processes all the blobs in the same way.

[![Azure WebJob function replay](https://az761005.vo.msecnd.net/uploads/2015/03/webjob_replay.png)](https://az761005.vo.msecnd.net/uploads/2015/03/webjob_replay.png)

This loose coupling of system components offers an additional benefit beyond process reuse. By manually adding messages to the watched queue, I can test the matching job's behaviour without having to simulate the fetch of a paste from a site. But Azure makes this process slicker still, by providing a web interface for passing messages directly to the WebJob, which enables the bypassing of the queue altogether. This functionality and method of working makes testing out different scenarios, and rerunning tasks manually a breeze.

#### The Pastebin downloader

When a public paste is posted to Pastebin, it is listed on the [archive page](http://pastebin.com/archive), which lists the most recent 150 public pastes. As the only publicly available source of new pastes, it is the defacto go to page for anyone interested in seeing what's new, and it's the page that PasteMonitor scrapes. The scheduling for scraping this page however requires some careful balancing. Scraping the page too often could be (rightly) seen as an abuse of the service, and could even see the WebJob client banned, preventing it from collecting any of the pastes. But fail to scrape frequently enough, and you risk more than 150 new pastes being posted since the previous scrape, again resulting in some pastes being missed.

This isn't an exact science, and at the time of writing, PasteMonitor is set to scrape every eight minutes for new pastes. In an ideal world Pastebin would provide a predictable, machine-readable listing of pastes, but we work with what's available. It might be that I need to create another process that learns pasting patterns, and adjusts the schedule accordingly, to scrape more often at times of high load, and less frequently at times of low load.

After scraping the archive page for the last 150 paste links, the job checks the download history storage table and compares it to the latest scrape, sifting out any pastes that have already been fetched from the previous scrape. It then downloads each unseen paste, stores it down to the pastebin unprocessed blob container, and writes a row to the download history storage table. It also adds a message to the new raw paste queue.

#### The match searcher

The match searching WebJob is triggered by new messages on the new raw paste queue. By adding an attribute `[QueueTrigger("queuename")]` to a WebJob function parameter, Azure will automatically handle triggering the function on new queue messages. Not only this, but it also automatically handles retries on failure, and on repeated failure, will move a queue message to a queuename-poison queue where the offending message can be handled and processed separately.

You get all this functionality and behaviour for free, with no handling code required, just by including the attribute on your WebJob function parameter. It goes without saying that this provides massive benefits in terms of code size, readability, and quality assurance.

[![Azure provides reporting on the status of WebJobs](https://az761005.vo.msecnd.net/uploads/2015/03/webjob_report.png)](https://az761005.vo.msecnd.net/uploads/2015/03/webjob_report.png) Azure provides reporting on the status of WebJobs[/caption]

Whenever the WebJob encounters a new queue message, it pulls the referenced blob from the Pastebin unprocessed, all active keywords from the keyword table, and begins checking the contents of the blob for each keyword. On finding a match, it creates a new record in the match table, which drives the list the end user sees down the left of their screen. It also puts a new message on the email queue if the user has configured the keyword to send email alerts.

After iterating through all the keywords in the system, if any matches were found, the blob is copied to the archive blob container. This gives the user access to a permanent copy of the paste, in the event that it becomes no longer available from Pastebin. Finally, the blob is deleted from the Pastebin unprocessed container and matching is considered complete for that paste.

The queue message is deleted automatically upon reaching the end of the function if no unhandled exception has been thrown.

#### The alert processor job

The alert processing WebJob is also trigger based, reacting to new messages on the email queue. The workflow is straight forward, constructing a new MailMessage from the queue message, and sending it via the configured SMTP server.

Email sending is split out from the matching process to prevent network delays from impacting on match performance. It also separates the email sending logic, allowing either job to be rewritten and redeployed without impacting the other.

#### The maintenance job

I have an additional maintenance job scheduled to execute every five minutes, which performs data tidy up tasks. In theory, these could be run as part of the other jobs, but I didn't want the less important maintenance tasks impacting upon the run time of the service critical tasks. There are currently three operations that take place as part of system maintenance:

1.  Deactivating keywords that have exceeded their match threshold.
2.  Deleting archived pastes that no longer have any match records pointing to them. This can happen when a user deletes a match, where they are the only user with a match for the given paste.
3.  Performing a GET request to the homepage. This prevents the website from going to sleep during periods of inactivity, which is a real problem affecting Azure websites on the free and shared tiers. _Always On_ mode can be enabled on the basic and standard pricing tiers.

#### Gotchas with WebJobs

There are a couple of things to consider before taking the dive into WebJobs, neither of which are particularly well publicised by Microsoft or elsewhere. A minimum of Visual Studio 2013 is required for WebJob support in the IDE. From an Azure website, an additional menu option is provided to make it easy to add new WebJobs.

[![WebJobs from the IDE](https://az761005.vo.msecnd.net/uploads/2015/03/webjob-ide-support.png)](https://az761005.vo.msecnd.net/uploads/2015/03/webjob-ide-support.png)

The other issue relates to incomplete functionality in the git deployment integration. If using [automated git deployment, which I've written about previously](http://www.tomeggington.co.uk/deploying-azure-websites-with-git-continuous-delivery/ "Deploying Azure Websites with git continuous delivery"), WebJobs configured to run on a schedule will be deployed as 'on demand'. The inconvenience of this is exacerbated by an inability to change this configuration setting from the Azure portal post-deployment. For jobs I want to run on a schedule, I've found it necessary to publish these to the file system and use the job importer to load them into Azure. David Ebbo talks about this in more detail on [GitHub](https://github.com/projectkudu/kudu/issues/1452).

#### The trouble with shared Azure websites

Falling asleep isn't the only pitfall to be aware of with websites on the shared tier. There are strict resource usage quotas which a website in this price plan must not exceed. These are: four hours of CPU use per day; 2.5 minutes of CPU usage per 5 minutes; 1024MB of disk usage; and 512MB of memory use. Strictly speaking, Azure measures memory use on a per hour basis, which doesn't make much sense to me. Having kept an eye on this metric, the usage that Azure shows _per hour_ for memory appears to actually be the highest level of memory consumption by the site during that hour. Bizarrely, the [Azure documentation for website limits](http://azure.microsoft.com/en-gb/documentation/articles/azure-subscription-service-limits/#websites-limits) lists the memory limit for shared sites as 1024MB, but this is not reflected in my portal.

[![Azure Memory](https://az761005.vo.msecnd.net/uploads/2015/03/azure_memory.png)](https://az761005.vo.msecnd.net/uploads/2015/03/azure_memory.png)The problem with these limits isn't so much in the limits themselves. After all, this is a shared tier, so it's not unreasonable to expect limitations on the resources a site can use. The problem is what happens when these limits are exceeded. Rather than being bumped automatically into an increased price tier, which would seem like a reasonable response, what actually happens is that _all websites on the subscription are suspended_ until the start of the next billing day. This is especially troubling when, as above, your site is sitting at 95% utilisation.

So why not just bump the site up to the next pricing tier if I'm sitting this close to the limit? The answer to this is cost. At the time of writing, an Azure website at the shared tier costs 0.8 pence per hour, or put another way, £5.91 a month. The next tier up from this is 'Basic', where an hour costs 4.6 pence, pushing up the monthly outlay to over £34\. The fact that there's nothing between these two tiers means I'm either sweating it on a shared plan, or throwing away money on an entire virtual machine to myself.

And the resource limits aren't the only issue with the shared tier. While there is support for custom domains (i.e., _yourname.com_ rather than _yourname.azurewebsites.net_), and there's support for SSL (_https://yourname.azurewebsite.net_), there's no support for SSL on a custom domain (_https://yourname.com_). This in many respects is a deal breaker and severely limits the practical applications for the shared tier.

#### Obfuscation of server technology

While ASP.NET tends to ship with sane defaults in terms of configuration security, it's always worth revisiting the settings before deploying a site into a production environment. None of these steps provide iron clad protection from attacks, but can go some way to reducing automated attacks based upon server technology detection, where an application is attacked based upon known vulnerabilities in particular technology stacks and versions.

There are three changes I make to try to hide the server technology from detection by automated scanners:

1.  The forms authentication ticket cookie used by the framework can be renamed from the standard ".ASPXAUTH" to any other valid name for a cookie by setting the _name_ attribute on the authentication _form__s_ element.
2.  By default, IIS will send an X-Powered-By HTTP header with every response, which can be disabled by adding the _<remove name="X-Powered-By" />_ directive to the _customHeaders_ section of the config.
3.  And the framework includes its own HTTP header listing its version number, which can be removed by setting the _enableVersionHeader="false"_ attribute on the _httpRuntime_ element.

The web.config comes with custom errors turned on by default, but providing the actual custom pages for this is still left as an exercise for the developer. One other important thing I like to change regarding errors, is the default application behaviour from redirect to rewrite. By default, if an error occurs, the user will be redirected to the configured error page. By setting the redirectMode="ResponseRewrite" on the customErrors element, the URL displayed in the browser remains pointing to the resource the user requested, allowing the user to try again by reloading, while potentially hiding the fact that something went wrong at all.

I've yet to find a nice clean way to rename the form field / cookie used for request validation, employed to prevent cross site scripting attacks, but server stack obfuscation is always about levels of defense. Absolutes in this game are difficult, whatever the technology stack.

#### Going forward

Building [PasteMonitor](http://www.pastemonitor.com) has provided me with a chance to work with WebJobs, which was the original aim of the project when I set out developing it. It also gives me a launch pad from which to jump into the next area I want to pick up in more depth, which is F#. With the WebJobs split into small pieces of independent functionality, my intention is to rewrite these in F# one by one. With no user interface to consider, and the operation of each task already implemented, I can focus on the language, and the functional implementation.