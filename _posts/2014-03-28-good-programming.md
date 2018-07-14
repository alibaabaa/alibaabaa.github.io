---
date: "2014-03-28T14:59:43+01:00"
layout: post
title: "Good Programming"

---

I've had a feeling creeping up on me for a while now. It's a discontentment, a niggling resentment of the code-bases I work in. It's my fault, and it's other people's fault as well. And the problem? Horrible code.

I'm talking about working, production code. Code that's battle proven in the field. Code that I've written, that colleagues have written, and that strangers I've never known have written, that services the original business requirements it was built for. But it doesn't service the needs of the developer who wrote it, or the developer who comes to work on it next, because it's bad programming.

And of course there's nothing new in this sentiment. Every developer knows that _legacy code_ is bad. It's something that for some reason we accept as part of life, and as part of our day to day jobs. But it shouldn't be, and it needn't be. And the term _legacy code_ is nothing but a weasel word for the type of developer output described in the first two paragraphs. Just because your work is in use in production systems and servicing however many requests an hour, doesn't provide an excuse for writing crap.

Except it does.

There's a pervasive attitude, at least in enterprise software development, which dictates that all you have to do is write it _fast_, meet the deadline, and against all odds deliver a working product. And apparently this is a suitable catch-all excuse for bad programming.

The worst part of all of this is that good programming isn't hard. It's not some unreachable panacea, a distant goal that can never really be achieved. I would argue that not only is good programming easy, but that every developer is capable of writing good code, and knows how already.

So if developers know how to program well, then why don't they? **Lack of discipline**. And this is why I feel so personally aggrieved when I have to work with poorly written systems. If a code base I'm trudging through is poor _despite_ the previous developer(s) doing their best, I can live with that. But it's rarely, if ever, the case. And that's why I'm frustrated enough to write this in the first place.

And so below, I list the very basics of what I believe to be good programming that applies in a typical object oriented Java-esque situation. If you are a developer, you will already know all of this. Most of it is just basic common sense and shouldn't even require writing down. Therefore, if you are a developer, you are either a good programmer, or lazy.

### Variable names

Provide clear, full names for variables. Don't name your variable `params` when what you really mean is `fileMetaData`. Similarly, `product` is not acceptable when what you mean is `productsInBasket`.

Pluralisation seems like a minor concern when a variable is declared and assigned the result of a collection, but it makes life much easier for someone who comes along later and is scanning through the call stack looking for something specific. By naming variables appropriately, you're removing an additional mental hurdle that someone would otherwise have to take.

### Method names

This applies equally to public as to private methods. Don't call your method `Refresh()` when what you actually mean is `RepopulateDataFromCache()`. Always re-evaluate a method's name once you've written the body of it. Your method called `Process()` is not only of no use to anyone, but it is also a sign that you haven't fully considered its scope or purpose.

A method's names should concisely, yet **fully**, describe its functionality. And if doing so would make the name unreasonably long, it's probably time to consider breaking the method apart. Which leads conveniently onto...

### Cohesion and coupling

Let's begin by briefly defining what is meant by these two words, and why we do and don't want them. Developers should aim for classes with **high cohesion**. Cohesion could be considered the measure of the extent to which every part of a class serves to satisfy the same single well defined role within a system. This is to say a class should have one, and only one responsibility. We can put this definition together with the target of **low coupling** by stating that it should be the _only class in the system servicing that responsibility_.

That's not to say that a class won't need help from other components in the system, but that those other components should neither know nor care how the class is using them, nor what it is using them for.

This means no heterogenous `Utility` class providing a mass of disjointed static 'helper' methods. No giant `CustomerRepository` class servicing every possible data layer interaction related to anything _customer-like_.

And on the topic of service classes, if your class needs outside assistance in order to help it fulfill its single responsibility, it should take that assistance from an _interface_, not a class.

### Understand what you're using

This seems so obvious as to not require stating, and yet it's a constant source of trouble. If you don't really understand what a library or language feature is for or why you're using it, how can you hope to use it correctly? Don't use the _async/await_ functionality just because it's ""good practice"".

Use it because you know what it does and how it's beneficial in the given situation. If you're trapped in a position where the code around what you're doing is using it, and maybe your IDE is giving you squigglies, take the time to understand the feature. Discuss it with a colleague. Spend half an hour in the documentation.

### Unit tests

_I don't have time_. _I just need to get this in_. _I'll come back to it later_. Get over yourself. These are all excuses for one of two problems. You're either too lazy and can't be bothered to write unit tests for your work, or your work is so poor that it is incredibly difficult or impossible to test.

Neither of these reasons are fair for the next person who has to work on the code (which will very likely be you), nor are they in any way acceptable excuses.

Unit testing should in the majority of cases be so easy as to be trivial. Identifying boundary cases and the correct conditions to test may take some additional thinking, but missing some of these cases can be forgiven. Unit testing the right thing is to some extent an art form, and something that takes repeated practice. This level of unit test quality critique is not what I'm concerned about. All I care about is: have you written tests for your code that cover the most basic of cases?

If code doesn't have tests because it can't be tested, then it's important to ask ourselves why it can't be tested. If it's due to a reliance on a third party library, can that dependence be hoisted out and wrapped such that the dependent code can be tested? If code without external dependencies can't be tested, then the question has to be, what exactly have you written? If you can't use your class from a unit test, then how is it usable from anywhere else in the system?

If code doesn't have unit tests due to 'time constraints', then this points to a more fundamental problem than code quality. If unreasonable constraints are being imposed by management, then these should be addressed by human interaction. It's common to find that conversations solve more problems than code. If you're reluctant to talk about the problem, this would suggest that you either need a new job, or that you know there isn't really a management problem, and you're using the excuse as a smoke-screen of denial because you don't want to unit test.

### Minimise side effects and maximise immutability

What is a side effect? Anything that a function does that isn't pertinent to producing a return value is a side effect. Writing to a log is a side effect. Printing to the console is a side effect. Changing the value of a passed in parameter is a side effect. This last example is also related to immutability, but I'll come to that in a moment.

Minimising side effects is a tenet from functional languages, but it applies equally well to object oriented languages. It's also something that sounds like common sense when stated like this: _don't do things that are non-obvious_. If a developer makes a call to a method `PriceWithVat(ProductPrice priceOfProduct)`, return the price of the product with VAT, but don't modify properties of the passed in object.

By taking advantage of immutability, we can remove the potential for this to happen at all. If all of `ProductPrice`'s properties are marked as `readonly`, then there's no way that they can be changed.

### It's not difficult

But then if you're a developer, you already knew all of this. If you already knew all of this, but you don't already do all of this, maybe you should consider why. System design is hard. Algorithm design is hard. But general purpose programming is _not_ hard.

Anyone can knock out something that a computer can compile into an executable, but it takes a person who is diligent, thoughtful, and vigilant regarding their own practices, to be a good programmer. Take note that there was no mention of _skill_, or _innate ability_ in that last sentence. Because good programming isn't hard.

What's hard is being disciplined enough to do what you know you should do. Always. Every time. Without fail."