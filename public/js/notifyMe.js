/*
 notifyMe jQuery Plugin v1.0.0
 Copyright (c)2014 Sergey Serafimovich
 Licensed under The MIT License.
*/

function explode() {
    $(".block-message").addClass("").removeClass("show-block-valid show-block-error");
    $(".message").fadeOut();
}

function myTimeout() {
    setTimeout(function() {
        explode();
    }, 4000);
}

(function(e) {
    e.fn.notifyMe = function() {
        // Alert messages
        var thvalid = '<p class="notify-valid">Login successful.<br>Admin tools are now being displayed.</p>';
        var thproblem = '<p class="notify-valid">Invalid username or password.<br>Please check it and try again.</p>';
        var thavailability = '<p class="notify-valid">Service is not available at the moment.<br>Please check your internet connection or try again later.</p>';

        var x = e(this).find("input[name=username]");
        var y = e(this).find("input[name=hashed_password]");
        var s = e(this).attr("action");
        var o = e(this).find(".note");
        var thform = document.getElementById("notifyMe");

        e(this).on("submit", function(t) {
            t.preventDefault();
            if (e) {
                $(".message").removeClass("error bad-email success-full");
                $(".message").hide().html('').fadeIn();
                $(".fa-spinner").addClass("fa-spin").removeClass("opacity-0");
                o.show();
                e.ajax({
                    type: "POST",
                    url: s,
                    data: {
                        username: x.val(),
                        hashed_password: y.val()
                    },
                    dataType: "json",
                    error: function(e) {
                        console.log(e.responseText);
                        console.log(e.status)
                        o.hide();
                        $(".fa-spinner").addClass("opacity-0").removeClass("fa-spin");
                        $(".block-message").addClass("show-block-error").removeClass("show-block-valid");
                        if (e.status === 404) {
                            $(".message").html(thavailability).fadeIn();
                            myTimeout();
                        }
                        else {
                            if (e.responseText === "successful") {
                                $(".fa-spinner").addClass("opacity-0").removeClass("fa-spin");
                                $(".message").removeClass("bad-email").addClass("success-full");
                                $(".block-message").addClass("show-block-valid").removeClass("show-block-error");
                                $(".message").html(thvalid).fadeIn();
                                thform.reset();
                            }
                            else {
                                $(".fa-spinner").addClass("opacity-0").removeClass("fa-spin");
                                $(".message").addClass("bad-email").removeClass("success-full");
                                $(".block-message").addClass("show-block-error").removeClass("show-block-valid");
                                $(".message").html(thproblem).fadeIn();
                                thform.reset();
                            }
                        }
                    }
                }).done(function(e) {
                    o.hide();
                });
            }
            else {
                $(".fa-spinner").addClass("opacity-0").removeClass("fa-spin");
                $(".message").addClass("bad-email").removeClass("success-full");
                $(".block-message").addClass("show-block-error").removeClass("show-block-valid");
                $(".message").html(thproblem).fadeIn();
                myTimeout();
                o.hide();
            }

            // Reset and hide all messages on .keyup()
            $("#notifyMe input").on('keyup keypress', function(e) {
                var code = e.keyCode || e.which;

                if (code === 13) {
                    e.preventDefault();
                    $("#notifyMe").submit();
                }
                else {

                    clearTimeout(myTimeout);

                    $(".block-message").addClass("").removeClass("show-block-valid show-block-error");
                    $(".message").fadeOut();
                }
            });
        });
    };

})(jQuery);
