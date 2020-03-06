---
layout: page
title: All posts
---

<b>Test</b>
{% for post in site.posts %}
  {% if post.categories contains "running" %}
    a
  {% else %}
    <a href="{{ post.url }}">{{ post.title }}</a> <small>{{ post.date | date_to_string }}</small>
  {% endif %}
{% endfor %}