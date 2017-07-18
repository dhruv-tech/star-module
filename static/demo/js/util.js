//Written by Dhruv Malik

const sidebar = {
    getLocations: function(){
        $.get( "/api/stock-locations/count", function(res) {
            $.get( `/api/stock-locations/0/${res.count}`, function(locations) {
                //Setting to default
                $("#locationName").html(locations[0].name);
                $("#locationid").html(`ID: ${locations[0].locationId}`);

                locations.forEach(function(element) {
                    let layout = `<li class="list-group-item location-choice" locationid="${element.locationId}">${element.name}</li>`;
                    $( "#location-choice-list" ).append(layout);
                }, this);

                sidebar.saveLocation(locations[0].name, locations[0].locationId);
            });
        }); 
    },

    setLocation: function(obj) {
        $("#locationName").html($(obj).text());
        $("#locationid").html(`ID: ${$(obj).attr("locationid")}`);

        sidebar.saveLocation($(obj).text(), $(obj).attr("locationid"), true);
    },
    saveLocation: function(name, id) {
        if (typeof(Storage) !== "undefined") {
            sessionStorage.setItem("_StarModule_Loc_name", name);
            sessionStorage.setItem("_StarModule_Loc_id", id);
        } else {
            alert("Error: Browser out of date.");
        }
        
        //if(dashboard === true){} // change to callback
    },
    displayToggle: function() {
        $( "#sidebar" ).toggle("slow");
    }

}

const dashGrid = {
    getSetData: function(){
        $.get( "/api/products/count", function(res) {
            $("#infocards-products .card-title").html(res.count);
        }); 
        $.get( "/api/categories/count", function(res) {
            $("#infocards-categories .card-text span").html(res.count);
        });
        $.get( "/api/stock-locations/count", function(res) {
            $("#dash-grid-depots").html(res.count);
        }); 
        $.get( "/api/plants/count", function(res) {
            $("#dash-grid-factories").html(res.count);
        }); 
    },
    getSetSpecificData: function(){
        let loc_id = parseInt(sessionStorage.getItem("_StarModule_Loc_id"));

        $.ajax({
            url:"/api/inventory/0/1",
            type:"POST",
            data: JSON.stringify({ "locationId": loc_id }),
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(res){
                $("#infocards-inventory .card-text span").html(res.count);
            }
        });

        
        $.ajax({
            url:"/api/stock-transfer/0/1",
            type:"POST",
            data: JSON.stringify({ "destinationId": loc_id }),
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(res){
                $("#dash-grid-transferins").html(res.count);
            }
        });

        $.ajax({
            url:"/api/stock-transfer/0/1",
            type:"POST",
            data: JSON.stringify({ "originId": loc_id }),
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(res){
                $("#dash-grid-transferouts").html(res.count);
            }
        });

        $.ajax({
            url:"/api/stock-receipt/0/1",
            type:"POST",
            data: JSON.stringify({ "destinationId": loc_id }),
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(res){
                $("#dash-grid-receipts").html(res.count);
            }
        });
        $.ajax({
            url:"/api/stock-locations/0/1",
            type:"POST",
            data: JSON.stringify({ "locationId": loc_id.toString() }),
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(res){
                $("#infocards-about .card-block").html(`
                    <h4 class="card-title">${res.results[0].name}</h4>
                    <p class="text">${res.results[0].address}</p>
                    <a href="${res.results[0].map_url}" target="_blank">Show on Map</a>
                    <p class="text">Contact: ${res.results[0].contact} (${res.results[0].phone})</p>
                `);
            }
        });

    }
}

const directory = {
    stockLocationsCount :0,
    stockLocationsDisplayed: 0,
    factoriesCount :0,
    factoriesDisplayed: 0,
    getCount: function(dataset){
        $.get( `/api/${dataset}/count`, function(res) {
            if(dataset === "stock-locations"){
                directory.stockLocationsCount = res.count;
            }
            else if(dataset === "plants"){
                directory.factoriesCount = res.count;
            }
        });
    },
    getAndAppendStockLocations: function(){
        $.get( `/api/stock-locations/${directory.stockLocationsDisplayed}/${directory.stockLocationsDisplayed+5}`, function(res) {
            $(res).each(function(index, location){
                let html = `<tr>
                    <th scope="row" class="hidden-xs-down">${location._id.match(new RegExp('.{1,5}', 'g')).join(" ")}</th>
                    <td>${location.name}</td>
                    <td><span class="hidden-xs-down">${location.address}<br></span> <a href="${location.map_url}" target="_blank">Show on Map</a></td>
                    <td>${location.contact} (${location.phone})</td>
                </tr>`;
                $('#depots-table tbody').append(html);
                directory.stockLocationsDisplayed += 5;
            });
        });
    },
    getAndAppendFactories: function(){
        $.get( `/api/plants/${directory.factoriesDisplayed}/${directory.factoriesDisplayed+5}`, function(res) {
            $(res).each(function(index, location){
                let html = `<tr>
                    <th scope="row" class="hidden-xs-down">${location._id}</th>
                    <td>${location.name} (${location.owner})</td>
                    <td><span class="hidden-xs-down">${location.address}<br></span> <a href="${location.map_url}" target="_blank">Show on Map</a></td>
                    <td>${location.contact} (${location.phone})</td>
                </tr>`;
                $('#factories-table tbody').append(html);
                directory.factoriesDisplayed += 5;
            });
        });
    }
}

const logs = {
    recieptsCount :0,
    recieptsDisplayed: 0,
    transfersCount :0,
    transfersDisplayed: 0,
    getCount: function(dataset){
        $.get( `/api/${dataset}/count`, function(res) {
            if(dataset === "stock-receipt"){
                logs.recieptsCount = res.count;
            }
            else if(dataset === "plants"){
                logs.transfersCount = res.count;
            }
        });
    },
    getAndAppendStockReceipts: function(){
        $.get( `/api/stock-receipt/${logs.recieptsDisplayed}/${logs.recieptsDisplayed+5}`, function(res) {
            $(res).each(function(index, item){
                let html = `<tr>
                    <td scope="row" class="hidden-xs-down">${item._id}</td>
                    <td>${item.productName}</td>
                    <td><span class="">${item.originName}</span></td>
                    <td>${item.quantity}</td>\
                    <td scope="row">${item.timestamp}</td>
                </tr>`;
                $('#receipts-table tbody').append(html);
                logs.recieptsDisplayed += 5;
            });
        });
    },
    getAndAppendTransfers: function(){
        $.get( `/api/stock-transfer/${logs.transfersDisplayed}/${logs.transfersDisplayed+5}`, function(res) {
            $(res).each(function(index, item){
                let html = `<tr>
                    <td scope="row" class="hidden-xs-down">${item._id}</td>
                    <td>${item.productName}</td>
                    <td><span class="">${item.originName}</span></td>
                    <td>${item.quantity}</td>\
                    <td scope="row">${item.timestamp}</td>
                </tr>`;
                $('#transfers-table tbody').append(html);
                logs.transfersDisplayed += 5;
            });
        });
    }
}