+++
date = "2015-06-06T15:01:40+01:00"
draft = false
title = "HSTS and why everything you serve should be over HTTPS"

+++

Something I've wanted to add to PasteMonitor for a while is HSTS (or HTTP Strict Transport Security), and today I actually got around to doing it. As of today, PasteMonitor is serving up `Strict-Transport-Security` response headers for all requests.

I've written previously about how [the browser can be a valuable ally in securing your web applications](http://www.tomeggington.co.uk/the-browser-is-your-friend-defence-in-depth-via-the-client/), and HSTS is a great example of one of these mechanisms in action. But what is HSTS, and what does it offer that's missing with plain old https?

#### The man in the middle

As we all know, https is great. Not only does it encrypt our connections to websites so that no one else can see the information we're sending and receiving, but it also verifies that the information we're sending and receiving is going to who we think it is, and coming from who we think it is. This is a universally good thing for consumers.

![A clear, unambiguous illustration of a MITM attack](https://az761005.vo.msecnd.net/uploads/2015/06/maninthemiddle.jpg) A clear, unambiguous illustration of a MITM attack

Occasionally someone will question the value of serving public resources over https. For example, why would a news website want to deliver its content over https? It's the same content for everyone, so where's the advantage in encrypting the traffic as it travels between the site and the end user's browser? Surely no harm can come in a situation like this from delivering content over standard old http.

The answer to why https is still important in a use case like this lies not in the encryption aspect of https, but in the _verification_ it offers. Let's use the BBC News website as an example. Navigate to www.bbc.co.uk/news in your web browser, and you'll notice that there is no browser padlock. Your request to the site for the news homepage was sent in the clear, and the response received was also unencrypted. This is bad. What's worse still, is that if you attempt to establish an encrypted connection by visiting https://www.bbc.co.uk/news, the site will _actively redirect your browser_ to the unencrypted http resource.

Not only does the lack of https mean the communication between you and the BBC website can be intercepted, but additionally because https wasn't used, there is no way for your browser to verify the content you receive, and so anyone who can see your communication can _modify the response_ from the website before it gets to you, and you'll likely never know.

This is known as a man-in-the-middle attack (typically abbreviated to MITM), and maybe you're thinking "no one cares what I'm looking at on the BBC, and no one would bother to modify the pages it send back to me." Except that is [exactly what happened](http://arstechnica.com/tech-policy/2013/04/how-a-banner-ad-for-hs-ok/) to customers of a cable internet service provider in the US. When users visited popular websites such as apple.com, the ISP automatically intercepted and modified the web pages the sites responded with, surreptitiously injecting their own content and advertising into the pages. Naturally, users presumed that these websites had chosen to put ads into their pages. It's the sort of thing that can do massive damage to corporate identities and brands, especially for a company like Apple where design and aesthetic is such an important part of the product experience.

But it's not just site owners and operators who should be concerned. There have been various [horror stories around ad networks](https://www.theverge.com/2014/9/19/6537511/google-ad-network-exposed-millions-of-computers-to-malware) that have been victim to malicious software injection, where instead of a site serving up a promotion, it instead inadvertently serves up viruses and other unpleasant baddies to visitors. Couple that with the ability for a third party, such as your internet service provider or a free wifi provider, to inject content into any unencrypted website you visit, and it begins to become clear that anything other than one hundred percent https one hundred percent of the time is just asking for trouble.

#### This really is about HSTS, I promise

But if https is so great, then what is HSTS, and why is it needed? To answer this, we can go back to the news website example from earlier. Let's suppose for a moment that instead of redirecting secure requests to insecure requests, that the BBC news website did the exact opposite and redirected insecure requests to secure requests: imagine that a user visiting http://www.bbc.co.uk/news was redirected by the site to http<span style="text-decoration: underline;">**s**</span>://www.bbc.co.uk/news. This redirection means that the user's communication with the site is now encrypted and verifiable, i.e., no one can tamper with the response, to inject adverts (or change the headlines) before it gets to you.

This is great, and an enormous step forward with regard to the user's safety and the protection of the reputation of the BBC. But there's still a problem. When the user types www.bbc.co.uk/news into their web browser and hits enter, that first request (and response) is still unencrypted and unverifiable. There's nothing to stop a man-in-the-middle from stripping out the secure redirection response and replacing it with whatever they like. This is the problem that HSTS was created to solve.

When HSTS is set up on a website, all its secure responses contain the http header `Strict-Transport-Security` which means that requests to the site should only ever be made over https. When the web browser sees this header, it remembers that the site has set it, and if the user tries to visit the site again in the future, the browser will remember that all requests should be made over https, even if the user hasn't specifically typed https:// into the address bar. Using this mechanism, even the first request to a website is made securely if the user has visited it before.

#### Preloading

This situation is a great improvement on what happens on a site without HSTS, because now the only insecure request that could potentially end up being sent to a site, is the very first time the user visits that website. But still, it seems kind of a shame to have come all this way and still leave open an opportunity for interception, even if it's only once.

Fortunately, there is a solution to this problem too, and it's called HSTS preload. Chrome maintains an HSTS preload list, which is used not only by Chrome, but also by other web browsers including Firefox and Safari ([and Internet Explorer soon we're promised](http://blogs.msdn.com/b/ie/archive/2015/02/16/http-strict-transport-security-comes-to-internet-explorer.aspx)). By submitting a site to the preload list, browsers will know that the site has an HSTS policy in place before even the first user visit, and as a result, the very first request can also be made over https.

#### Implementation

Implementing HSTS in an ASP.NET application is straight forward and can be accomplished from the web.config, as [outlined in this Stack Exchange answer](https://serverfault.com/questions/417173/enable-http-strict-transport-security-hsts-in-iis-7/629594#629594). It's important to note that the HSTS standard states that the `Strict-Transport-Security` header should _only_ be sent over secure connections, and not over insecure http.

Preloading can be achieved by following the guidance on the [HSTS preload submission site](https://hstspreload.appspot.com/). This is something I can't currently do with PasteMonitor, because the site's certificate is only valid for www.pastemonitor.com, and preload submission requires a valid certificate for the root domain.

Until I get this fixed up, I suggest navigating directly to https://www.pastemonitor.com/, especially if you start seeing ads on the site :)"