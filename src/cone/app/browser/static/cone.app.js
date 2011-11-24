/* 
 * cone.app main JS
 * 
 * Requires:
 *     bdajax
 *     jquery ui autocomplete
 */

if (typeof(window['yafowil']) == "undefined") yafowil = {};

(function($) {

    $(document).ready(function() {
        
        // personaltools
        $('#personaltools').dropdownmenu({
            menu: '.dropdown_items',
            trigger: '.currentuser a'
        });
        
        // initial binding
        cone.key_binder();
        cone.livesearchbinder();
        cone.tabsbinder();
        cone.dropdownmenubinder();
        cone.transitionmenubinder();
        cone.ajaxformbinder();
        cone.sharingbinder();
        cone.selectablebinder();
        cone.copysupportbinder();
        yafowil.referencebrowser.browser_binder();
        
        // add binders to bdajax binding callbacks
        $.extend(bdajax.binders, {
            tabsbinder: cone.tabsbinder,
            dropdownmenubinder: cone.dropdownmenubinder,
            transitionmenubinder: cone.transitionmenubinder,
            ajaxformbinder: cone.ajaxformbinder,
            sharingbinder: cone.sharingbinder,
            selectablebinder: cone.selectablebinder,
            copysupportbinder: cone.copysupportbinder,
            refbrowser_browser_binder: yafowil.referencebrowser.browser_binder,
            refbrowser_add_reference_binder:
                yafowil.referencebrowser.add_reference_binder
        });
    });
    
    cone = {
            
        // object to store global flags
        flags: {},
                
        // keyboard control keys status
        keys: {},
        
        // keydown / keyup binder for shift and ctrl keys
        key_binder: function() {
            $(document).bind('keydown', function(event) {
                switch (event.keyCode || event.which) {
                    case 16:
                        cone.keys.shift_down = true;
                        break;
                    case 17:
                        cone.keys.ctrl_down = true;
                        break;
                }
            });
            $(document).bind('keyup', function(event) {
                switch (event.keyCode || event.which) {
                    case 16:
                        cone.keys.shift_down = false;
                           break;
                    case 17:
                        cone.keys.ctrl_down = false;
                        break;
                }
            });
        },
        
        livesearchbinder: function(context) {
            $('input#search-text', context).autocomplete({
                source: 'livesearch',
                minLength: 3,
                select: function(event, ui) {
                    $('input#search-text').val('');
                    bdajax.action({
                        name: 'content',
                        selector: '#content',
                        mode: 'inner',
                        url: ui.item.target,
                        params: {}
                    });
                    bdajax.trigger('contextchanged',
                                   '.contextsensitiv',
                                   ui.item.target);
                    return false;
                }
            });
        },
        
        tabsbinder: function(context) {
            // XXX: make it possible to bind ajax tabs by indicating ajax via 
            //      css class.
            $("ul.tabs", context).tabs("div.tabpanes > div");
        },
        
        dropdownmenubinder: function(context) {
            $('.dropdown', context).dropdownmenu();
        },
        
        transitionmenubinder: function(context) {
            $('.transitions_dropdown', context).dropdownmenu({
                menu: '.dropdown_items',
                trigger: '.state a'
            });
        },
        
        sharingbinder: function(context) {
            var searchfield = $('#principal-search', context);
            searchfield.unbind('keypress').bind('keypress', function(event) {
                if (event.keyCode == 13) {
                    event.preventDefault();
                }
            });
            searchfield.unbind('keyup').bind('keyup', function(event) {
                if (event.keyCode == 13) {
                    event.preventDefault();
                    var button_elem = $('#principal-search-submit',
                                        $(this).parent());
                    button_elem.trigger('click');
                }
            });
            var button = $('#principal-search-submit', context);
            button.unbind('click').bind('click', function(event) {
                event.preventDefault();
                var button_elem = $(this);
                var input = $('#principal-search', button_elem.parent());
                var target = 
                    bdajax.parsetarget(button_elem.attr('ajax:target'));
                target.params.term = input.attr('value');
                bdajax.action({
                    name: 'local_acl',
                    mode: 'replace',
                    selector: '#localacltable',
                    url: target.url,
                    params: target.params
                });
            });
            var checkboxes = $('input.add_remove_role_for_principal', context);
            checkboxes.unbind('change').bind('change', function(event) {
                event.preventDefault();
                var checkbox = $(this);
                var action;
                if (checkbox.attr('checked')) {
                    action = 'add_principal_role';
                } else {
                    action = 'remove_principal_role';
                }
                var url = checkbox.parent().attr('ajax:target');
                var params = {
                    id: checkbox.attr('name'),
                    role: checkbox.attr('value')
                };
                bdajax.action({
                    name: action,
                    mode: 'NONE',
                    selector: 'NONE',
                    url: url,
                    params: params
                });
            });
        },
        
        selectablebinder: function(context) {
            $('table tr.selectable', context).selectable();
        },
        
        copysupportbinder: function(context) {
            var cut_cookie = 'cone.app.copysupport.cut';
            var copy_cookie = 'cone.app.copysupport.copy';
            var write_selected_to_cookie = function(selectable, name) {
                var ids = new Array();
                var elem;
                selectable.each(function() {
                    elem = $(this);
                    if (elem.hasClass('selected')) {
                        ids.push(elem.attr('ajax:target'));
                    }
                });
                createCookie(name, ids.join('::'));
            };
            $('a.cut16_16', context).unbind('click').bind('click',
                                                          function(event) {
                event.preventDefault();
                var selectable = $('.selectable');
                createCookie(copy_cookie, '', 0);
                write_selected_to_cookie(selectable, cut_cookie);
                selectable.removeClass('copysupport_cut');
                selectable.each(function() {
                    elem = $(this);
                    if (elem.hasClass('selected')) {
                        elem.addClass('copysupport_cut');
                        elem.removeClass('selected');
                    }
                });
            });
            $('a.copy16_16', context).unbind('click').bind('click',
                                                           function(event) {
                event.preventDefault();
                var selectable = $('.selectable');
                createCookie(cut_cookie, '', 0);
                write_selected_to_cookie(selectable, copy_cookie);
                selectable.removeClass('copysupport_cut selected');
            });
            $('a.paste16_16', context).unbind('click').bind('click',
                                                            function(event) {
                event.preventDefault();
                var target = bdajax.parsetarget($(this).attr('ajax:target'));
                bdajax.action({
                    name: 'paste',
                    mode: 'NONE',
                    selector: 'NONE',
                    url: target.url,
                    params: target.params,
                });
            });
        },
        
        // ajax form related. XXX: move to bdajax
        
        // bind ajax form handling to all forms providing ajax css class
        ajaxformbinder: function(context) {
            var ajaxform = $('form.ajax', context);
            ajaxform.append('<input type="hidden" name="ajax" value="1" />');
            ajaxform.attr('target', 'ajaxformresponse');
            ajaxform.unbind().bind('submit', function(event) {
                bdajax.spinner.show();
            });
        },
        
        // called by iframe response, renders form (i.e. if validation errors)
        ajaxformrender: function(payload, selector, mode) {
            if (!payload) {
                return;
            }
            bdajax.spinner.hide();
            bdajax.fiddle(payload, selector, mode);
        }
    }
    
    /* 
     * Dropdown menu
     * =============
     * 
     * Markup
     * ------
     * 
     *     <div class="dropdown">
     *       <div class="icon">
     *         <a href="http://example.com">&nbsp;</a>
     *       </div>
     *       <ul class="dropdown_items" style="display:none;">
     *         <li>
     *           <a href="http://example.com/whatever">
     *             Item title
     *           </a>
     *         </li>
     *       </ul>
     *     </div>
     * 
     * Script
     * ------
     * 
     *     $('.dropdown').dropdownmenu({
     *         menu: '.dropdown_items',
     *         trigger: '.icon a'
     *     });
     */
    $.fn.dropdownmenu = function (options) {
        var trigger = options ? (options.trigger ? options.trigger : '.icon a')
                              : '.icon a';
        var menu = options ? (options.menu ? options.menu : '.dropdown_items')
                           : '.dropdown_items';
        this.unbind('click');
        $(trigger, this).bind('click', function(event) {
            event.preventDefault();
            var container = $(menu, $(this).parent().parent());
            $(document).unbind('mousedown')
                       .bind('mousedown', function(event) {
                if ($(event.target).parents(menu + ':first').length) {
                    return true;
                }
                container.css('display', 'none');
            });
            container.css('display', 'block');
        });
        return this;
    }
    
    /*
     * Reference Browser
     * =================
     * 
     * Markup
     * ------
     * 
     *     <input type="text" name="foo" class="referencebrowser" />
     *     <input type="hidden" name="foo.uid" value="" />
     * 
     * for single value reference or
     * 
     *     <select name="foo" class="referencebrowser" />
     * 
     * for multi valued reference.
     * 
     * Script
     * ------
     * 
     *     $('input.referencebrowser').referencebrowser();
     */
    $.fn.referencebrowser = function() {
        var icon = $('<a>&nbsp;</a>').attr('class', 'reference16_16');
        this.after(icon);
        icon = this.next();
        icon.unbind('click');
        icon.bind('click', function() {
            var elem = $(this);
            yafowil.referencebrowser.target = elem.prev().get(0);
            yafowil.referencebrowser.overlay = bdajax.overlay({
                action: 'referencebrowser',
                target: elem.parent().attr('ajax:target')
            });
        });
        return this;
    }
    
    /*
     * Selectable Items
     * ================
     * 
     * Markup
     * ------
     * 
     *     <div>
     *       <div class="selectable">selectable 1</div>
     *       <div class="selectable">selectable 2</div>
     *     </div>
     * 
     * Script
     * ------
     * 
     *     $('a.selectable').selectable();
     */
    $.fn.selectable = function() {
        this.unbind('click').bind('click', function(event) {
            event.preventDefault();
            $(document).unbind('mousedown')
                       .bind('mousedown', function(event) {
                // var elem = $(event.currentTarget);
                // XXX: unselect other selections therefor
            });
            var elem = $(event.currentTarget);
            var container = elem.parent();
            if (!cone.keys.ctrl_down && !cone.keys.shift_down) {
                container.children().removeClass('selected');
                elem.addClass('selected');
            } else {
                if (cone.keys.ctrl_down) {
                    elem.toggleClass('selected');
                }
                if (cone.keys.shift_down) {
                    var selected = container.children('.selected');
                    // get nearest next selected item, disable others
                    var current_index = elem.index();
                    // -1 means no other selected item
                    var nearest = -1;
                    var selected_index, selected_elem;
                    $(selected).each(function() {
                        selected_elem = $(this);
                        selected_index = selected_elem.index();
                        if (nearest == -1) {
                            nearest = selected_index;
                        } else if (current_index > selected_index) {
                            if (cone.flags.select_direction > 0) {
                                if (selected_index < nearest) {
                                    nearest = selected_index;
                                }
                            } else {
                                if (selected_index > nearest) {
                                    nearest = selected_index;
                                }
                            }
                        } else if (current_index < selected_index) {
                            if (selected_index < nearest) {
                                nearest = selected_index;
                            }
                        }
                    });
                    if (nearest == -1) {
                        elem.addClass('selected');
                    } else {
                        container.children().removeClass('selected');
                        var start, end;
                        if (current_index < nearest) {
                            cone.flags.select_direction = -1;
                            start = current_index;
                            end = nearest;
                        } else {
                            cone.flags.select_direction = 1;
                            start = nearest;
                            end = current_index;
                        }
                        container.children()
                                 .slice(start, end + 1)
                                 .addClass('selected');
                    }
                }
            }
        });
        return this;
    }
    
    // extend yafowil by reference browser widget.
    $.extend(yafowil, {
        
        referencebrowser: {
        
            overlay: null,
            
            target: null,
            
            browser_binder: function(context) {
                $('input.referencebrowser', context).referencebrowser();
                $('select.referencebrowser', context).referencebrowser();
            },
            
            add_reference_binder: function(context) {
                $('a.addreference').bind('click', function(event) {
                    event.preventDefault();
                    yafowil.referencebrowser.addreference(this);
                });
            },
            
            addreference: function(elem) {
                elem = $(elem);
                var uid = elem.attr('id');
                uid = uid.substring(4, uid.length);
                if (!uid) {
                    bdajax.error(
                        'Can not add reference, no UID for node found!');
                    return;
                }
                var label = $('.reftitle', elem.parent()).html();
                var target = yafowil.referencebrowser.target;
                var tag = target.tagName;
                target = $(target);
                // text input for single valued
                if (tag == 'INPUT') {
                    target.attr('value', label);
                    var sel = '[name=' + target.attr('name') + '.uid]';
                    $(sel).attr('value', uid);
                    yafowil.referencebrowser.overlay.close();
                    return;
                }
                // select input for multi valued
                if (tag == 'SELECT') {
                    if ($('[value=' + uid + ']', target.parent()).length) {
                        return;
                    }
                    var option = $('<option></option>')
                        .val(uid)
                        .html(label)
                        .attr('selected', 'selected')
                    ;
                    target.append(option);
                }
            }
        }
    });

})(jQuery);