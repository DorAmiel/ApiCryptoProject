$(() => {

    //Set Attr.
    $("#about-container").hide()
    $("#live-reports-container").hide()

    //Declarations
    let lastClick
    let listArray = []

    // First entrance load(Coins Cards)
    $.ajax({
        url: "https://api.coingecko.com/api/v3/coins/list",
        success: (list) => {
            displayCard(list);
            listArray = [...list]
                // console.log(listArray)
        },
        error: () => {
            alert("Faild to recive data from server. Please try again later.")
        }

    });

    //Display Card Function

    const displayCard = (list) => {
        let coinCard = "";
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
        }
        $("#main-container").append(coinCard);
        $(".spinner-container").hide()
        clickEventFunction()
        checkBoxLimitCheck()

    };

    //More Info functions
    const clickEventFunction = () => {
        $(".more-info-button").click(function() {
            $(this).next().collapse("toggle");
            let cardId = $(this).attr("id");
            $(`#spinner${cardId}`).show()

            //More Info Ajax Calling
            $.ajax({
                url: `https://api.coingecko.com/api/v3/coins/${cardId}`,
                success: (data) => {
                    setToLocalStorage(cardId, data)
                    displayCoinInformation(data, this, cardId)

                },
            });
            $(this).next().empty()

            // displayCoinInformation(data, this, cardId)
            // const displayCoinInformation = (data) => {

            //     let usdPrice = data.market_data.current_price.usd
            //     let euroPrice = data.market_data.current_price.eur
            //     let ilsPrice = data.market_data.current_price.ils
            //     let coinThumbnail = data.image.thumb
            //     let coinSymbol = data.symbol

            //     let moreInfo = `
            //         <div id="more-info-place-holder">
            //         <br>
            //         <span>${usdPrice} &#36;</span>
            //         <br>
            //         <span>${euroPrice} &#8364;</span>
            //         <br>
            //         <span>${ilsPrice} &#8362;</span>
            //         <br>
            //         <img src="${coinThumbnail}" alt="${coinSymbol} img">
            //         </div>`

            //     $(this).next().append(moreInfo);
            //     $(`#spinner${cardId}`).hide()

            //Set To Local Storage
            // setToLocalStorage(cardId)
            // let newCoin = {
            //         coinId: cardId,
            //         usdPrice: usdPrice,
            //         euroPrice: euroPrice,
            //         ilsPrice: ilsPrice,
            //         coinThumbnail: coinThumbnail,
            //         coinSymbol: coinSymbol
            //     }
            //     // let coinsArray = localStorage.getItem("coins-list")
            //     // let coinsList = JSON.parse(coinsArray)

            // // if (coinsList === null) {
            // //     coinsList = []
            // // }

            // // coinsList.push(newCoin)

            // let coinsToJson = JSON.stringify(newCoin)
            // localStorage.setItem(cardId, coinsToJson)
            // console.log(localStorage.getItem(cardId))



            // checkTimePassedAndRemoveFromLocalStorage(cardId)
            //     // };
        });
    };

    const setToLocalStorage = (cardId, coinData) => {
        let newCoin = {
                coinId: cardId,
                usdPrice: coinData.market_data.
                current_price.usd,
                euroPrice: coinData.market_data.
                current_price.eur,
                ilsPrice: coinData.market_data.
                current_price.ils,
                coinThumbnail: coinData.image.
                thumb,
                coinSymbol: coinData.symbol
            }
            // let coinsArray = localStorage.getItem("coins-list")
            // let coinsList = JSON.parse(coinsArray)

        // if (coinsList === null) {
        //     coinsList = []
        // }

        // coinsList.push(newCoin)

        let coinsToJson = JSON.stringify(newCoin)
        localStorage.setItem(cardId, coinsToJson)
        console.log(localStorage.getItem(cardId))



        checkTimePassedAndRemoveFromLocalStorage(cardId)
    }

    const displayCoinInformation = (data, buttonId, cardId) => {

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
        </div>`

        $(buttonId).next().append(moreInfo);
        $(`#spinner${cardId}`).hide()
    }

    const checkTimePassedAndRemoveFromLocalStorage = (cardId) => {
        console.log(cardId)
        setTimeout(() => {
            localStorage.removeItem(cardId)
            $(`#more-info-place-holder`).toggle(3000).remove()
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
            if (selectedCoinsArray.length > 5) {
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
                <div class="custom-control custom-switch ">
                <input class="custom-control-input modalCheckBox" type="checkbox" checked role="switch" id="coin-switch-${
                  selectedCoinsArray[i].id}">
                  <label class="switch custom-control-label" for="coin-switch-${selectedCoinsArray[i].id}"></label>

            </div>
                </div>
                `
        }

        $('#modal-coins-container').append(selectedCoinsInModal)

        $('#exampleModal').modal('show')
    }


    $("#modal-coins-container").on('click', '.modalCheckBox', (event) => {
        let coinInModal = event.currentTarget.id.substr(12)
        console.log(event.currentTarget.checked)
        if (!coinInModal.checked) {
            selectedCoinsArray.splice(coinInModal, 1)
            $(`#main-container`).find(
                `#checkbox-${coinInModal}`
            )[0].checked = false;
            console.log(selectedCoinsArray)
            $('#modal-coins-container').empty()
            $('#exampleModal').modal('hide')
        }
    })

    $(`.modal-close-button`).click(() => {
        $('#modal-coins-container').empty()
        let canceledCoin = selectedCoinsArray.pop()
        console.log(canceledCoin)
        $(`#main-container`).find(
            `#checkbox-${canceledCoin.id}`
        )[0].checked = false;
        console.log(selectedCoinsArray)
    })

    //Filter By Search

    $(`#search-button`).click(() => {
        $("#main-container").empty();
        let searchedCoinSymbol = $(`#search-input`).val()
        console.log(searchedCoinSymbol)
        const searchedCoinsArray = listArray.filter((coin) => {
            if (coin.id.includes(searchedCoinSymbol)) {
                return coin;
            }
        });
        console.log(searchedCoinsArray)
        displayCard(searchedCoinsArray)
    })


    //Navigate Buttons functions

    $("#about-button").click(() => {
        $("#main-container").hide();
        $("#live-reports-container").hide();
        $("#about-container").show();
    });
    $("#coins-button").click(() => {
        $("#live-reports-container").hide();
        $("#about-container").hide();
        $("#main-container").show();
        displayCard(listArray)
    });
    $("#live-reports-button").click(() => {
        $("#main-container").hide();
        $("#about-container").hide();
        $("#live-reports-container").show();
    });



    //TODOS    
    //FIX SECONDS AJAX CALLING AFTER REMOVE FROM LOCALSTORAGE
    //fix when search
});