$(() => {

    //Hide Divs
    $("#about-container").hide()
    $("#live-reports-container").hide()

    //Declarations
    let coinCard = "";
    let lastClick
    let switchCounter = 0
    let listArray = []

    // First entrance load(Coins Cards)
    $.ajax({
        url: "https://api.coingecko.com/api/v3/coins/list",
        success: (list) => {
            displayCard(list);
            listArray = [...list]
                // console.log(listArray)
        },
    });

    //Display Card Function
    const displayCard = (list) => {
        for (let i = 0; i < 100; i++) {
            // console.table(list[i])
            coinCard += `
            <div class="col">
                <div id="card-container" class="card border-light mb-3 coin-card" style="max-width: 15rem; ">
                    <div class="card-header">${list[i].symbol}</div>
                    <div class="card-body">
                        <h5 class="card-title">${list[i].name}</h5>
                        <div id="switch-box" class="custom-control custom-switch">
                        <input type="checkbox" class="myCheckBox  custom-control-input" id="checkbox-${list[i].id}">
                        <label class="switch custom-control-label" for="checkbox-${list[i].id}"></label>
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
            switchCounter++
        }
        $("#main-container").append(coinCard);
        $(".spinner-container").hide()
        clickEventFunction()
        checkBoxLimitCheck()

    };

    //More Info functions
    const clickEventFunction = () => {
        $(".more-info-button").click(function() {
            lastClick = (new Date()).getTime();
            $(this).next().collapse("toggle");
            if ($(this).next().children().length <= 0) {
                let cardId = $(this).attr("id");
                $(`#spinner${cardId}`).show()

                //More Info Ajax Calling
                $.ajax({
                    url: `https://api.coingecko.com/api/v3/coins/${cardId}`,
                    success: (data) => {
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

                    //Set To Local Storage
                    let newCoin = {
                        coinId: cardId,
                        usdPrice: usdPrice,
                        euroPrice: euroPrice,
                        ilsPrice: ilsPrice,
                        coinThumbnail: coinThumbnail,
                        coinSymbol: coinSymbol
                    }
                    let coinsArray = localStorage.getItem("coins-list")
                    let coinsList = JSON.parse(coinsArray)

                    if (coinsList === null) {
                        coinsList = []
                    }

                    coinsList.push(newCoin)

                    let coinsToJson = JSON.stringify(coinsList)
                    localStorage.setItem("coins-list", coinsToJson)



                    checkTimePassedAndRemoveFromLocalStorage(lastClick, coinsList, cardId, )
                };
            } else {
                return;
            }
        });
    };


    const checkTimePassedAndRemoveFromLocalStorage = (lastClick, coinsList, cardId) => {
        console.log(coinsList)
            // console.log(cardId)
        setTimeout(() => {
            let currentTime
            currentTime = (new Date()).getTime();
            if (currentTime > lastClick) {
                let filteredCoinsList = coinsList.filter(el => el.cardId !== cardId)
                coinsList = filteredCoinsList
                let coinsToJson = JSON.stringify(coinsList)
                localStorage.setItem("coins-list", coinsToJson)
                    // localStorage.removeItem("coins-list");
                    // console.log(coinsList)
                $(`#more-info-place-holder`).toggle(3000).remove()
            }
        }, 3000);
    }



    let selectedCoinsArray = []
    const checkBoxLimitCheck = () => {
        $(".myCheckBox").change(function() {
            let specificCheckBoxId = $(this).attr('id');
            let coinIdSelected = specificCheckBoxId.substr(9)
            console.log(specificCheckBoxId)
            console.log(coinIdSelected)
            let isChecked = $(this).prop('checked')
            let selectedCoinToModal = listArray.find(element => element.id === coinIdSelected)
            if (isChecked === true) {
                selectedCoinsArray.push(selectedCoinToModal)
            } else {
                selectedCoinsArray.splice(selectedCoinToModal, 1)
            }
            console.log(selectedCoinsArray)
            if (selectedCoinsArray.length > 3) {
                popUpModal()
            }

        });
    }





    const popUpModal = () => {

        console.log(selectedCoinsArray)
        let selectedCoinsInModal = ''
        for (let i = 0; i < selectedCoinsArray.length - 1; i++) {
            selectedCoinsInModal += `
                <div class="modal-selected-coins">
                <h5>${selectedCoinsArray[i].id}</h5>
                <div id="switch-box" class="custom-control custom-switch">
                    <input type="checkbox" checked class="modalCheckBox  custom-control-input" id="modal-checkbox-${selectedCoinsArray[i].id} ">
                    <label class="switch custom-control-label" for="modal-checkbox-${selectedCoinsArray[i].id}"></label>
                    <hr>
                </div>
                </div>
                `
        }

        $('#modal-coins-container').append(selectedCoinsInModal)

        $('#exampleModal').modal('show')
    }

    $(".modalCheckBox").on('click', '.modalCheckBox', (event) => {
        console.log(event.currentTarget)
    })



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