---
date: "2015-04-15T18:58:36+01:00"
layout: post
title: "Eschewing SQL in favour of Azure Tables"

---

[![NoSQL comic](https://az761005.vo.msecnd.net/uploads/2015/04/nosql_expert.png)](http://geekandpoke.typepad.com/geekandpoke/2011/01/nosql.html)

With [Azure Storage](http://azure.microsoft.com/en-gb/services/storage/), Microsoft has provided a set of services for handling a variety of data in the big or the small. Naturally, Azure also comes with a robust set of [SQL Server](http://azure.microsoft.com/en-gb/services/sql-database/) tiers for handling relational data in ways we're all familiar with, but today I intend to focus on what can be achieved with Azure Storage, and in particular, so-called 'Azure Tables'.

Azure Tables is Microsoft's NoSQL offering, putting it in the same class of products as Apache CouchDB and MongoDB. I've had previous experience with MongoDB, in the form of trying to make it play nicely with various .NET projects in the past, never with any real success, and I also had a passing familiarity with CouchDB thanks to a talk from an ex-colleague at a NxtGenUG meet. And more recently, I built a web-based solution for a client that relies solely upon Azure Tables for data storage, so I knew that when it came to [building PasteMonitor](http://www.tomeggington.co.uk/pastemonitor-a-tracking-service-for-paste-sites/ "PasteMonitor: a tracking service for paste sites"), there was a good chance I could find a solution for the data that wouldn't require setting up a SQL database in Azure (after all, a basic Azure SQL database is a _massive_ £3/month).

#### The data structure

Many developers, myself included, have been working with SQL for long enough that it's almost second nature. The steps are pretty simple, and coming up with a functioning model goes something like this: consider the relationships between the different types of data entity, then de-normalise until it works / is sane to work with.

If PasteMonitor's data was to live in a SQL database, it would probably look something like this.

[![PasteMonitor ERD](https://az761005.vo.msecnd.net/uploads/2015/04/pastemonitor_erd.png)](https://az761005.vo.msecnd.net/uploads/2015/04/pastemonitor_erd.png)

As you can see, there's certainly no rocket science going on here. Three related tables to handle the core presentation, with supporting tables to hold data fulfilling tertiary services. A keyword would have a foreign key to a user, and a match would have a foreign key to a keyword. Potentially another relationship might exist to join a match to the download it came from, but the point is illustrated. This is relational design 101, classroom fodder.

Having never experienced a smooth and pain-free experience while working with an ORM library (although that's a topic all of its own), I would've then gone on to interact with this data layer via calls to stored procedures. But let's not dwell on what might have been.

#### Thinking the Azure Tables way

While Azure Tables appear similar to any other SQL table at first glance, there are some key differences that are important to consider.

*   Every row has a PartitionKey column and a RowKey column. The combined values of these two columns must be unique per row for any given table.
*   Other than the PartitionKey and RowKey columns, no two rows in a table are required to have the same columns.
*   PartitionKey and RowKey columns are the only indexed columns available. Looking up data by any other column requires pulling down the contents of the entire table and reading the data row by row.
*   There is no concept of relationships between tables.

While there are many other differences, such as the available data structures, and methodology behind the underlying logical storage, these are the three real killer points to bear in mind when designing a data model for Azure Tables.

When it comes to pulling data out, requesting by PartitionKey and RowKey values together is super fast, and unaffected by the number of rows in the table. Did I mention that there is no practical limit to the number of rows any given table can contain? The limiting factor is data capacity, and a single table is limited to a maximum of 500TB of data. But let's get back on track.

#### A practical example

The User table is a pretty good place to start, because there is only a small difference to how I would've designed a SQL table for holding user data. If designing a SQL solution, I would probably have an ID identity column as the primary key, and apply a unique index to the username column to prevent duplicates and improve lookup performance.

In an Azure Table, I have two columns that I need to populate with a unique combination of values (PartitionKey and RowKey). In addition to this, I want to aim to end up with a range of partition key values that are neither all the same, nor all different, because the value of the partition key column is used by Azure when deciding how and where to store your underlying data. [There's much more info on designing scalable tables on MSDN](https://msdn.microsoft.com/en-us/library/azure/hh508997.aspx).

In PasteMonitor, I split the user's chosen username over the two columns, taking the first two characters as the partition key, and the whole username as the row key. This provides a range of partition key values, while ensuring a unique combination of the two key columns for each user. It also means I can always query out a user by specifying both keys. If I was looking up a user called 'tomeggington', I would request the row with partition key 'to' and row key 'tomeggington'.

It's worth noting here that there's no reason I couldn't have arbitrarily decided that all partition key values in the user table would just be the value 'user' or anything else, and just kept the row key with the actual username. For a table like 'users', which is never going to grow terrifically large, this would've been a perfectly acceptable approach with no real downsides.

Another obvious side effect of this design is that there is no numeric auto incrementing column as there would've been in a SQL design. I've found that these are rarely useful when designing for Azure Tables (aside from the fact that it would require manually keeping track of the last used number, as there is no built-in mechanism for auto incrementing).

#### Another practical, but more interesting, example

Aside from having to split the username value across two columns to satisfy the key column requirements, I'll admit there's not much interesting going on in the design of the User table. So let's examine a table that requires something we can't have in Azure Table land: a relationship.

![Keyword table](https://az761005.vo.msecnd.net/uploads/2015/04/keyword_table.png)

In PasteMonitor, a user will set up one or more 'keywords' that they want to watch for on paste sites. They also get to choose some other options, such as whether it's a regular expression, should be treated as case sensitive, etc. Naturally, when designing a table like this in a SQL database, you would key the keyword back to a user with a foreign key (UserId). After all, a keyword with no user makes no sense. But with no concept of relationships in Azure Tables, and no UserId column to refer back to, what can be done?

To solve this problem, we have to create and maintain these relationships manually. They have to be designed into the structure of the table columns, while also considering the bullet points listed earlier.

For example, in the most naïve approach, a column 'username' could be included on each row, populated with the username of the user the keyword belongs to. The problem with doing this lies in the way that the data will probably be queried. It's safe to assume that somewhere, I will want to provide a user with a list of their keywords. In this approach, doing this would require iterating over every row in the keyword table in our application to check if the username matches that of the current user.

A better approach would be to use either the partition key or row key for this purpose, because we know that we can query by either of these columns. This is exactly what I do in PasteMonitor, where in the keyword table, the partition key is the username of the user to whom the keyword belongs. This has another benefit, in that all the keyword rows for a given user will exist in the same partition (because they have the same partition key value) and so the same logical storage location, making them faster to retrieve.

It would then follow that the logical choice for the row key value would be the keyword value itself. However, due to the [character set restrictions on Azure Table key columns](https://msdn.microsoft.com/library/azure/dd179338.aspx), it's not possible to use the keyword value without severely limiting what users could set up as a keyword. It would also introduce other problems where there is a requirement to directly reference a given keyword. Just imagine the potential horrors of trying to pass it as a query parameter in a GET request. Instead, the keyword value itself resides in its own column, and the row key is populated with a random ten-digit alphanumeric string. This makes for much more manageable queries from the client browser and a unique value that can in turn be referenced by the match table.

![A row from the PasteMonitor 'Keyword' Azure Table](https://az761005.vo.msecnd.net/uploads/2015/04/keyword_row.png) A row from the PasteMonitor 'Keyword' Azure Table

#### A different approach

It took some time to initially get my head around Azure table storage, the key columns, and coming up with effective strategies for laying out data. It can still be a challenge designing a solution that will last, when it's not always possible to predict how data may need to be queried out and manipulated in the future. But for the most part it's a fun challenge, requiring a different mindset to the relational way of thinking.

I wrote briefly at the beginning about pulling data from SQL databases using stored procedures, and my next post will cover strategies for querying Azure Tables, and updating the data records retrieved.