$(() => {

    //First entrance load (Coins Cards)

    let coinCard = ''
    $.ajax({
        url: "https://api.coingecko.com/api/v3/coins/list",
        success: (list) => {
            displayCard(list)
        },
        error: (list) => {}
    });


    const displayCard = (list) => {
        for (let i = 0; i < 100; i++) {
            console.table(list[i])
            coinCard += `
            <div class="col">
                <div id="${i} coin-card" class="card border-light mb-3" style="max-width: 15rem;">
                    <div class="card-header">${list[i].symbol}</div>
                    <div class="card-body">
                        <h5 class="card-title">${list[i].name}</h5>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
                        </div>
                        <br>
                        <button type="button" class="btn btn-outline-primary">More Info</button>
                    </div>
                </div>
            </div>`
        }
        $("#main-container").append(coinCard)
    }

    //More Info functions

})