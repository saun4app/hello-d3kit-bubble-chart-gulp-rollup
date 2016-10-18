import * as d3 from 'd3';
import * as d3Kit from 'd3kit';

export class D3KitBubbleChart {
    constructor(param_obj = {}) {
        this._init_default();
    }

    show_chart(param_obj) {
        this._init_param(param_obj);

        if (this.tag_id && this.item_array) {
            this._init_d3kit_skelenton();
            this._update_d3_scale();
            this._show_chart();
        } else {
            console.error('show_chart(): ' + param_obj);
        }
    }

    _init_param(param_obj) {
        this.tag_id = param_obj.tag_id ? param_obj.tag_id : 'el_chart';
        this.format_obj = param_obj.format_obj ? param_obj.format_obj : this.default_format_obj;
        this.item_array = param_obj.item_array ? param_obj.item_array : [];
    }

    _init_d3kit_skelenton() {
        this.skeleton = new d3Kit.Skeleton('#' + this.tag_id, this.format_obj, ['bubbleClick']);
        this.d3kit_dispatch = this.skeleton.getDispatcher();

        this.d3kit_layers = this.skeleton.getLayerOrganizer();
        this.d3kit_layers.create(['content', 'x-axis', 'y-axis']);
    }

    _update_d3_scale() {
        let self = this;

        if (this.tag_id && this.item_array) {
            self.d3_x_scale_linear = d3.scaleLinear()
                .range([0, self.skeleton.getInnerWidth()]);

            self.d3_x_axis_buttom = d3.axisBottom()
                .scale(self.d3_x_scale_linear);

            self.y_scale_linear = d3.scaleLinear()
                .range([0, self.skeleton.getInnerHeight()]);

            self.d3_y_axis_left = d3.axisLeft()
                .scale(self.y_scale_linear);

            self.d3_color_scale = d3.scaleOrdinal(d3.schemeCategory10);
        }
    }

    _show_chart() {
        let self = this;

        var _visualize = d3Kit.helper.debounce(function() {
            if (!(self.skeleton.hasData())) {
                d3Kit.helper.removeAllChildren(self.d3kit_layers.get('content'));
                return;
            }

            let item_array = self.skeleton.data();

            self._update_d3_scale();
            _update_scale(item_array);
            _show_axis();
            _show_circle(item_array);

            function _update_scale(item_array) {
                self.d3_x_scale_linear.domain(d3.extent(item_array, function(d) {
                        return d.x;
                    }))
                    .range([0, self.skeleton.getInnerWidth()]);

                self.y_scale_linear.domain(d3.extent(item_array, function(d) {
                        return d.y;
                    }))
                    .range([self.skeleton.getInnerHeight(), 0]);
            }

            function _show_axis() {
                self.d3kit_layers.get('x-axis')
                    .attr('transform', 'translate(0,' + self.skeleton.getInnerHeight() + ')')
                    .call(self.d3_x_axis_buttom);

                self.d3kit_layers.get('y-axis')
                    .call(self.d3_y_axis_left);
            }

            function _show_circle(item_array) {
                console.log(item_array.length);

                let selection = self.d3kit_layers.get('content').selectAll('circle')
                    .data(item_array);

                selection.exit().remove();

                selection.enter().append('circle')
                    .attr('cx', function(d) {
                        return self.d3_x_scale_linear(d.x);
                    })
                    .attr('cy', function(d) {
                        return self.y_scale_linear(d.y);
                    })
                    .on('click', self.d3kit_dispatch.bubbleClick);

                selection.attr('cx', function(d) {
                        return self.d3_x_scale_linear(d.x);
                    })
                    .attr('cy', function(d) {
                        return self.y_scale_linear(d.y);
                    })
                    .attr('r', function(d) {
                        return d.r;
                    })
                    .style('fill', function(d, i) {
                        return self.d3_color_scale(i);
                    });
            }
        }, 10);

        this.skeleton
            .resizeToFitContainer('width')
            .autoResize('width')
            .on('resize', _visualize)
            .on('data', _visualize);

        this.skeleton.on('bubbleClick', function(d) {
            // skip
        }).data(self.item_array);
    }

    _init_default() {
        this.default_format_obj = {
            "margin": {
                "top": 60,
                "right": 60,
                "bottom": 60,
                "left": 60
            },
            "initialWidth": 800,
            "initialHeight": 460
        };
    }
}
