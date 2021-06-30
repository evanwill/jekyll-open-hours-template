---
# generate hours js from _data/config_hours.yml 
# can be loaded by pages rather than using the jekyll include directly
---
{%- assign hours = site.data.config_hours -%}
{%- assign days = "sun;mon;tue;wed;thu;fri;sat" | split: ";" -%}
(function () {
    /* set hours display message span */
	var hoursDisplay = document.getElementById("hours_display");
    /* add default hours */
    var defaultHours = [ {%- for day in days -%}{{ hours.default_hours[day] | default: 'Closed' | jsonify }}{%- unless forloop.last -%},{%- endunless -%}{%- endfor -%} ];

    {%- if hours.breaks -%}
    /* add break hours */
    {%- for b in hours.breaks -%}
    var break{{ forloop.index }}_hours = [ {%- for d in days -%}{{ b[d] | jsonify }}{%- unless forloop.last -%},{%- endunless -%}{%- endfor -%} ];
    {%- endfor -%}
    {%- endif -%}

    /* get current date */
    var now = new Date();
    var isoDateNumber = now.getFullYear() + ("0" + (now.getMonth() + 1)).slice(-2) + ("0" + now.getDate()).slice(-2);
    var hoursMessage = "";

    {%- if hours.exceptions -%}
    /* check exception dates */
    {%- for exception in hours.exceptions -%}
    {% unless forloop.first %}else {% endunless %}if ( {{ exception.dates | jsonify | remove: "-" }}.includes(isoDateNumber) ) {
        hoursMessage = {{ exception.message | jsonify }};
    } 
    {%- endfor -%}
    {%- endif -%}

    {%- if hours.breaks -%}
    /* check break dates */
    {%- for break in hours.breaks -%}
    {%- unless hours.exceptions.size == 0 and forloop.first -%}else {% endunless %}if (isoDateNumber >= {{ break.start | remove: "-" }} && isoDateNumber <= {{ break.end | remove: "-" }} ) {
        hoursMessage = break{{ forloop.index }}_hours[now.getDay()];
    } 
    {%- endfor -%}
    {%- endif -%}

    /* add default hours */
    {%- if hours.exceptions or hours.breaks -%}
    else {
        hoursMessage = defaultHours[now.getDay()];
    }
    {%- else -%}
    hoursMessage = defaultHours[now.getDay()];
    {%- endif -%}

    /* display message */
    hoursDisplay.innerHTML = hoursMessage;
    
})();
