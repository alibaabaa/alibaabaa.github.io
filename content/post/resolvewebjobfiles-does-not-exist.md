+++
date = "2015-02-09T19:48:16+01:00"
draft = false
title = "Resolving 'The target \"ResolveWebJobFiles\" does not exist in the project.'"

+++

When deploying a new Azure WebJob direct from git to an Azure Website, my deployment was failing with the message:

> error MSB4057: The target "ResolveWebJobFiles" does not exist in the project.

The unusual thing about this particular message is that searching Google for it yields very few results. The only real clues were in [this Twitter conversatio](https://twitter.com/shanselman/status/543853655871729664)n and [this GitHub gist](https://gist.github.com/joshka/4ec6ea895f397ba683a2). The second of these resources isn't even specifically about this error, but contains a reference to "ResolveWebJobFiles".

It was actually [this specific tweet](https://twitter.com/bradygaster/status/544010812000436224) from Brady Gaster that led to solving this problem. I compared the .csproj files for the WebJob that wouldn't deploy, and another that I already knew to work. The project that wouldn't deploy had an import missing at the end of its .csproj file.

`<Import Project="..\packages\Microsoft.Web.WebJobs.Publish.1.0.2\tools\webjobs.targets" Condition="Exists('..\packages\Microsoft.Web.WebJobs.Publish.1.0.2\tools\webjobs.targets')" />`

Adding this line and committing the change resolved the issue, and the WebJob started up as expected.