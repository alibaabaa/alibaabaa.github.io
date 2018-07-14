---
date: "2015-04-30T16:29:54+01:00"
layout: post
title: "The browser is your friend—defence in depth via the client"

---

When thinking about the security of applications we build for the web, the scale and breadth of attacks an application might face can be overwhelming.

*   How should the server OS be configured?
*   How should the web server be configured?
*   What security defaults does my chosen web framework come with, and do I need to change them?
*   What use cases am I not considering?
*   Am I making assumptions anywhere about user input?

All of this is important stuff, although you can typically do away with thinking about the first two if your application is running inside a [platform as a service](http://azure.microsoft.com/en-gb/overview/what-is-azure/). When laid out as a tidy list on a web page, it doesn't look too bad, but unfortunately it's not at moments like this that it's important.

We all know that [defence in depth](https://www.owasp.org/index.php/Defense_in_depth) is the way to a happier more secure online existence for our products, but when you're half way through implementing some complex new feature that runs right through the stack, your brain has a lot to deal with. A singular momentary lapse in vigilance, one trusted input that shouldn't be trusted, might be all that's needed to completely unravel an otherwise well designed, secure system.

[![](https://az761005.vo.msecnd.net/uploads/2015/04/exploits_of_a_mom.png "Her daughter is named Help I'm trapped in a driver's license factory.")](http://xkcd.com/327/) (xkcd of course)

But that's what defence in depth is all about. Typically, evil input from the client has to traverse more than one layer to exploit its target, and so we build up these multiple layers of null checks, overflow checks, value parameterisation, etc., <del>knowing</del> praying that <del>if</del> when we forget to check something somewhere, the value will still be caught elsewhere.

Perhaps the easiest, and most often overlooked, defence that we can depend on is the browser itself: the very tool the user is ([probably](http://www.telerik.com/fiddler)) using to send input to our applications. On the surface, this might appear to contradict the mantra "[All input is evil](http://www.codemag.com/Article/0705061)". If no input is to be trusted, and the web browser is sending us input from the user, then how can we possibly trust the browser as a line of defence?

#### This is 2015? What happened to 2005?

The apparent dichotomy between not trusting input, but trusting the browser, stems from the false mindset that web application security is about protecting the application. Protecting the application and its processes _is_ an important tranche, but equally as important is protecting the user, the user's data and the user's actions. When we re-evaluate security on the basis of the user's safety and protection, our perspective shifts, and pointing out that the browser can be part of the defence is, well, obvious.

[![Internet Explorer detecting and preventing a potential XSS attack.](https://az761005.vo.msecnd.net/uploads/2015/04/ie_xss_prevent.png)](https://az761005.vo.msecnd.net/uploads/2015/04/ie_xss_prevent.png) Internet Explorer detecting and preventing a potential XSS attack.

The browser is a much more complicated beast than it used to be. You only have to look at [Chrome's most recent security feature](http://www.wired.com/2015/04/google-chrome-password-alert/) to realise that. The browser is no longer there just to render some HTML and CSS and execute the occasional alert() dialogue. The browser is now actively protecting its user in ways too numerous to mention, and taking advantage of these features is the ultimate in low hanging fruit for web application security. Unlike anything further up the stack, the browser is server side agnostic, and so these features apply equally to all.

I won't go into detail about the reasons for and against implementing these protections, as others have already done a better job than I could. Instead, I've chosen to list what I think of as the 'quick wins', and link to proper explanations and documentation regarding why the feature exists, and why you might want to consider it.

*   [HttpOnly cookies](http://blog.codinghorror.com/protecting-your-cookies-httponly/) - offer protection from XSS data grabbing
*   [Secure cookies](http://security.stackexchange.com/questions/100/how-can-i-check-that-my-cookies-are-only-sent-over-encrypted-https-and-not-http) - prevent cookie data leaking over unencrypted connections
*   [x-content-type-options](https://msdn.microsoft.com/library/gg622941%28v=vs.85%29.aspx) - set to _nosniff_ to prevent IE and Chrome from processing your files in ways you don't intend
*   [x-frame-options](https://developer.mozilla.org/en-US/docs/Web/HTTP/X-Frame-Options) - set to _deny_ to protect your users from clickjacking
*   [strict-transport-security](https://www.owasp.org/index.php/HTTP_Strict_Transport_Security) - also known as HSTS, informs the browser that it should only communicate with your domain over https

The wealth of options when it comes to communicating your intentions to the browser is an ever growing list of HTTP headers, and I could never hope to cover it in sufficient detail here. I haven't even touched upon [CORS](http://enable-cors.org/) and why that might be important for you and your applications. As ever, the OWASP site, and specifically their [cheat sheet section](https://www.owasp.org/index.php/OWASP_Cheat_Sheet_Series), is a great place to start when considering web security."