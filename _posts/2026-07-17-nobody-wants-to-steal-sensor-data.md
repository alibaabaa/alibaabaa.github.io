---
# Ported from the hardcoded homepage card so the link keeps working.
# The body is a placeholder — paste the real article in, and correct the
# date in the filename (it sets the display date and ordering).
title: "Nobody Wants To Steal Your Sensor Data"
standfirst: "Why we can't evaluate all businesses by the standard confidentiality model"
---

## Treat physical world interactions differently

Suppliers into the critical infrastructure space have a host of requirements to deal with that simply don't exist in other sectors. This burden becomes even more acute once you're delivering solutions that are involved in real world interventions. AI and ML features and behaviour can then act as a multiplier on top.

It's one thing to have to defend the security of your product when it's handling personal data or storing sensitive geospatial infrastructure data. But much of the CNI supplier landscape interacts with the physical world in ways that other sector businesses simply don't have to contemplate.

You don't see Salesforce worrying about whether a bad update is going to mean a burst pipe on the high street goes unreported. If Jira metrics are reporting the wrong numbers for a couple of hours, it doesn't result in a burst water main. And the latest hotshot e-commerce start-up doesn't need to worry about being in hot water with the Environment Agency: if their AI modelling goes wrong, it's not going to result in erroneous EDM reporting.

## There's more to security than confidentiality

ISO 27001 is the de facto standard for managing risk in information systems and for demonstrating that security is an audited priority amongst your people and technology. But it's not a silver bullet and can be misinterpreted and misapplied, resulting in a certification that satisfies clients on a surface level, but which begins to break down for those that dig a little deeper.

Even worse, it can result in a false sense of security while your solution is left exposed to the realities of contemporary threats.

The problem with trying to fit conventional information security practices onto products in this space is that the security industry and its practitioners are often heavily weighted towards confidentiality. Protecting the secrecy of data in transit, in storage, ensuring access to it is recorded. In an information age, this makes sense. Data is treated like the crown jewels because it usually is.

But when delivering solutions that interact with the world around us, availability of data, and integrity and trust in that data, is often just as if not more important than confidentiality.

## Protect hard-won trust

A sensor's readings are unlikely to be sensitive on their own, but if they can be intercepted and suppressed, then you've got an overflow event on your hands that your product was supposed to proactively detect.

You might prevent all but your most senior engineers from accessing anomaly data, but if they can accidentally overwrite it, then you've got a failed regulatory obligation.

No data has been stolen, no one is making a report to the ICO, your systems haven't been ransomwared, but when your business model is built around proactive detection and event containment, trust in the product is essential, and it's just been eroded.

## ISO 27001 is effective, but only if applied well

The security industry needs to do better by clients and not just apply frameworks like ISO 27001 by blindly following the same playbook every time. Different organisations have different security needs, and security must be evaluated in the context of the product and systems being protected. ISO 27001 is an adaptable and highly effective risk management framework when applied correctly.

Organisations shouldn't be getting to ISO 27001 certification by systematically applying the 93 controls from Annex A of the standard. This does a disservice to the business underneath. The 93 controls were never intended to be a prescriptive list of requirements. They're guidelines and recommendations of how to manage security risk and should be treated as such, and there are mechanisms build into the standard for justifying why a control isn't relevant.

## Machine learning and AI systems need attention

The National Cyber Security Centre (NCSC) themselves say in their [Machine Learning Principles publication](https://www.ncsc.gov.uk/sites/default/files/documents/NCSC-Machine-learning-principles.pdf) that there's no one size fits all, and that ML systems require additional consideration above and beyond established cyber security best practice. Just from that, we can infer that if a service incorporates ML elements, then the standard 93 controls from ISO 27001 are likely to provide insufficient protection.

The NCSC publication talks about poisoning attacks where manipulated data finds its way into training, and reshapes the definition of normal. A model that's subversively trained on tampered readings could end up reporting a healthy network where the reality is anything but.

## True security starts with the funamdentals

The benefit of the framework is that it is designed to be flexible and adaptable to any shaped organisation. By asking some fundamental questions of teams, it doesn't have to be difficult to evaluate how effectively it's working:

- Could you tell the difference between a faulty sensor and maliciously modified measurements?
- Do you have a mechanism to prevent your ML models from training on manipulated data?
- Would you know if your ML model's alerting behaviour had drifted since the version the client validated?

The good news is that because ISO 27001 is non-prescriptive by design, it can support and help frame processes that fit the real security needs and risks inside an organisation.

And the even better news is that a correctly scoped certification means only needing to do the things that are actually relevant to your risk. You end up with something that's both more tailored and therefore more secure, and also involves less overhead to maintain.

---

Doing product security right doesn't need to be burdensome, but it does require the coming together of specialist expertise from within an organisation and the specialist security expert who can bring the correct controls for that organisation.

Once we get away from the generalist one size fits all thinking, real change and real defence of our vital infrastructure is achievable. 