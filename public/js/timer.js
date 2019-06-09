var timer2 = "10:00";
var interval = setInterval(function () {
    var timer = timer2.split(':');
    var minutes = parseInt(timer[0], 10);
    var seconds = parseInt(timer[1], 10);
    --seconds;
    minutes = (seconds < 0) ? --minutes : minutes;
    if (minutes < 0) clearInterval(interval);
    seconds = (seconds < 0) ? 59 : seconds;
    seconds = (seconds < 10) ? '0' + seconds : seconds;
    $('.countdown').html(minutes + ':' + seconds);
    timer2 = minutes + ':' + seconds;
    if (minutes == 0 && seconds == 0) {
        $('#modal').html(` 
        <div class="container">
            <div class="row mt-5">
                <div class="col-9 mx-auto">
                <h2 class="display-5 text-center">Musisz zarezerwować wybrane miejsca w ciągu 10 min!</h2>
                    <div class="text-right">
                        <a href="/" class="btn btn-dark mt-2">Powrót</a>
                    </div>
                </div>
            </div>
        </div>`)
    }
}, 1000);