/**
 * --------------------------------------------------------------------
 * jQuery.bgSize plugin
 * 
 * Version: v1.0
 * Author: @xaguilars
 * Url: https://github.com/xaguilars/jquery.bgSize
 */

;
(function($, undefined) {
    "use strict";
    var _defaults = {
        "imgClassName": "bgs-img",
        "bindWindowResize": true,
        "baseCss": {
            "position": "absolute",
            "maxWidth": "none",
            "minWidth": "none",
            "display": "block"
        }
    };

    var _helpers = {
        "init": function(options) {
            var $this = $(this);
            var $o = $this.data("bgSize");

            if (typeof $o !== 'object') {
                $o = $.extend({}, _defaults, options);
                $this.data("bgSize", $o);
                $this.each(function() {
                    var $container = $(this);
                    var $img = $container.find("> ." + $o.imgClassName);
                    if ($img.length === 0) {
                        //create img
                        var $info = _helpers["info"]($container);
                        console.log($info);
                        var $img = $('<img />').addClass($o.imgClassName).attr({
                            'src': $info.backgroundImage,
                            "data-bgSize": $info.backgroundSize
                        });
                        $container.css("backgroundImage", "none").prepend($img);
                    }
                });

                if ($o.bindWindowResize === true) {
                    $(window).bind('resize.bgSize', function() {
                        _helpers["refresh"]($this);
                    })
                }
                $(window).load(function() {
                    $(function() {
                        _helpers["refresh"]($this);
                        $this.trigger("init.bgSize");
                    });
                });
            } else {
                //just refresh
                return _helpers["refresh"]($this, $o);
            }

            return this;
        },
        "refresh": function($this, $o) {
            $this = $this || $(this);
            $o = $o || $this.data("bgSize");

            return $this.each(function() {
                var $container = $(this);
                var $img = $container.find("> ." + $o.imgClassName);
                if ($img.length !== 0) {
                    //create img
                    var $bgs = $img.attr("data-bgSize");
                    if ($bgs === "contain") {
                        $img.css($.extend({}, _helpers["bounds"]["contain"]($img), $o.baseCss));
                    } else {
                        $img.css($.extend({}, _helpers["bounds"]["cover"]($img), $o.baseCss));
                    }
                }
            });
        },
        "info": function($this) {
            $this = $this || $(this);
            var bgImg = $this.css('backgroundImage');
            // ^ Either "none" or url("...urlhere..")
            bgImg = bgImg.match(/^url\(['"]?(.+)["']?\)$/);
            bgImg = bgImg ? bgImg[1] : "";

            var bgSize = $this.css('backgroundSize');

            return {
                "backgroundImage": bgImg,
                "backgroundSize": bgSize
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
                var containerWidth = parent.width();
                var containerHeight = parent.height();

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
                var containerWidth = parent.width();
                var containerHeight = parent.height();

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
                if((newwidth < containerWidth) && (newheight < containerHeight)){
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

    $.fn.bgSize = function(param) {
        // Method calling logic
        if (_helpers[param]) {
            return _helpers[param].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof param === 'object' || !param) {
            return _helpers.init.apply(this, arguments);
        } else {
            $.error('Method ' + param + ' does not exist on jQuery.bgSize');
            return false;
        }
    };
})(jQuery);