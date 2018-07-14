---
date: "2015-07-22T20:01:41+01:00"
layout: post
title: "Why global tracing doesnt work in Azure web apps"

---

Having spent a couple of hours troubleshooting this before finally finding a solution, I thought I'd provide a brief write up in the hope it might save someone else the pain. Of course, tracing _does_ work in Azure, but there's a common scenario gotcha that doesn't seem to be covered in any of the major documentation.

#### Scenario

*   You want to make use of Azure's **Application Logging**, whether it be to the file system, table storage, or blob storage.
*   You want to log to this diagnostic destination with **Trace.TraceError("your trace message")** and equivalent methods.
*   You're working on a web app, so want to globally capture exceptions in **global.asax.cs** and make your tracing call from here.

#### The problem

You set up exception interception and capturing in **Application_Error()** in global.asax.cs and fire off a trace call. You try it out in your local development environment and it works as expected. However, upon deploying the application to Azure, nothing is logged when an exception occurs.

#### What's going on?

You probably have **<customErrors>** set to **RemoteOnly** in your web.config. When an exception is raised, your application is bypassing Application_Error entirely and passing the user directly to the configured error page, resulting in the tracing call being bypassed, and sad, empty logs.

Fixing this is as simple as registering a custom exception filter and making your tracing calls from there instead. Details for achieving that can be found in [this Stack Overflow answer](https://stackoverflow.com/questions/6508415/application-error-not-firing-when-customerrors-on#answer-7551256).