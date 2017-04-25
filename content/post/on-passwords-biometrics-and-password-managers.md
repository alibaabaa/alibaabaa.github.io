+++
date = "2016-02-26T16:43:15+01:00"
draft = false
title = "On Passwords, Biometrics, and Password Managers"
thumbnail = "https://az761005.vo.msecnd.net/uploads/2016/02/iris-79893_960_720-300x225.jpg"
+++

#### What is a password?

It seems a ridiculous question to even pose. Computers, and more specifically the networking of computers, has made the password ubiquitous in society. We all know what they are, and the vast majority of us encounter them on a daily basis as part of our lives. We've become so familiar—some may say _overly familiar_—with passwords that the very meaning of them becomes lost. Somewhat like repeating the same word over and over until it sounds like gibberish.

![](https://az761005.vo.msecnd.net/uploads/2016/02/password-usage.png) Use of the term "password" since the 60s

The reason passwords have become so prevalent is that they are particularly convenient for authentication. We live in a world where we expect personalised access to services right across the globe, at the touch of a button, with no interaction with another human being. And if we want access to services that are personal, or private, or merely tailored specifically to us, then we need to be able to convince the computer system providing that service that we are who we say we are. It turns out that passwords are an incredibly convenient way to do that.

#### What's so good about passwords?

Give a system your username, and it knows what data it holds that you want to access. Give it a secret string of text that is tied to that username (i.e., the password), and it knows you are permitted to access that data. It's an elegant and universally available gate-keeping mechanism, and one that the vast majority of users understand implicitly. Because passwords are also found outside of the digital world, everywhere from telephone banking to secret treehouse clubs to [Lord of the Rings](https://www.youtube.com/watch?v=DgHCM68KkPY&t=118), they require little explanation as to their purpose.

![](https://az761005.vo.msecnd.net/uploads/2016/02/maxresdefault-795x331.jpg) The Doors of Durin opening to a correct password in Lord of the Rings

Passwords have another benefit, in that they are accessible to all. Unlike some other more exotic authentication mechanisms, the humble password doesn't require any special hardware or software to use. It isn't tied to any particular platform, and doesn't require investment from the user. Quite literally, anyone can have as many as they like. We can look to this convenience to understand why passwords are so pervasive in modern life.

Service providers _want_ you on their service, so it's no surprise that when there is no option other than to authenticate you as a user, they will use the method that is most likely to succeed. Service providers don't want you taking your business elsewhere because you didn't have the right hardware token, or didn't understand what steps you needed to take to log in.

Passwords also have some other excellent properties that we take for granted, one of which makes a password the _best and most effective form of digital protection we will_ **_ever_ **_have._ Hyperbole aside, passwords used correctly really do offer us the best level of protection, by virtue of where they're stored.

> Because a password is stored in the owner's brain, there is no way for someone to steal it without the owner knowing they've given it.

Passwords can be stolen. They can be conned from us by phishing scams, they can be coerced from us by a [woman willing to hit us repeatedly with a wrench](http://imgs.xkcd.com/comics/security.png), we can freely give them away to friends and family, but we always know when we've given them. This is important, but it also means we can choose _not _to give them. To take the point to its extreme, a court of law can order you to give up a physical key, and the authorities will retrieve it. A court of law can order you to give up a password, and you can choose whether or not you've forgotten it (although it should probably be noted that such [lapses of memory can incur prison sentences](http://www.washingtonpost.com/wp-dyn/content/article/2007/10/01/AR2007100100511.html)).

#### Enough about the wrenches, show me the entropy

You'll have to excuse our brief excursion into the world of secret agents and nation states back then. Let's be honest, you're not exactly [Edward Snowden](http://www.theguardian.com/us-news/edward-snowden), but that doesn't mean you shouldn't make reasonable attempts to protect your own data from prying eyes.

Passwords have another property that makes them ideally suited for use in authentication. Despite their relatively small size, passwords can be stuffed full of entropy. I am not a smart person, so I'm not talking about thermodynamic entropy here. Let's define entropy with the help of Google:

> Entropy (_noun)_: lack of order or predictability

![](https://az761005.vo.msecnd.net/uploads/2016/02/ps3.png) A password strength meter

Our passwords are something we don't want others to be able to guess, so entropy sounds like a good thing for them to have. A lot of the password strength meters dotted around sign up forms on the web perform a naive calculation of the number of _bits of entropy_ the entered password has. The idea is that our well trained brains will see a red bar and keep typing until it goes green, thus creating a stronger password. Different password meters have a different number of bits of entropy that they think are good enough before rewarding us with a green "well done" bar.

> Let's sidetrack for a moment and have a go at this naive calculation ourselves to get a better understanding of what these meters are doing. For the purposes of our own password meter, we're going to decide that _64 bits_ is enough entropy for a green bar. But what is a _bit_ of entropy and how do we work out how many bits a password has?
> 
> Basic computing fundamentals tells us that data in its most basic form, is just a series of 1s and 0s. A single 1 or 0 is therefore the smallest amount of data we can store, and is referred to as _one bit_. We can think of any choice between two values (1 or 0, on or off, heads or tails, etc) as being a single _bit_ of choice. If we refer back to Google's definition of entropy as a lack of order or predictability, then we can say that as long as there's an equal chance of either value, then a choice between two values has one bit of entropy.
> 
> This is all well and good, but we typically have more than just the letters _a_ and _b_ to choose from when creating a password. So how do we go about working out the amount of entropy in a single character password when we have more than just two characters to choose from?
> 
> For the mathematicians reading this, we calculate the bits of entropy of a single character as log<sub>2</sub>(_x_), where _x_ is the number of available characters. For the rest of us who aren't so into our logs, let's just carry on like that didn't happen, and it will all become clear.
> 
> If we're building a password meter based on measuring bits of entropy, then we need to pick a sensible set of characters that we think the user might pick from so that we can make our calculation. The basic alphabet has 26 letters. Add in all the uppercase, which is another 26, gives us 52\. We like to think people may use numbers. That brings us to 52+10 = 62\. Let's chuck in ! and $ (64), at which point we've got everything we need for _Pa$$word! _If you're thinking that I've made some crazy assumptions here, then you'd be right, but we have to start somewhere.
> 
> Now that we've decided that the user is likely to be working with a character set size of 64, we can work out how many bits of entropy each character is worth. We do this by working out what we need to raise 2 by to get our character set size. We can test this works on our heads or tails example from earlier. Two choices means the calculation is 2_<sup>x</sup>_ = **2**, where _x_ is the bits of entropy, and the bold 2 is the number of possible outcomes we have. The solution is _x_ = 1, which matches what we discovered earlier (two choices is one bit of entropy).
> 
> Doing the same with our 64 characters, we can see that our calculation is 2_<sup>x</sup>_ = 64\. A little trial and error will show that in this case, _x_ = 6\. Therefore we can say that a character in this password is worth 6 bits of entropy. Working out the entropy for passwords with more than one character is mercifully easy: we just add another 6 bits for each character. Therefore while a 1 character password (_P_) could be said to have 6 bits of entropy, a 4 character password (_Pass_) could be said to have 6*4 = 24 bits of entropy. From here we can work out that our password meter should turn green once the user has entered 11 characters. We decided 64 bits of entropy is good enough, and with each character worth 6 bits, 6*11 = 66.
> 
> We could do some smarter things, like adjust the entropy each character is worth based on what character sets the user has entered, rather than relying on a pre-calculated "bits per character" measure, but for the sake of demonstration, we'll leave our password meter here.

The problem with this implementation, and other such password strength meters, is that they mean very little, practically speaking. We have to make assumptions about the entropy of each character, and these assumptions are often wildly optimistic (and sometimes too pessimistic). But why?

#### Passwords aren't the problem

Having extolled the virtues of passwords, all the benefits they bring and positive properties they exhibit, you could almost be forgiven for wondering why they're so widely loathed. The clean and clinical world of ideal passwords is great, but as with many things in life, everything starts to get messy when humans are added to the mix. The problem is, we're just not particularly compatible with passwords, to the extent where our interactions with them tend to negate almost every benefit that they should bring.

For instance, take the ability to stuff a password full of entropy. When the generation of a password is left to a person, the "lack of order or predictability" required to make it secure is lost. As a species, we've spent our entire existence trying to create order from chaos, to bring stability and predictability into our lives. Construction and building is the removal of entropy in action. To demand that we now create passwords that lack order and predictability is utterly absurd. It's so foreign to us that we would struggle to know how to start. Mashing on the keyboard is a potential strategy, but even then our hands fall in the same predictable places, hit the same patterns of predictable letters. If we aren't to mash randomly, then what else are we left with? We simply don't have the capacity to "choose" unpredictable, disorderly passwords.

![](https://az761005.vo.msecnd.net/uploads/2016/02/password_monitor.jpg)

We also sabotage our ability to know when we've given our passwords away, by writing them down. This can happen because we're forced through password policies to create passwords that are simple too complex to remember. You know the sort. "Your password must contain at least one uppercase, one lowercase, one special character, one number, be at least eight characters long, must not contain your username" _blah blah blah_. Of course, the reason for these rules in the first place is to attempt to force us to add more entropy to our passwords. All that actually ends up happening is that we write the things down and stick them around the screen or under the keyboard because we've created something so complex that we can no longer remember it.

#### Password expiration is harmful...

The same is true of password expiration policies. "Every x weeks your password will expire and you must set a new one, except the new one can't be any of the last 15 you used." Again, the new password is simply written down. Password expiration is a particularly insidious example of pointless password policies, because it has no obvious security advantage.

![](https://az761005.vo.msecnd.net/uploads/2016/02/windows-password-expired.jpg)

In the event that an unauthorised user is attempting to break into an account using a brute force technique, the most likely outcome is that either the password is weak and is cracked well before it expires, or is strong, and the unauthorised user isn't going to get in during their own natural lifetime, regardless of any expiration policy. Password expiration is equally useless _after_ an attacker has gained entry. Most likely, they will get what they were after and be gone long before the password expires, or... they'll simply change it. It could be argued that at least in this scenario, the _real_ user has been made aware that someone else has accessed their account. But it's probably more likely they'll presume they've locked themselves out or forgotten the password and simply request that it be reset.

#### ...but not as harmful as password re-use

And so to avoid writing down passwords, we use the same one across all the services we use. Maybe we decide to be clever, and have a different "good" password for important things like online banking, but otherwise we offer up the same one again and again. Reusing passwords is a huge security risk, made all the worse by how easy and convenient it is for users to do. The obvious problem with reusing a password is that once it's been compromised once, all other accounts using the same password should also be considered compromised. We hardly see a day go by without another service making the news for having their systems breached and user data stolen. If you reuse passwords, and that password is stolen from one service you use, your entire online life is now in the hands of the perpetrator, with no further effort required.

Reusing our passwords is perhaps the most irresponsible and damaging thing we can do with regard to the security of our digital data, and yet passwords are so incredibly inconvenient to use and manage that we do it anyway.

#### Biometrics solve nothing

![](https://az761005.vo.msecnd.net/uploads/2016/02/iris-79893_960_720-300x225.jpg)

I want to touch briefly on biometrics, which is an idea that seems to go in and out of vogue as a means of authentication. Biometrics involves observing some physical characteristic of us, such as our fingerprint, iris, or face and using that to determine whether or not we are who we claim to be. On the surface, it sounds like a convenient and practical solution to the password quagmire we find ourselves in today. The problem with biometric authentication is that it's an inferior mechanism to passwords in every way.

A user can't realistically refuse to hand over their biometric data, and in some jurisdictions they need only be a suspect in an investigation for [law enforcement to compel them to unlock their data using biometrics](http://blogs.wsj.com/digits/2014/10/31/judge-rules-suspect-can-be-required-to-unlock-phone-with-fingerprint/). We also lose the useful property of knowing when we've given it away, as evidenced by the [seven year old who broke into his dad's iPhone while the man slept](http://www.redmondpie.com/how-a-clever-7-year-old-boy-bypassed-touch-id-on-iphone-6-plus/). Biometric authentication also isn't universally available. It requires a special sensor for whatever part of ourselves we are measuring, be it a simple webcam, a fingerprint scanner, or iris scanner.

We can look at some other useful properties of passwords in quick succession to see how biometrics fall short again and again. If a malicious user manages to steal a likeness of our fingerprint, we can't just change the one we have already. Ok, we may have nine more, but those things can't be chopped off to grow a new different one. Speaking of which, we can still "lose" or "forget" our biometric data. Fingers can be lost through a variety of unpleasant situations, as can eyes, and the majority of other existing biometric data points.

Despite the difficulties we have in putting passwords to effective use, they're still far ahead of any current form of biometrics we have available. So then what do we do? If passwords are the best thing we've got, but we're hopeless at using them well, what are we left with? The answer is, we compromise.

#### Enter the Password Manager

We know that passwords are effective as an authentication mechanism, and when used correctly, offer a more than adequate level of protection. The best way to improve our interaction with passwords is to mitigate the risks that we expose ourselves to through bad practice. We give up some of the less important benefits that passwords bring, in order to strengthen our behaviour in areas that have the most impact.

In practical terms, this means sacrificing a certain amount of universality (making them slightly less convenient to use away from our own devices), and writing them down (in a safe place). What we get in return for that is a complete elimination of re-use, and the ability to pump each password full of large amounts of entropy (or unpredictability).

![](https://az761005.vo.msecnd.net/uploads/2016/02/password-managers.png) Dashlane, 1Password, and LastPass

The password manager is the tool that enables us to make this compromise. The concept is straight forward. A password manager provides the user with a secure vault which they store all of the passwords for all the services they use. It will auto-generate new random (i.e., high entropy) passwords for new logins or when changing passwords, and provides some mechanism for filling website login forms with the stored passwords. All of these passwords are then encrypted based on a single "master password", which is the only password the user need create or remember.

A password manager removes the need for us to create passwords, re-use passwords, and remember passwords. By "writing them down" digitally, and locking them away in a virtual safe deposit box, we receive a whole slew of security benefits. Password managers tend to be paid-for products, and as a result, many of them provide additional bells and whistles in order to attempt to convert us, such as warning us when a service we have an account with has been compromised, and offering to automatically change our passwords to something more secure on supported sites.

Most offer some form of cloud syncing to help improve the convenience of accessing our passwords from all our different devices and keeping the various stores in sync. Whether or not the individual considers cloud sync to be a step too far along the spectrum from security to convenience is a personal decision. The three main players in the field are [1Password](https://agilebits.com/onepassword), [Dashlane](https://www.dashlane.com), and [LastPass](https://lastpass.com/). Both Dashlane and LastPass require the user's vault to live on their cloud service, while 1Password exists as a software product in its own right, and offers the ability to cloud sync through services such as Dropbox and iCloud if the user wishes to do so.

While the right personal choice in password manager may not be obvious, the clear and immediate improvement that using any reputable solution will bring to a user's password habits is immeasurable.

Passwords are (and rightly should be) an important part of our digital lives, and they're not going anywhere soon, despite whatever "breakthrough" technology the media might write about. While we're not all that good at using passwords well, the tools exist to help us bridge the gap, and fundamentally improve the safety and security of our digital interactions.