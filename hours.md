---
title: Hours Page Example
layout: default
---

# Hours

Current Hours: <span id="hours_display"></span>

Below is a demo display of all hours set in config_hours,
provided as example of using the YML values to generate an full hours page using Liquid.

{% assign hours = site.data.config_hours %}
{% assign days = "sun;mon;tue;wed;thu;fri;sat" | split: ";" %}

## {{ hours.default_hours.name }}

{% for day in days %}
- {{ hours.day_names[day] }}: {{ hours.default_hours[day] | default: 'Closed' }}{% endfor %}

## Breaks

{% for break in hours.breaks %}
### {{ break.name }}

{{ break.start | date_to_string: "ordinal", "US" }} - {{ break.end | date_to_string: "ordinal", "US" }}

{% for day in days %}
- {{ hours.day_names[day] }}: {{ break[day] | default: 'Closed' }}{% endfor %}

{% endfor %}

## Closures 

{% for exception in hours.exceptions %}
### {{ exception.name }}

{% capture dates %}{% for d in exception.dates %}{{ d | date_to_string: "ordinal", "US" }};{% endfor %}{% endcapture %}

- {{ dates | split: ';' | array_to_sentence_string }}: {{ exception.message }}

{% endfor %}

-----------

Source code: [jekyll-open-hours-template](https://github.com/evanwill/jekyll-open-hours-template)
