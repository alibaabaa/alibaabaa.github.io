---
date: "2015-07-27T16:49:13+01:00"
layout: post
title: "Hardening against web account enumeration"

---

We all know by now how important it is to help users of our web services keep their accounts secure, by doing what we can to ensure they are using strong passwords. And the variety of methods at our disposal to assist them in this, from secure password policies to regular password expiration, are well documented.

Perhaps less well documented is a tangential but equally important threat. Sometimes, we need to defend against more than just unauthorised access to users' accounts, and instead defend against revealing the existence of an account at all.

#### Ashley Madison and social engineering

The most recent and high profile example of this is the self-proclaimed "infidelity service" Ashley Madison, a website that assists would-be unfaithfuls in having affairs. Ashley Madison hit the headlines when their internal database of users was stolen, and purportedly offered for sale on the black market. What journalists generally failed to report was that the Ashley Madison website was already openly reporting which email addresses were and weren't registered to anyone willing to go looking. The forgotten password confirmation page was presented differently based on whether or not an entered email address was found in the system.

Of course, there are other less scandalous scenarios where keeping the existence of accounts a secret might be important. In a business setting, it might be a condition of an NDA that it be kept under wraps that company A is a customer of company B. Exposing the existence of registered user accounts @secretbiz.com could cause big legal issues down the line.

There's also a less dramatic and equally less obvious risk posed by allowing account enumeration on entirely innocuous websites. Any ability to discover a person's use of a service opens them up to more direct phishing and social engineering tactics. Once you know that someone uses a given service, you can confidently target them with fraudulent emails purporting to be from that service.

When the privacy of the users of your service is of paramount importance, and the very knowledge of their existence must be kept under wraps, strong authentication methods are not enough. We need to defend against account enumeration attacks.

But just what is account enumeration, and how do we go about defending against it? There are several common vectors for attacks, and all of them must be considered if the threat is to be mitigated.

#### Login form

The first line of defence is the service's login form. Ignoring the password field, what happens if someone enters a username or email address that isn't registered in the system? Do they receive a message informing them that no account exists? Yahoo works particularly strangely in this regard. If a registered username is used with an incorrect password, the non-disclosing message "Invalid ID or password." is shown, presumably in an attempt not to reveal whether the account exists. But entering an unregistered username produces a completely different message.

![](https://az761005.vo.msecnd.net/uploads/2015/07/yahho_enum.png) Yahoo exposes the (non-)existence of accounts

This message gives the game away, because we now know that if we get this message, then an account doesn't exist, but if we get the message "Invalid ID or password.", what it actually means is that the username is registered, and we just got the password wrong. To correct this, it's important to show the same message for registered and unregistered failed login attempts.

So we've changed the message to show the same thing whether the user login is registered or not, which makes the login form safe, right? Well, not quite. Protecting against discovery of user accounts isn't just about the information shown on the page, it's about every piece of information we disclose. Just one difference in how we handle a registered account versus an unregistered account, and it's game over.

Take a look at the response timings below for a different site when submitting the login form:

![](https://az761005.vo.msecnd.net/uploads/2015/07/timing_attack.png) Timings between a known registered account (top) and known unregistered account (bottom)

We can observe that we waited approximately six times longer for a response on a registered account (261ms) than we did for an unregistered account (just 38ms). Even if the validation message we get back is the same, the message itself doesn't need to give anything away for the site to be vulnerable. We have all the information we need right here to tell whether or not an account exists. If the login form responds in less than 50ms, the account probably doesn't exist. If it takes more than 200ms, then it probably does.

Mitigating this style of timing attack in our own applications comes down to identifying why there is a discrepancy between the processing duration of the two responses, and potentially building in some artificial delay on the server side to bring the two response times much closer together. Typical network variances means the two don't need to be exact. They just need to be close enough to prevent observation of a consistently different behaviour.

#### Forgotten password

Once we have adopted the principle of providing the same observable behaviour for both registered accounts and unregistered accounts, the rest becomes an exercise in how best to handle that in situations where it appears counter-intuitive to expected behaviour.

For example, how can the same observable behaviour realistically be applied to a forgotten password form? Usually, a user would enter their registered email address and receive an email that potentially provides a link for them to reset their password. The best way to handle this where an unregistered email address is entered is not so immediately obvious, but with a little thought we can come up with a solution.

![](https://az761005.vo.msecnd.net/uploads/2015/07/1800flowers.png) 1-800 Flowers exposing that an email address doesn't exist in their database

One option here is to proceed regardless of whether the email address is valid or not. On the confirmation screen, the user is informed that they will receive an email _if_ the address they provided is registered in the system. Again, we have to be careful in this scenario that we aren't vulnerable to timing attacks, by artificially adjusting response times if necessary.

#### Account lockout

While locking out accounts after a given number of incorrect login attempts, it's important to consider that this feature is potentially open to abuse with regard to account discovery. If failed logins against accounts that don't exist aren't tracked and reacted to in the same way as legitimate accounts, then this presents another avenue to work out whether or not an account is present in a system. If we warn a user that realuser@email.com has been locked out following five subsequent attempts, but 38fn438@invalid.com allows endless attempts because the account doesn't exist, all we've done is expose the presence of one account over another.

#### Registration form

Something similar can be achieved on account registration forms, where we send an email confirmation for a newly created account, or a reminder to the registered email address if the account already exists, reminding them that they already have an account.

![](https://az761005.vo.msecnd.net/uploads/2015/07/apple_enum.png) Apple tells the world that I have an Apple ID

Registration forms should be of additional interest, because if your web service has an open and public account registration that allows users to sign up by themselves, then it's worth questioning whether account enumeration is something you should be concerned about.

After all, if anyone can create an account with any email address (even if they can't verify the account with that address), then account enumeration attacks aren't of much use, because there's no way to know whether the account was created by the owner of that email address or not.

#### Design with purpose, not by accident

You may decide that actually, account enumeration isn't all that big a risk for your service, and the cost of implementing specific defences against account discovery can't be justified by the risk posed. In many cases, this is a perfectly reasonable decision, but it should be just that: a decision.

By making decisions like this upfront can have other benefits, such as improving usability by enabling you to inform a user on the login screen that it's the email address they're getting wrong, not the password. By making choices about design pro-actively rather than retroactively, we can both maintain the security of our users, and improve their experience.