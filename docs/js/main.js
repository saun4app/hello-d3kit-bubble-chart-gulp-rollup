(function (exports,d3,d3Kit) {
'use strict';

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var D3KitBubbleChart = function () {
    function D3KitBubbleChart() {
        var param_obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        classCallCheck(this, D3KitBubbleChart);

        this._init_default();
    }

    createClass(D3KitBubbleChart, [{
        key: 'show_chart',
        value: function show_chart(param_obj) {
            this._init_param(param_obj);

            if (this.tag_id && this.item_array) {
                this._init_d3kit_skelenton();
                this._update_d3_scale();
                this._show_chart();
            } else {
                console.error('show_chart(): ' + param_obj);
            }
        }
    }, {
        key: '_init_param',
        value: function _init_param(param_obj) {
            this.tag_id = param_obj.tag_id ? param_obj.tag_id : 'el_chart';
            this.format_obj = param_obj.format_obj ? param_obj.format_obj : this.default_format_obj;
            this.item_array = param_obj.item_array ? param_obj.item_array : [];
        }
    }, {
        key: '_init_d3kit_skelenton',
        value: function _init_d3kit_skelenton() {
            this.skeleton = new d3Kit.Skeleton('#' + this.tag_id, this.format_obj, ['bubbleClick']);
            this.d3kit_dispatch = this.skeleton.getDispatcher();

            this.d3kit_layers = this.skeleton.getLayerOrganizer();
            this.d3kit_layers.create(['content', 'x-axis', 'y-axis']);
        }
    }, {
        key: '_update_d3_scale',
        value: function _update_d3_scale() {
            var self = this;

            if (this.tag_id && this.item_array) {
                self.d3_x_scale_linear = d3.scaleLinear().range([0, self.skeleton.getInnerWidth()]);

                self.d3_x_axis_buttom = d3.axisBottom().scale(self.d3_x_scale_linear);

                self.y_scale_linear = d3.scaleLinear().range([0, self.skeleton.getInnerHeight()]);

                self.d3_y_axis_left = d3.axisLeft().scale(self.y_scale_linear);

                self.d3_color_scale = d3.scaleOrdinal(d3.schemeCategory10);
            }
        }
    }, {
        key: '_show_chart',
        value: function _show_chart() {
            var self = this;

            var _visualize = d3Kit.helper.debounce(function () {
                if (!self.skeleton.hasData()) {
                    d3Kit.helper.removeAllChildren(self.d3kit_layers.get('content'));
                    return;
                }

                var item_array = self.skeleton.data();

                self._update_d3_scale();
                _update_scale(item_array);
                _show_axis();
                _show_circle(item_array);

                function _update_scale(item_array) {
                    self.d3_x_scale_linear.domain(d3.extent(item_array, function (d) {
                        return d.x;
                    })).range([0, self.skeleton.getInnerWidth()]);

                    self.y_scale_linear.domain(d3.extent(item_array, function (d) {
                        return d.y;
                    })).range([self.skeleton.getInnerHeight(), 0]);
                }

                function _show_axis() {
                    self.d3kit_layers.get('x-axis').attr('transform', 'translate(0,' + self.skeleton.getInnerHeight() + ')').call(self.d3_x_axis_buttom);

                    self.d3kit_layers.get('y-axis').call(self.d3_y_axis_left);
                }

                function _show_circle(item_array) {
                    console.log(item_array.length);

                    var selection = self.d3kit_layers.get('content').selectAll('circle').data(item_array);

                    selection.exit().remove();

                    selection.enter().append('circle').attr('cx', function (d) {
                        return self.d3_x_scale_linear(d.x);
                    }).attr('cy', function (d) {
                        return self.y_scale_linear(d.y);
                    }).on('click', self.d3kit_dispatch.bubbleClick);

                    selection.attr('cx', function (d) {
                        return self.d3_x_scale_linear(d.x);
                    }).attr('cy', function (d) {
                        return self.y_scale_linear(d.y);
                    }).attr('r', function (d) {
                        return d.r;
                    }).style('fill', function (d, i) {
                        return self.d3_color_scale(i);
                    });
                }
            }, 10);

            this.skeleton.resizeToFitContainer('width').autoResize('width').on('resize', _visualize).on('data', _visualize);

            this.skeleton.on('bubbleClick', function (d) {
                // skip
            }).data(self.item_array);
        }
    }, {
        key: '_init_default',
        value: function _init_default() {
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
    }]);
    return D3KitBubbleChart;
}();

show_chart$1();

function show_chart$1() {
    var param_obj = {};
    param_obj.tag_id = 'el_chart';
    param_obj.item_array = get_item_array();

    var chat_obj = new D3KitBubbleChart();
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

}((this.demo_app = this.demo_app || {}),d3,d3Kit));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9qcy9saWIvRDNLaXRCdWJibGVDaGFydC5qcyIsIi4uLy4uL3NyYy9qcy9tYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGQzIGZyb20gJ2QzJztcbmltcG9ydCAqIGFzIGQzS2l0IGZyb20gJ2Qza2l0JztcblxuZXhwb3J0IGNsYXNzIEQzS2l0QnViYmxlQ2hhcnQge1xuICAgIGNvbnN0cnVjdG9yKHBhcmFtX29iaiA9IHt9KSB7XG4gICAgICAgIHRoaXMuX2luaXRfZGVmYXVsdCgpO1xuICAgIH1cblxuICAgIHNob3dfY2hhcnQocGFyYW1fb2JqKSB7XG4gICAgICAgIHRoaXMuX2luaXRfcGFyYW0ocGFyYW1fb2JqKTtcblxuICAgICAgICBpZiAodGhpcy50YWdfaWQgJiYgdGhpcy5pdGVtX2FycmF5KSB7XG4gICAgICAgICAgICB0aGlzLl9pbml0X2Qza2l0X3NrZWxlbnRvbigpO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlX2QzX3NjYWxlKCk7XG4gICAgICAgICAgICB0aGlzLl9zaG93X2NoYXJ0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdzaG93X2NoYXJ0KCk6ICcgKyBwYXJhbV9vYmopO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2luaXRfcGFyYW0ocGFyYW1fb2JqKSB7XG4gICAgICAgIHRoaXMudGFnX2lkID0gcGFyYW1fb2JqLnRhZ19pZCA/IHBhcmFtX29iai50YWdfaWQgOiAnZWxfY2hhcnQnO1xuICAgICAgICB0aGlzLmZvcm1hdF9vYmogPSBwYXJhbV9vYmouZm9ybWF0X29iaiA/IHBhcmFtX29iai5mb3JtYXRfb2JqIDogdGhpcy5kZWZhdWx0X2Zvcm1hdF9vYmo7XG4gICAgICAgIHRoaXMuaXRlbV9hcnJheSA9IHBhcmFtX29iai5pdGVtX2FycmF5ID8gcGFyYW1fb2JqLml0ZW1fYXJyYXkgOiBbXTtcbiAgICB9XG5cbiAgICBfaW5pdF9kM2tpdF9za2VsZW50b24oKSB7XG4gICAgICAgIHRoaXMuc2tlbGV0b24gPSBuZXcgZDNLaXQuU2tlbGV0b24oJyMnICsgdGhpcy50YWdfaWQsIHRoaXMuZm9ybWF0X29iaiwgWydidWJibGVDbGljayddKTtcbiAgICAgICAgdGhpcy5kM2tpdF9kaXNwYXRjaCA9IHRoaXMuc2tlbGV0b24uZ2V0RGlzcGF0Y2hlcigpO1xuXG4gICAgICAgIHRoaXMuZDNraXRfbGF5ZXJzID0gdGhpcy5za2VsZXRvbi5nZXRMYXllck9yZ2FuaXplcigpO1xuICAgICAgICB0aGlzLmQza2l0X2xheWVycy5jcmVhdGUoWydjb250ZW50JywgJ3gtYXhpcycsICd5LWF4aXMnXSk7XG4gICAgfVxuXG4gICAgX3VwZGF0ZV9kM19zY2FsZSgpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGlmICh0aGlzLnRhZ19pZCAmJiB0aGlzLml0ZW1fYXJyYXkpIHtcbiAgICAgICAgICAgIHNlbGYuZDNfeF9zY2FsZV9saW5lYXIgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAgICAgICAgICAgLnJhbmdlKFswLCBzZWxmLnNrZWxldG9uLmdldElubmVyV2lkdGgoKV0pO1xuXG4gICAgICAgICAgICBzZWxmLmQzX3hfYXhpc19idXR0b20gPSBkMy5heGlzQm90dG9tKClcbiAgICAgICAgICAgICAgICAuc2NhbGUoc2VsZi5kM194X3NjYWxlX2xpbmVhcik7XG5cbiAgICAgICAgICAgIHNlbGYueV9zY2FsZV9saW5lYXIgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAgICAgICAgICAgLnJhbmdlKFswLCBzZWxmLnNrZWxldG9uLmdldElubmVySGVpZ2h0KCldKTtcblxuICAgICAgICAgICAgc2VsZi5kM195X2F4aXNfbGVmdCA9IGQzLmF4aXNMZWZ0KClcbiAgICAgICAgICAgICAgICAuc2NhbGUoc2VsZi55X3NjYWxlX2xpbmVhcik7XG5cbiAgICAgICAgICAgIHNlbGYuZDNfY29sb3Jfc2NhbGUgPSBkMy5zY2FsZU9yZGluYWwoZDMuc2NoZW1lQ2F0ZWdvcnkxMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfc2hvd19jaGFydCgpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHZhciBfdmlzdWFsaXplID0gZDNLaXQuaGVscGVyLmRlYm91bmNlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCEoc2VsZi5za2VsZXRvbi5oYXNEYXRhKCkpKSB7XG4gICAgICAgICAgICAgICAgZDNLaXQuaGVscGVyLnJlbW92ZUFsbENoaWxkcmVuKHNlbGYuZDNraXRfbGF5ZXJzLmdldCgnY29udGVudCcpKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBpdGVtX2FycmF5ID0gc2VsZi5za2VsZXRvbi5kYXRhKCk7XG5cbiAgICAgICAgICAgIHNlbGYuX3VwZGF0ZV9kM19zY2FsZSgpO1xuICAgICAgICAgICAgX3VwZGF0ZV9zY2FsZShpdGVtX2FycmF5KTtcbiAgICAgICAgICAgIF9zaG93X2F4aXMoKTtcbiAgICAgICAgICAgIF9zaG93X2NpcmNsZShpdGVtX2FycmF5KTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gX3VwZGF0ZV9zY2FsZShpdGVtX2FycmF5KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5kM194X3NjYWxlX2xpbmVhci5kb21haW4oZDMuZXh0ZW50KGl0ZW1fYXJyYXksIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkLng7XG4gICAgICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgICAgICAucmFuZ2UoWzAsIHNlbGYuc2tlbGV0b24uZ2V0SW5uZXJXaWR0aCgpXSk7XG5cbiAgICAgICAgICAgICAgICBzZWxmLnlfc2NhbGVfbGluZWFyLmRvbWFpbihkMy5leHRlbnQoaXRlbV9hcnJheSwgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQueTtcbiAgICAgICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAgICAgICAgIC5yYW5nZShbc2VsZi5za2VsZXRvbi5nZXRJbm5lckhlaWdodCgpLCAwXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIF9zaG93X2F4aXMoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5kM2tpdF9sYXllcnMuZ2V0KCd4LWF4aXMnKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCcgKyBzZWxmLnNrZWxldG9uLmdldElubmVySGVpZ2h0KCkgKyAnKScpXG4gICAgICAgICAgICAgICAgICAgIC5jYWxsKHNlbGYuZDNfeF9heGlzX2J1dHRvbSk7XG5cbiAgICAgICAgICAgICAgICBzZWxmLmQza2l0X2xheWVycy5nZXQoJ3ktYXhpcycpXG4gICAgICAgICAgICAgICAgICAgIC5jYWxsKHNlbGYuZDNfeV9heGlzX2xlZnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBfc2hvd19jaXJjbGUoaXRlbV9hcnJheSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW1fYXJyYXkubGVuZ3RoKTtcblxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3Rpb24gPSBzZWxmLmQza2l0X2xheWVycy5nZXQoJ2NvbnRlbnQnKS5zZWxlY3RBbGwoJ2NpcmNsZScpXG4gICAgICAgICAgICAgICAgICAgIC5kYXRhKGl0ZW1fYXJyYXkpO1xuXG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uLmV4aXQoKS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgIHNlbGVjdGlvbi5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2N4JywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZDNfeF9zY2FsZV9saW5lYXIoZC54KTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2N5JywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYueV9zY2FsZV9saW5lYXIoZC55KTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdjbGljaycsIHNlbGYuZDNraXRfZGlzcGF0Y2guYnViYmxlQ2xpY2spO1xuXG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uLmF0dHIoJ2N4JywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZDNfeF9zY2FsZV9saW5lYXIoZC54KTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2N5JywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYueV9zY2FsZV9saW5lYXIoZC55KTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ3InLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZC5yO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5kM19jb2xvcl9zY2FsZShpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDEwKTtcblxuICAgICAgICB0aGlzLnNrZWxldG9uXG4gICAgICAgICAgICAucmVzaXplVG9GaXRDb250YWluZXIoJ3dpZHRoJylcbiAgICAgICAgICAgIC5hdXRvUmVzaXplKCd3aWR0aCcpXG4gICAgICAgICAgICAub24oJ3Jlc2l6ZScsIF92aXN1YWxpemUpXG4gICAgICAgICAgICAub24oJ2RhdGEnLCBfdmlzdWFsaXplKTtcblxuICAgICAgICB0aGlzLnNrZWxldG9uLm9uKCdidWJibGVDbGljaycsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIC8vIHNraXBcbiAgICAgICAgfSkuZGF0YShzZWxmLml0ZW1fYXJyYXkpO1xuICAgIH1cblxuICAgIF9pbml0X2RlZmF1bHQoKSB7XG4gICAgICAgIHRoaXMuZGVmYXVsdF9mb3JtYXRfb2JqID0ge1xuICAgICAgICAgICAgXCJtYXJnaW5cIjoge1xuICAgICAgICAgICAgICAgIFwidG9wXCI6IDYwLFxuICAgICAgICAgICAgICAgIFwicmlnaHRcIjogNjAsXG4gICAgICAgICAgICAgICAgXCJib3R0b21cIjogNjAsXG4gICAgICAgICAgICAgICAgXCJsZWZ0XCI6IDYwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJpbml0aWFsV2lkdGhcIjogODAwLFxuICAgICAgICAgICAgXCJpbml0aWFsSGVpZ2h0XCI6IDQ2MFxuICAgICAgICB9O1xuICAgIH1cbn1cbiIsImltcG9ydCAqIGFzIGQzIGZyb20gJ2QzJztcblxuaW1wb3J0IHtcbiAgICBEM0tpdEJ1YmJsZUNoYXJ0XG59IGZyb20gJy4vbGliL0QzS2l0QnViYmxlQ2hhcnQnO1xuXG5zaG93X2NoYXJ0KCk7XG5cbmZ1bmN0aW9uIHNob3dfY2hhcnQoKSB7XG4gICAgbGV0IHBhcmFtX29iaiA9IHt9O1xuICAgIHBhcmFtX29iai50YWdfaWQgPSAnZWxfY2hhcnQnO1xuICAgIHBhcmFtX29iai5pdGVtX2FycmF5ID0gZ2V0X2l0ZW1fYXJyYXkoKTtcblxuICAgIGxldCBjaGF0X29iaiA9IG5ldyBEM0tpdEJ1YmJsZUNoYXJ0KCk7XG4gICAgY2hhdF9vYmouc2hvd19jaGFydChwYXJhbV9vYmopO1xufVxuXG5mdW5jdGlvbiBnZXRfaXRlbV9hcnJheSgpIHtcbiAgICB2YXIgaXRlbV9hcnJheSA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxMDA7IGkrKykge1xuICAgICAgICBpdGVtX2FycmF5LnB1c2goe1xuICAgICAgICAgICAgeDogTWF0aC5yYW5kb20oKSAqIDEwMCxcbiAgICAgICAgICAgIHk6IE1hdGgucmFuZG9tKCkgKiAxMDAsXG4gICAgICAgICAgICByOiBNYXRoLnJhbmRvbSgpICogNSArIDNcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBpdGVtX2FycmF5O1xufVxuIl0sIm5hbWVzIjpbIkQzS2l0QnViYmxlQ2hhcnQiLCJwYXJhbV9vYmoiLCJfaW5pdF9kZWZhdWx0IiwiX2luaXRfcGFyYW0iLCJ0YWdfaWQiLCJpdGVtX2FycmF5IiwiX2luaXRfZDNraXRfc2tlbGVudG9uIiwiX3VwZGF0ZV9kM19zY2FsZSIsIl9zaG93X2NoYXJ0IiwiZXJyb3IiLCJmb3JtYXRfb2JqIiwiZGVmYXVsdF9mb3JtYXRfb2JqIiwic2tlbGV0b24iLCJkM0tpdCIsImQza2l0X2Rpc3BhdGNoIiwiZ2V0RGlzcGF0Y2hlciIsImQza2l0X2xheWVycyIsImdldExheWVyT3JnYW5pemVyIiwiY3JlYXRlIiwic2VsZiIsImQzX3hfc2NhbGVfbGluZWFyIiwiZDMiLCJyYW5nZSIsImdldElubmVyV2lkdGgiLCJkM194X2F4aXNfYnV0dG9tIiwic2NhbGUiLCJ5X3NjYWxlX2xpbmVhciIsImdldElubmVySGVpZ2h0IiwiZDNfeV9heGlzX2xlZnQiLCJkM19jb2xvcl9zY2FsZSIsIl92aXN1YWxpemUiLCJkZWJvdW5jZSIsImhhc0RhdGEiLCJyZW1vdmVBbGxDaGlsZHJlbiIsImdldCIsImRhdGEiLCJfdXBkYXRlX3NjYWxlIiwiZG9tYWluIiwiZCIsIngiLCJ5IiwiX3Nob3dfYXhpcyIsImF0dHIiLCJjYWxsIiwiX3Nob3dfY2lyY2xlIiwibG9nIiwibGVuZ3RoIiwic2VsZWN0aW9uIiwic2VsZWN0QWxsIiwiZXhpdCIsInJlbW92ZSIsImVudGVyIiwiYXBwZW5kIiwib24iLCJidWJibGVDbGljayIsInIiLCJzdHlsZSIsImkiLCJyZXNpemVUb0ZpdENvbnRhaW5lciIsImF1dG9SZXNpemUiLCJzaG93X2NoYXJ0IiwiZ2V0X2l0ZW1fYXJyYXkiLCJjaGF0X29iaiIsInB1c2giLCJNYXRoIiwicmFuZG9tIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFHYUEsZ0JBQWI7Z0NBQ2dDO1lBQWhCQyxTQUFnQix1RUFBSixFQUFJOzs7YUFDbkJDLGFBQUw7Ozs7O21DQUdPRCxTQUxmLEVBSzBCO2lCQUNiRSxXQUFMLENBQWlCRixTQUFqQjs7Z0JBRUksS0FBS0csTUFBTCxJQUFlLEtBQUtDLFVBQXhCLEVBQW9DO3FCQUMzQkMscUJBQUw7cUJBQ0tDLGdCQUFMO3FCQUNLQyxXQUFMO2FBSEosTUFJTzt3QkFDS0MsS0FBUixDQUFjLG1CQUFtQlIsU0FBakM7Ozs7O29DQUlJQSxTQWpCaEIsRUFpQjJCO2lCQUNkRyxNQUFMLEdBQWNILFVBQVVHLE1BQVYsR0FBbUJILFVBQVVHLE1BQTdCLEdBQXNDLFVBQXBEO2lCQUNLTSxVQUFMLEdBQWtCVCxVQUFVUyxVQUFWLEdBQXVCVCxVQUFVUyxVQUFqQyxHQUE4QyxLQUFLQyxrQkFBckU7aUJBQ0tOLFVBQUwsR0FBa0JKLFVBQVVJLFVBQVYsR0FBdUJKLFVBQVVJLFVBQWpDLEdBQThDLEVBQWhFOzs7O2dEQUdvQjtpQkFDZk8sUUFBTCxHQUFnQixJQUFJQyxjQUFKLENBQW1CLE1BQU0sS0FBS1QsTUFBOUIsRUFBc0MsS0FBS00sVUFBM0MsRUFBdUQsQ0FBQyxhQUFELENBQXZELENBQWhCO2lCQUNLSSxjQUFMLEdB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
