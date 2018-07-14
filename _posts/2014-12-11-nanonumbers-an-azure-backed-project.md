---
date: "2014-12-11T16:36:43+01:00"
layout: post
title: "NanoNumbers: An Azure Backed Project"

---

Every November, hundreds of thousands of people get involved in [Nanowrimo](http://nanowrimo.org), where each tries to write a 50,000 novel in a month. The aim is to help wannabe novelists to actually commit something to paper/screen, and as the target is numbers based (1,666⅓ words a day are required to hit the goal). This lends itself to statistics, charting, and competition. Naturally, being about writing and writers, the official Nanowrimo site only provides a limited set of online stats for those who like numbers.

The site allows you to tag other users as "writing buddies", who may be online friends, offline acquaintances, or anything in between, What I really wanted to see each year was how I compared day-to-day with my "writing buddies". I wanted a chart that would show our daily word counts together. This isn't something provided by the official site, but Nanowrimo does provide a (slightly clunky) API, so this year on October 28th, just three days before the event started, I decided to build my own solution, [NanoNumbers](http://www.nanonumbers.com).

## The environment

The tools and technologies I would use had to fit into a few criteria. I wanted to keep things cheap. This was just a side project for a bit of personal fun and development, so I couldn't end up with something that would end up having a high cost to run. With only three days, I also needed to use something familiar, so that I would on the whole be spending my time building rather than learning and searching for answers.

[![Azure management console](https://az761005.vo.msecnd.net/uploads/2014/12/azure.png)](https://az761005.vo.msecnd.net/uploads/2014/12/azure.png)

The obvious answer was [Microsoft Azure](http://azure.microsoft.com). I've been involved in Azure projects in my day job for several years now, and just completed a large project for a client, which runs entirely on the Azure infrastructure. My MSDN subscription would also ensure that my costs would lie somewhere between negligible and non-existent ([although Azure isn't exactly expensive](http://azure.microsoft.com/pricing/)). Using Microsoft Azure also meant I already had an account in place with the provider, and I wouldn't need to think about capacity, licensing, software and hardware support, or any of the other concerns that usually accompany picking a web host.

## Up and running fast

The other great thing about Azure is just how easy it is to get a basic website up and running. And I mean **really easy**. Just take a look at the screenshot below. That isn't a cut down version of the steps required. That's the screen you get when you press the **New** button from the Azure management console. I just select Website > Quick create, then choose a unique name for it across the Azure service, add it to one of my existing pay as you go plans (or create a new one) from the drop down, and that's it. New site provisioned.

[![Azure new website](https://az761005.vo.msecnd.net/uploads/2014/12/newwebsite.png)](https://az761005.vo.msecnd.net/uploads/2014/12/newwebsite.png)

From there, Azure gives you FTP access credentials, in case you need them. Personally, I just use the Visual Studio publish profile that's provided, which makes it as easy to publish to the site from Visual Studio as it is to create the website in the first place.

## Building a UI

With the site provisioned and open in Visual Studio, it was time to get down to the job of actually building something. I knew that I wanted to avoid the classic developer-built look. You know the one. That anaemic black and white look, with blue underlined links, and blocks of colour with corners so squared off you could cut your finger on them.

Luckily, [Bootstrap](http://www.getbootstrap.com) makes it a breeze to throw something together that looks like it's had a bit of care taken over its appearance. It's not a magic cure, and some design forethought and consideration is still required, but for very little effort, you can get something that's serviceable.

![NanoNumbers homepage](https://az761005.vo.msecnd.net/uploads/2014/12/nanonumbers-home.png)

What you see above is the finished homepage, and if you've ever used Bootstrap before, it should look familiar, because NanoNumbers is vanilla Bootstrap. Those grey boxes are just a couple of jumbotrons, and then the standard styles have been applied to the form input and button. It's not going to win any design awards, that's for sure, but we've come a long way from the bad old days where creating a website with a consistent style and design was **hard work**. By comparison, the only thing required from me for the NanoNumbers design was a well structured HTML document with some Bootstrap specific classes in the right places. No fighting with CSS margins and padding required.

## User journey

As you can see, the user flow is pretty straightforward. From the user's perspective, there's little room for confusion. Enter your Nanowrimo username, press the blue button. The official Nanowrimo site makes the behind the scenes processing a bit more complicated, thanks to some irregularities in how it handles usernames, but we'll get to that shortly. From there, the user moves to a second page, which displays a line chart of their cumulative word count plotted against the days on November, and a list of their writing buddies, which they can use to toggle on or off that person's line on the chart. And that's the basic flow of the website. On returning to the site, a user will still return to the homepage first, but their username is prefilled into the form.

## Getting the user data

When a user enters their username into the page and submits the form, getting the user data from the API should be straightforward, right? Well, it kind of is, but it depends on the username. On Nanowrimo, a username doesn't have to just be alphanumeric. According to the Nanowrimor sign-up page, "letters, numbers, and spaced are allowed", but a browse of the forums will also reveal usernames with dots.

[![Nanowrio user account creation](https://az761005.vo.msecnd.net/uploads/2014/12/nano-username-300x110.png)](https://az761005.vo.msecnd.net/uploads/2014/12/nano-username.png)

Whether the system still allows usernames containing dots to be created, or whether these are accounts from previous years, is irrelevant. We have to deal with them either way, because accounts from previous years can be reused, which means that someone with a dot in their username may try to use NanoNumbers.

Why does any of this matter? It matters because the Nanowrimo API won't find a request for a username that contains spaces or dots. We have to convert a username such as "User with spaces" into the systemised form before we can request it from the API. Unfortunately, the API documentation is pretty sparse and doesn't give us much helpful guidance. _In fact, it doesn't even tell us that we'll need to perform this conversion!_ Fortunately however, other exposed parts of the Nanowrimo site also use the systemised form of the username, including their profile page URL. So find a user with these characters in their username, and you can work out how these names are systemised.

[![Nanowrimo profile](https://az761005.vo.msecnd.net/uploads/2014/12/nano-profile.png)](https://az761005.vo.msecnd.net/uploads/2014/12/nano-profile.png)

With a bit of trial and error like this, I found that the following conversions take place to get from a Nanowrimo username to the system representation (and the representation required to request it from the API).

*   A space " " becomes a hyphen "-"
*   A dot "." becomes a hyphen "-"
*   A dot followed by a space ". " becomes a hyphen "-"

With this information, and the observation that everything gets converted to lowercase, I was able to put together a function that would allow me to systemise these usernames as and when I needed to.

    public static string FromUsername(string username)

    {

        username = username.Replace(". ", "-");

        username = username.Replace(' ', '-');

        username = username.Replace(".", "-");

        return username.ToLowerInvariant();

    }

## Screen scraping

This gave me enough information to make the HTTP GET request to the API to retrieve the user's daily wordcount data as XML and store this down to Azure table storage, which I cover in more depth later. This data from the API provides enough data to plot a daily chart for any Nanowrimo participant, but what it doesn't give me is a list of the participant's "writing buddies". There isn't a published method for retrieving a participants writing buddies via the API, so I needed an alternative.

[![The NanoNumbers chart page, with a list of the participant's buddies down the left, and a visual representation of the word count on a chart.](https://az761005.vo.msecnd.net/uploads/2014/12/nanonumbers-stats.png)](https://az761005.vo.msecnd.net/uploads/2014/12/nanonumbers-stats.png) The NanoNumbers chart page, with a list of the participant's buddies down the left, and a visual representation of the word count on a chart.[/caption]

As it turns out, every participant has a public profile page on the Nanowrimo site, which lists their writing buddies, so some screen scraping was required to get these. To add a small additional hurdle, buddies are paged across several pages, so depending on how many buddies a user has, multiple screens would need to be scraped.

I used a regular expression to retrieve the buddies' system usernames:

    var usernameMatches = Regex.Matches(html, "<a href=\"/participants/(.+)\" class=\"user_link\">(.+)</a>");

And looked for the _next page_ link to determine if I needed to request another page of buddies:

    var morePages = html.Contains("class=\"next_page\"");

Screen scraping like this is a brittle approach to take - if the HTML structure of the page changes, there's a good chance this will stop finding buddies - but without a way to retrieve this via the API, it's all that is available. It can also be slow when a participant has a lot of buddies, because the scraper has to make multiple requests to the site and retrieve the complete markup of the page each time. Perhaps adding buddies retrieval functionality is something the Nanowrimo team may consider for future years.

## Caching

Presenting a user with the NanoNumbers chart page requires at least two calls back to Nanowrimo to populate with data. One for the participant's word count, and one to get the first page of buddies. Users who have a lot of buddies can expect a wait time of up to ten seconds or more for the list to populate on their screen. As I had no control over how long the Nanowrimo site took to respond, and it was the only way to get the data, there was little I could do about the raw response time. However, I did have complete control over the user experience and took measures to minimise the frustration that inevitably comes with waiting for things to load on the internet.

[![Buddies are loaded asynchronously so as not to affect the display of faster loading elements](https://az761005.vo.msecnd.net/uploads/2014/12/buddies-loader.png)](https://az761005.vo.msecnd.net/uploads/2014/12/buddies-loader.png) Buddies are loaded asynchronously so as not to affect the display of faster loading elements[/caption]

By making the buddies list request asynchronous, the rest of the page can be shown while the Nanowrimo site is still being scraped for buddies.

I addition to this, while I had no control over initial load times, I did have control over subsequent requests for the same data. By caching the response to these buddy requests, I ensured that after the initial scrape was complete,  future requests for this user's buddies would be serviced much faster.

    [OutputCache(Duration = 100, VaryByParam = "username")]

    public async Task<JsonResult> Buddies(string username)

    { ... }

Caching also has the additional benefit of limiting the number of requests made to the Nanowrimo servers. This is an automated system which makes automated requests against someone else's infrastructure, so I wanted to have as much control as possible over the outbound requests to Nanowrimo.

## Persisting data for longer with Table Storage

Output caching is useful for short term data persistence, but to keep costs low, I ran NanoNumbers from an Azure shared web hosting plan, which limits the system resources I can use in any given period.

[![NanoNumbers resources](https://az761005.vo.msecnd.net/uploads/2014/12/nanonumbers-resources.png)](https://az761005.vo.msecnd.net/uploads/2014/12/nanonumbers-resources.png) Azure console report of NanoNumbers' resource usage[/caption]

Once participant data has been collected from the API, and buddies have been scraped from the website, these are then persisted down into Azure's table storage. Microsoft describes table storage like this:

> The Azure Table storage service stores large amounts of structured data. The service is a NoSQL datastore [...]

In practice, what this gives is the ability to store "rows" of data, where each row has a "partition key" column and a "row key" column for indexing, and then any number of additional columns to store additional data. The partition+row key combination for a row must be unique in any given table, but there is no requirement for each row to have the same columns. This is somewhat of an alien concept for developers from a SQL background.

NanoNumbers uses one table to store user word counts, and another table to store buddy connections. Every row in Azure table storage has a timestamp indicating when it was last updated. I used this timestamp to detect stale data and re-request from the Nanowrimo site. I considered word count data to be "stale" after ten minutes, and buddy data after an hour.

## CDN for javascript

I originally set up NanoNumbers to point users out to a javascript CDN for the external libraries it uses. This includes jQuery, underscore.js, and a few others. The purpose of this was to remove from the site the system load that these resource requests would generate, and hand it off to a CDN instead. I'd always previously hosted these libraries on the box, so NanoNumbers felt like a good opportunity to do something different.

I soon changed my mind. Following a couple of days of smooth sailing with the site up, someone pointed out to me that the site was completely non-functional and looked terrible. Indeed it was. It turned out that the CDN had suffered a [massive regional outage](http://status.maxcdn.com/incidents/6nw7bsvb4r2j) a couple of days into November, at just the time when I needed everything to be running smoothly. What made this even worse was that their status page showed all green lights at the time, suggesting that everything was just great. I dropped the CDN after that, and brought everything back on server. In hindsight, trusting someone else's infrastructure for a critical part of your website, when you aren't paying for a service, doesn't strike me as a wise idea.

## Azure connection resets

Another frustrating issue I came up against was a result of Azure's own infrastructure. Because the site had only recently launched and wasn't receiving much traffic, it was effectively going to sleep to preserve resources. This is all well and good, until someone then attempts to connect to the site. I was experiencing both very slow response times for initial requests, and in some cases, connection reset messages in the browser. These were making it look at though the site was down and unavailable, even though subsequent requests would then succeed.

It seems I'm not the only person to experience this problem, and feels like a rather large oversight on the part of the Azure team if it's a widespread issue. To combat these connection resets, I had to set up an Azure web job, and configure it to make a GET request to the site every minute for the whole of November in an attempt to prevent it going to sleep and cutting people off.

## The Azure platform

Overall, using Azure is a great (and cheap!) way to get a service off the ground quickly. Then beyond that, it provides the tools to make growth and expansion easier to manage, providing options for both scaling up and scaling out. For me and NanoNumbers, it made the project a breeze to launch and to maintain during November. And as for the cost? The shared website cost me £6.16 for the month. Bandwidth and table storage were both negligible (we're talking pennies for the month). The web job was an outlier. Because I needed it running every minute, that bumped me from the free tier into the 'standard' tier. This ended up costing £8.90 for the month. If the site was busier, or Microsoft could get round to solving the issue of connecting to dormant sites, the web job would no longer be required.

Of course, it's also worth noting that my MSDN subscription gives me £35 of free credit every month, so in reality none of this cost me anything at all. Not bad for a platform that enabled a rapid turnaround and a wealth of services to help run and maintain it.