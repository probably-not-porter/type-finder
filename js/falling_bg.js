jQuery(document).ready(function($) {
    // list of images
    const item_urls = [
        './img/beast.png',
        './img/cherish.png',
        './img/dive.png',
        './img/dream.png',
        './img/dusk.png',
        './img/fast.png',
        './img/feather.png',
        './img/gigaton.png',
        './img/great.png',
        './img/heal.png',
        './img/heavy.png',
        './img/hisuian-great.png',
        './img/hisuian-heavy.png',
        './img/hisuian-poke.png',
        './img/hisuian-ultra.png',
        './img/jet.png',
        './img/leaden.png',
        './img/level.png',
        './img/love.png',
        './img/lure.png',
        './img/luxury.png',
        './img/master.png',
        './img/moon.png',
        './img/nest.png',
        './img/net.png',
        './img/origin.png',
        './img/park.png',
        './img/poke.png',
        './img/premier.png',
        './img/quick.png',
        './img/repeat.png',
        './img/safari.png',
        './img/sport.png',
        './img/strange.png',
        './img/timer.png',
        './img/ultra.png',
        './img/wing.png'
    ]
    // Create Items
    for (x=0;x<item_urls.length;x++){
        let newDiv = document.createElement("div");
        let newImg = document.createElement("img");
        newImg.src = item_urls[x % item_urls.length];
        newImg.style.height = (32 + Math.floor(Math.random() * 32)) + "px";
        newDiv.style.left = Math.floor(Math.random() * 100) + "%";
        newDiv.style.animation = "fall 1000" + Math.floor(Math.random() * 1000) + "s linear infinite";
        newDiv.style.animationDelay = "-" + Math.floor(Math.random() * 1000) +"s";
        newDiv.style.animationDuration = (50 + Math.floor(Math.random() * 10)) + "s";
        newDiv.appendChild(newImg);
        document.getElementById("itemrain").appendChild(newDiv);
    }

    // tab = $('.tabs h3 a');

    // tab.on('click', function(event) {
    //     event.preventDefault();
    //     tab.removeClass('active');
    //     $(this).addClass('active');

    //     tab_content = $(this).attr('href');
    //     $('div[id$="tab-content"]').removeClass('active');
    //     $(tab_content).addClass('active');
    // });
});