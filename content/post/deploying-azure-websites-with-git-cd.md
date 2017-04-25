+++
date = "2015-02-20T18:03:08+01:00"
draft = false
title = "Deploying Azure Websites with git continuous delivery"

+++

Microsoft's Azure 'Websites' platform as a service is a great way for me to host websites because of how easy it makes monotonous tasks. Even something as obvious as setting up a new website is [just a couple of clicks](http://www.tomeggington.co.uk/nanonumbers-azure-backed-project/ "NanoNumbers: An Azure backed project"), compared to what might be hours of configuration in other less integrated platforms. One aspect of software development and delivery that I despise is deployment, so anything I can do to mitigate the impact it has upon my working time is a positive.

In the bad old days, a deployment consisted of prepping the new website files, then hurriedly deleting the production files and copying the new set into the folder as quickly as possible. And then of course, hoping that everything worked, because if not the process had to be completed in reverse to restore the previous version.

Then things improved, and I would use Visual Studio to create a publish 'package' of the site. This package could then be transferred to the web server, and deployed using IIS's website import function. This was better, because it removed the horrifying copy and paste dance required, but still was essentially doing the same thing for you - deleting the old files, copying the new.

But now with Azure, I can configure automated deployments, triggered by git check ins. As I work on my site locally, I commit it to my local repository, directly from Visual Studio using Team Explorer.

[![Team Explorer commit to local git](https://az761005.vo.msecnd.net/uploads/2015/02/teamex_commit.png)](https://az761005.vo.msecnd.net/uploads/2015/02/teamex_commit.png)

This way, I have full control over iterative commits without having to worry too much about whether everything in that commit is complete or working properly. When I'm happy with everything and ready for it to go into production, all I have to do is use the down arrow against that commit button and select Commit and Push.

[![Commit and Push](https://az761005.vo.msecnd.net/uploads/2015/02/commit_and_push.png)](https://az761005.vo.msecnd.net/uploads/2015/02/commit_and_push.png)

This pushes the changes in my local git repository up to my BitBucket account. In turn, that BitBucket repository is hooked up to my Azure Website, and configured for continuous delivery. Every commit to the repository triggers a new deployment of the website automatically. From Azure, it looks like this:

[![Deployment history](https://az761005.vo.msecnd.net/uploads/2015/02/deployment_history.png)](https://az761005.vo.msecnd.net/uploads/2015/02/deployment_history.png)

That's the commit message there alongside the other pertinent commit details. If for whatever reason the deployment fails, the previously commit is maintained as the active deployment and the deployment log is available to help diagnose what went wrong.

This workflow makes deployments much less of a gamble, and is an example of one way in which Microsoft Azure is positioning itself as an attractive option amongst available platform as a service offerings.