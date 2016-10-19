import * as d3 from 'd3';

import { D3KitBubbleChart } from './lib/D3KitBubbleChart';

show_chart();

function show_chart() {
    let param_obj = {};
    param_obj.tag_id = 'el_chart';
    param_obj.item_array = get_item_array();

    let chat_obj = new D3KitBubbleChart();
    chat_obj.show_chart(param_obj);
}

function get_item_array() {
    var item_array = [];

    for (var i = 0; i < 100; i++) {
        item_array.push({
            x: Math.random() * 100,
            y: Math.random() * 100,
            r: Math.random() * 5 + 3
        });
    }
    return item_array;
}
