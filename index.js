$(() => {
    // First entrance load(Coins Cards)

    let coinCard = "";
    let lastClick

    $.ajax({
        url: "https://api.coingecko.com/api/v3/coins/list",
        success: (list) => {
            displayCard(list);
        },
    });

    const displayCard = (list) => {
        for (let i = 0; i < 100; i++) {
            // console.table(list[i])
            coinCard += `
            <div class="col">
                <div id="card-container" class="card border-light mb-3 coin-card" style="max-width: 15rem; ">
                    <div class="card-header">${list[i].symbol}</div>
                    <div class="card-body">
                        <h5 class="card-title">${list[i].name}</h5>
                        <div class="custom-control custom-switch">
                        <input type="checkbox" class="custom-control-input" id="switchID${list[i].id}">
                        <label class="custom-control-label" for="switchID${list[i].id}"></label>
                        </div>
                        <br>
                        <button id="${list[i].id}" type="button" class="btn btn-outline-primary more-info-button">More Info</button>
                        <div id="data-place-holder${list[i].id}"></div>
                        <div class="spinner-container" id="spinner${list[i].id}">
                        <div class="spinner-border text-dark" role="status">
                        <span class="sr-only">Loading...</span>
                      </div>
                        </div>
                    </div>
                    </div>
                </div>
            `;

        }
        $("#main-container").append(coinCard);
        $(".spinner-container").hide()
        clickEventFunction();
    };

    //More Info functions
    const clickEventFunction = () => {
        $(".more-info-button").click(function() {
            lastClick = (new Date()).getTime();
            $(this).next().collapse("toggle");
            if ($(this).next().children().length <= 0) {
                let cardId = $(this).attr("id");
                $(`#spinner${cardId}`).show()
                $.ajax({
                    url: `https://api.coingecko.com/api/v3/coins/${cardId}`,
                    success: function(data) {
                        displayCoinInformation(data);
                    },
                });
                const displayCoinInformation = (data) => {

                    let usdPrice = data.market_data.current_price.usd
                    let euroPrice = data.market_data.current_price.eur
                    let ilsPrice = data.market_data.current_price.ils
                    let coinThumbnail = data.image.thumb
                    let coinSymbol = data.symbol

                    let moreInfo = `
                    <div id="more-info-place-holder">
                    <br>
                    <span>${usdPrice} &#36;</span>
                    <br>
                    <span>${euroPrice} &#8364;</span>
                    <br>
                    <span>${ilsPrice} &#8362;</span>
                    <br>
                    <img src="${coinThumbnail}" alt="${coinSymbol} img">
                    </div>`;

                    $(this).next().append(moreInfo);
                    $(`#spinner${cardId}`).hide()

                    localStorage.setItem("usdPrice", usdPrice)
                    localStorage.setItem("euroPrice", euroPrice)
                    localStorage.setItem("ilsPrice", ilsPrice)
                    localStorage.setItem("coinThumbnail", coinThumbnail)
                    localStorage.setItem("coinSymbol", coinSymbol)
                    console.log(localStorage)

                    checkTimePassed(lastClick, localStorage, cardId)
                };
            } else {
                return;
            }
        });
    };


    const checkTimePassed = (lastClick, localStorage, cardid) => {
        setTimeout(() => {
            let currentTime
            currentTime = (new Date()).getTime();
            if (currentTime > lastClick) {
                console.log(localStorage)
                localStorage.clear();
                $(`#more-info-place-holder`).toggle(3000).remove()
            }
        }, 3000);
    }


    //Navigate Buttons functions

    $("#about-button").click(function() {
        $("#main-container").hide();
        $("#live-reports-container").hide();
        $("#about-container").show();
    });
    $("#coins-button").click(function() {
        $("#live-reports-container").hide();
        $("#about-container").hide();
        $("#main-container").show();
    });
    $("#live-reports-button").click(function() {
        $("#main-container").hide();
        $("#about-container").hide();
        $("#live-reports-container").show();
    });



    //TODOS    
    //FIX MULTIPLE STORE IN LOCALSTORAGE
    //FIX SECONDS AJAX CALLING AFTER REMOVE FROM LOCALSTORAGE
});