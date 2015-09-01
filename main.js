var topStories = [];
var mySidebar = $('.ui.sidebar');
//swipe event
var pusher = document.getElementsByClassName("pusher")[0];
var hammer = new Hammer(pusher);
hammer.on("swiperight", function (e) {
    toggleSidebar();
});

$(".sidebar>a.item").click(itemClick);
    
//hackernews api request
var hackernews = function (url) {
    var promise = Q.Promise(function (resolve, reject) {
        $.getJSON('https://hacker-news.firebaseio.com/v0/' + url + '.json', function (res) {
            resolve(res);
        });
    });
    return promise;
}
//add item
var addItem = function (item) {
    item.time = jQuery.timeago(item.time * 1000);
    item.text = item.text || "";
    item.descendants = item.descendants || 0;
    var template = '<div class="item"><div class="content"><a class="header" href="' + item.url
        + '" target="view_window">' + item.title
        + '</a><div class="meta"><span> by <a href="#">' + item.by
        + '</a></span></div><div class="description"><p>' + item.text
        + '</p></div><div class="extra"><div class="ui label"><i class="thumbs outline up icon"></i>' + item.score
        + '</div><div class="ui label"><i class="wait icon"></i>' + item.time
        + '</div><a class="ui orange label"><i class="comments icon"></i>' + item.descendants
        + ' comments</a></div></div></div>';
    $(template).appendTo($(".ui.divided.items"));
}

function toggleSidebar() {
    mySidebar.sidebar('toggle');
}

//auto loading
function scrollLoad(options) {
    if (window.innerHeight + document.body.scrollTop + options.heightOffset >= document.body.scrollHeight) {
        window.onscroll = null;
        $('.huge.loading').show();
        hackernews("item/" + topStories.shift())
            .then(function (res) {
                addItem(res);
                $('.huge.loading').hide();
                window.onscroll = function () {
                    scrollLoad(options);
                }
            });
    }
};

//change content to job, new stroies, ask section.
function itemClick(){
    $(".ui.divided.items").html("");//clear the contents of previous section
    mySidebar.sidebar('toggle');
    var clickItem = $(this).attr("data-id");//determine which section is clicked
    $("#title").text($(this).text());//change the title
    hackernews(clickItem)
      .then(function(res){
        topStories = res;
        for(var i=0;i<10;i++){
          hackernews("item/"+topStories.shift()).then(function(res){
            addItem(res);
          });
        }
      }, function(err){console.log(err)});
}