/**
 * --------------------------------------------------------------------
 * jQuery.bgsize plugin
 * 
 * Version: v1.0
 * Author: @xaguilars
 * Url: https://github.com/xaguilars/jquery.bgsize
 */

;
(function($, undefined) {
    "use strict";
    var _defaults = {
        "bindResize": true,
        "bindOrientationChange": true,
        "baseCss": {
            "position": "absolute",
            "maxWidth": "none",
            "minWidth": "none",
            "display": "block"
        },
        "classes": {
            "fallback": "bgsize-fallback",
            "fallbackImg": "bgsize-fallback-img"
        }
    };

    var _helpers = {
        "init": function(options) {
            var $this = $(this);
            var $o = $this.data("bgsize");

            if (typeof $o !== 'object') {
                $o = $.extend({}, _defaults, options);
                $this.addClass($o.classes.fallback);
                $this.data("bgsize", $o);
                $this.each(function() {
                    var $container = $(this);
                    var $img = $container.find("> ." + $o.classes.fallbackImg);
                    if ($img.length === 0) {
                        //create img
                        var $info = _helpers["info"]($container, $o);
                        //console.log($info);
                        var $img = $('<img />').addClass($o.classes.fallbackImg).attr({
                            'src': $info.backgroundImage,
                            "data-bgsize-mode": $info.backgroundSize
                        });
                        $img.hide();
                        $container.css("backgroundImage", "none").prepend($img);
                    }
                });

                if ($o.bindResize === true) {
                    $(window).bind('resize.bgsize', function() {
                        _helpers["refresh"]($this);
                    })
                }

                if ($o.bindOrientationChange === true) {
                    $(window).bind('orientationchange.bgsize', function() {
                        _helpers["refresh"]($this);
                    })
                }

                $(window).load(function() {
                    $("html").addClass("window-loaded");
                    _helpers["refresh"]($this);
                    $this.trigger("init.bgsize");
                });

                if ($("html").hasClass('window-loaded')) {
                    _helpers["refresh"]($this);
                }

            } else {
                //just refresh
                return _helpers["refresh"]($this, $o);
            }

            return this;
        },
        "refresh": function($this, $o) {
            $this = $this || $(this);
            $o = $o || $this.data("bgsize");

            return $this.each(function() {
                var $container = $(this);
                var $img = $container.find("> ." + $o.classes.fallbackImg);
                if ($img.length !== 0) {
                    //create img
                    $img.show();
                    var $bgs = $img.attr("data-bgsize-mode");
                    if ($bgs === "contain") {
                        $img.css($.extend({}, _helpers["bounds"]["contain"]($img), $o.baseCss));
                    } else {
                        $img.css($.extend({}, _helpers["bounds"]["cover"]($img), $o.baseCss));
                    }
                }
            });
        },
        "info": function($this, $o) {
            $this = $this || $(this);
            $o = $o || $this.data("bgsize");
            var bgImg = $this.attr('data-bgsize-image');// $this.css('backgroundImage');

            if (!bgImg) {
                bgImg = $this.css('backgroundImage');
                bgImg = bgImg.match(/^url\(['"]?(.+)["']?\)$/);
                bgImg = bgImg ? bgImg[1] : "";
            }

            var bgsize = $this.attr('data-bgsize-mode');

            if (!bgsize) {
                // browsers that does not support background-size CSS property won't read the value
                bgsize = $this.css('backgroundSize');
            }
            return {
                "backgroundImage": bgImg.replace(/\"$/, ""),
                "backgroundSize": bgsize
            }
        },
        "bounds": {
            "cover": function(el) {
                var $el = $(el);
                var ratio = $el.attr("data-ratio");
                if (!ratio) {
                    var origw = $el.width();
                    var origh = $el.height();
                    ratio = origh / origw;
                    $el.attr("data-origh", origh);
                    $el.attr("data-origw", origw);
                    $el.attr("data-ratio", ratio);
                }
                var parent = $el.parent();
                var containerWidth = parent.outerWidth(false); //false = do not include margin
                var containerHeight = parent.outerHeight(false);

                // calculate new size
                var newheight = 0, newwidth = 0;

                if ((containerHeight / containerWidth) > ratio) {
                    newheight = containerHeight;
                    newwidth = Math.round(containerHeight / ratio);
                } else {
                    newheight = Math.round(containerWidth * ratio);
                    newwidth = containerWidth;
                }

                // calculate new left and top position
                var newleft = Math.round((containerWidth - newwidth) / 2);
                var newtop = Math.round((containerHeight - newheight) / 2);

                return {"width": newwidth, "height": "auto", "left": newleft, "top": newtop};
            },
            "contain": function(el) {
                var $el = $(el);
                var ratio = $el.attr("data-ratio");
                var newheight = 0, newwidth = 0, newleft = 0, newtop = 0;
                if (!ratio) {
                    newheight = $el.height();
                    newwidth = $el.width();
                    ratio = newheight / newwidth;
                    $el.attr("data-origh", newheight);
                    $el.attr("data-origw", newwidth);
                    $el.attr("data-ratio", ratio);
                } else {
                    newheight = $el.attr("data-origh");
                    newwidth = $el.attr("data-origw");
                }
                var parent = $el.parent();
                var containerWidth = parent.outerWidth(false); //false = do not include margin
                var containerHeight = parent.outerHeight(false);

                // calculate new size

                // TO-DO optimize those ifs:
                if (newwidth > containerWidth) {
                    newwidth = containerWidth;
                    newheight = Math.round(containerWidth * ratio);
                }
                if (newheight > containerHeight) {
                    newwidth = Math.round(containerHeight / ratio);
                    newheight = containerHeight;
                }
                if ((newwidth < containerWidth) && (newheight < containerHeight)) {
                    newwidth = containerWidth;
                    newheight = Math.round(containerWidth * ratio);
                }
                if (newheight > containerHeight) {
                    newwidth = Math.round(containerHeight / ratio);
                    newheight = containerHeight;
                }

                //center
                if (newwidth < containerWidth) {
                    newleft = (containerWidth - newwidth) / 2;
                }

                if (newheight < containerHeight) {
                    newtop = (containerHeight - newheight) / 2;
                }

                return {"width": newwidth, "height": newheight, "left": newleft, "top": newtop};
            }
        }
    };

    $.fn.bgsize = function(param) {
        // Method calling logic
        if (_helpers[param]) {
            return _helpers[param].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof param === 'object' || !param) {
            return _helpers.init.apply(this, arguments);
        } else {
            $.error('Method ' + param + ' does not exist on jQuery.bgsize');
            return false;
        }
    };
})(jQuery);
