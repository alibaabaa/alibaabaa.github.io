---
layout: page
title: All posts
---

{% for post in site.posts %}
  <a href="{{ post.url }}">{{ post.title }}</a> <small>{{ post.date | date_to_string }}</small>
{% endfor %}