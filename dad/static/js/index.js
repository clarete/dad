/* Copyright (C) 2011  Lincoln de Sousa <lincoln@comum.org>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function() {
    /* Initializing fancybox (will catch the #slideshow element) */
    initFancyBox();

    /* Updates the stream making an async call to a JSON source in the
     * server side. */
    function updateStream() {
        $.ajax({
            type: 'get',
            url: '../messages.json?max=3',
            dataType: 'json',
            success: function (data) {
                $('#stream').html('');
                $(data.collection).each(function (index, item) {
                    var $el = $(tmpl('streamItemTmpl', item));
                    $el.appendTo($('#stream'));
                });
            }
        });
    }

    /* Setting up map stuff */
    var mapInstance = setupMap();
    updateMap(mapInstance);

    /* URL for the default avatar in message form. */
    var defaultGravatar = 'http://www.gravatar.com/avatar/?s=48&d=mm';

    $('form#thanks').ajaxForm({
        beforeSubmit: function (data) {
        },
        success: function (data) {
            if (data.status === 'error') {
                $('.successMsg').hide();
                $('.errMsg pre').html(data.message);
                $('.errMsg').show();
                return setTimeout(function() {
                    return $('.errMsg').hide(400);
                }, 5000);
            } else {
                $('.errMsg').hide();
                $('.successMsg').show();
                $('#gravatar').attr('src', defaultGravatar);
                setupSlideshow(8);
                updateStream();
                // updateMap(mapInstance);
                $('form#thanks')[0].reset();
                return setTimeout(function() {
                    return $('.successMsg').hide(400);
                }, 5000);
             }
        }
    });

    /* Setting up `identi.ca' box */
    $('#identica_search').liveTwitter(
        '#thxdebian',
        {service: 'identi.ca', limit: 5, rate: 5000});


    /* Setting up user avatar url after filling email (gravatar) or
     * avatar url  */
    $('#email').change(function () {
        if ($('#avatar').val() === '' &&
            $('#email').val() === '' &&
            $('#gravatar').val() !== defaultGravatar) {
            /* Let's set the default avatar coming from gravatar if, and
             * only if, the user has changed it */
            $('#gravatar').attr('src', defaultGravatar);
        } else if ($('#avatar').val() === '') {
            /* Using gravatar's `API' to get an url for the user's
             * avatar */
            var url = "http://www.gravatar.com/avatar/" +
                    $.md5($(this).val()) +
                    '?s=48&d=mm';
            $('#gravatar').attr('src', url);
        }
    });

    $('#avatar').change(function () {
        var val = $(this).val();
        if (val !== '') {
            $('#gravatar').attr('src', val);
        } else {
            $('#email').change();
        }
    });


    /* Trying to catch the geolocation info from the browser through an
     * HTML5 API */
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (pos) {
            $('#latitude').val(pos.coords.latitude);
            $('#longitude').val(pos.coords.longitude);
        }, function () {

        });
    }

    /* Supporting browsers that don't have the `placeholder' stuff */
    var input = document.createElement('input');
    if (!('placeholder' in input)) {
        $('form#thanks label').css('display', 'block');
    }
}).call(this);
