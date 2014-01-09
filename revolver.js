/*
    Options
        --Need to add options here so I dont forget them
    Example
        --Need to add an exmaple format in comments
        --Need to create multiple exmples to see if I messed up somewhere else
    Clean Up Code
*/
(function( $ ){
    "use strict";
    var methods = {
        init: function(){
            var $this = $(this);
             //Giving the container with a class name and a number if theres more then one
            //and if the container has no class it use an or defaults to a name
            var ele = $this.attr("class");
            var orig_ele = $this.attr("class");
            ele = ele != undefined ? 'class="' +  this.className : 'id="' + this.id || 'revolver';
            var ele_i = ele.substr(0,1);
            ele = $this.length > 1 ? ele  +  '-wrapper-' + $this.index() : ele + '-wrapper' ;
            ele += '"';
            $this.wrap('<div ' + ele + ' />');
            
            var current = $this.find('.current');
            var current_height = current.height();
            var current_width = current.width();

            var children = $this.children().not('.current');
            var all_children = $this.children();

            var height = $this.innerHeight(); 
            var width = $this.innerWidth(); 
            
            if(!$this.find('*').find('current')){
                $this.filter(":first").addClass('current'); 
            }    
 
            $this.css('position', 'relative');
            all_children.each(function(i){
                var $t = $(this);
                var p = $t.position();
                $t.css({
                    'left': p.left,
                    'top': p.top,
                    'absolute': 'absolute'
                }).addClass("pane-" + i + " " + ele_i + "-pane-" + i);


            });
            children.bind('click', function(){
                methods.flip(this);
            });

            all_children.css('position', 'absolute');

            //build nav
            var tag = '<span class="prev">Previous</span><span class="next">Next</span>';
            $(".next").live("click", function(){ methods.next(this); })
            $(".prev").live("click", function(){ methods.previous(this); })
            $this.parent().append(tag);

            all_children.each(function(i){
            });
        },
        flip: function(selector){
            var $this = $(selector);
            
            var current = $this.parent().find('.current');
            var children = $this.children().not('.current');
            var all_children = $this.parent().children();

            var height = $this.innerHeight(); 
            var width = $this.innerWidth(); 
 
            all_children.unbind();
            var p = {
                c: {
                    left: current.position().left, 
                    top:  current.position().top,
                    height:  current.height(),
                    width:  current.width(),
                    'z-index': '1' 
                },
                t: {
                    left: $this.position().left, 
                    top:  $this.position().top,
                    height:  $this.height(),
                    width:  $this.width(),
                    'z-index': '0' 
                }
            };

            var current_index = $this.index();
            current_index = current_index == 1 ? 0  : current_index;
            $this.insertBefore(current);
            current.insertAfter($(selector).parent().children(":eq(" + current_index  + ")"));


            current.stop(true,false).animate(p.t).removeClass('current'); 
            $this.stop(true,false).animate(p.c).addClass('current');

            current = $this.parent().children().not('.current');
            current.bind('click', function(){ 
                    methods.flip(this); 
            });
        },
        rotate: function(selector, direction){
            var $this = $(selector);
            var all_children = $this.parent().children("div:first-child").children();
            var arr = [];
            all_children.unbind();
            all_children.each(function(i){
                    arr.push({
                        left: all_children.eq(i).position().left,
                        top: all_children.eq(i).position().top,
                        height: all_children.eq(i).height(),
                        width: all_children.eq(i).width()
                    });
            });
            var count;
            var length = arr.length - 1;

            if(direction == 'next'){
                for(var a = 0; a < arr.length; a++){
                    count = a == length ? 0 : a + 1;
                    
                    if(all_children.eq(a).attr('class').match('current' )){
                        all_children.eq(a).css('z-index', '0');
                    }else{
                        all_children.eq(a).css('z-index', '1');
                    }
                    
                    all_children.eq(a).stop(true,false).animate(arr[count]);
                }
                var tmp_index = all_children.find(".current").index()
                all_children.removeClass("current");
                all_children.eq(length).addClass("current");
                all_children.eq(0).before(all_children.eq(length));
            }else if(direction == 'previous'){
                //opposide day
                for(var a = arr.length - 1; a >= 0; a--){
                    if(all_children.eq(a).attr('class').match('current' )){
                        all_children.eq(a).css('z-index', '1');
                    }else{
                        all_children.eq(a).css('z-index', '0');
                    }
                    count = a == 0 ? length : a - 1;
                    all_children.eq(a).stop(true,false).animate(arr[count]);
                }    
                all_children.removeClass("current");
                all_children.eq(1).addClass("current");
                all_children.eq(length).after(all_children.eq(0));
            }
            all_children.not(".current").bind("click", function(){ methods.flip(this); });
        },
        previous: function(sel){
            this.rotate(sel, "previous"); 
        },
        next: function(sel){
            this.rotate(sel, "next"); 
        }
    };
     
    $.fn.revolver = function(options) {

        //defaults options
        var defaults = {
            'animation': 'move',
            'current': 'default',
            'arrows': 'default'
        };

        return this.each(function(){
            // If options exist, lets merge them with our default settings
            var options = $.extend({}, $.fn.revolver.defaults, options);  
            var method = method || 'init';
            if ( methods[method] ) {
                return methods[method].apply( this, Array.prototype.slice.call( arguments, 1));
            } else if ( typeof method === 'object' || ! method ) {
                return methods.init.apply( this, arguments );
            } else {
                $.error( 'Method ' +  method + ' does not exist' );
            }    
        });
    };
})( jQuery );
