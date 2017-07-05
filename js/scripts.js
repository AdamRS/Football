var apiKey = "&APIkey=f4ee4a13851f7befbec2ce4c0f5f7a23f9fe027610830b6ff3fd67f467e54ada";
var apiFootballData = null;

// funkcja pobierająca dane z serwera apiFootball
function connectAndDownloadDataFromAPI(link) {
    return new Promise((resolve,reject) => {   
        var apiConnect = new XMLHttpRequest ();
        apiConnect.open("GET","https://apifootball.com/api/?action="+link+apiKey, true);
        apiConnect.onreadystatechange = function () {
            if (apiConnect.readyState === 4 & apiConnect.status === 200 ) {
                resolve(JSON.parse(this.response)); 
                reject("wystąpił błąd. ");       
            };

        };	
        apiConnect.send();
        
    })
    
}

// wyświetl w tabeli listę krajów
connectAndDownloadDataFromAPI("get_countries").then(function(result){
    apiFootballData = result;
    var table = document.getElementById('countriesTable');
    var tableHTML ='';

    Object.keys(apiFootballData).forEach(function(number){
        tableHTML+= "<tr><td data-countryId="+apiFootballData[number].country_id+">"+apiFootballData[number].country_name+"</td></tr>";
    })
    table.innerHTML = tableHTML;

}).catch(function(result){
    document.querySelector("#errorMessage").value = result;
});


// wyświetl w tabeli listę lig z wybranego kraju 

document.getElementById("countriesTable").addEventListener("click", function(event){
    connectAndDownloadDataFromAPI("get_leagues&country_id="+event.target.dataset.countryid).then(function(result){
        apiFootballData = result;
        var table = document.getElementById('leagueTable');
        var tableHTML ='';

        Object.keys(apiFootballData).forEach(function(number){
            tableHTML+= "<tr><td data-leagueId="+apiFootballData[number].league_id+">"+apiFootballData[number].league_name+"</td></tr>";
        })
        table.innerHTML = tableHTML;

    }).catch(function(result){
        document.querySelector("#errorMessage").value = result;
    });


})

// wyświetl w tabeli listę drużyn z wybranego ligi 

document.getElementById("leagueTable").addEventListener("click", function(event){
    connectAndDownloadDataFromAPI("get_standings&league_id="+event.target.dataset.leagueid).then(function(result){
        apiFootballData = result;
        var table = document.getElementById('teamTable');
        var tableHTML ='';
        
        Object.keys(apiFootballData).forEach(function(number){
            tableHTML+= "<tr><td data-leagueId="+apiFootballData[number].league_id+" data-teamName="+encodeURI(apiFootballData[number].team_name)+">"+apiFootballData[number].team_name+"</td></tr>";
        })
        table.innerHTML = tableHTML;
        document.getElementById('daty').style.visibility ="visible";

    }).catch(function(result){
        document.querySelector("#errorMessage").value = result;
    });


})


// wyświetl w tabeli listę meczy wybranej ligi 

document.getElementById("teamTable").addEventListener("click", function(event){
    document.querySelector("#errorMessage").value = " "
    var dateCheck =/[0-9]{4}-[0-1]{1}[0-9]{1}-[0-3]{1}[0-9]{1}/;
    var dataOD = document.querySelector("#dataOd").value;
    var dataDo = document.querySelector("#dataDo").value;
    
    if (dateCheck.test(dataOD) && dateCheck.test(dataDo) && dataOD.toString().length==10 && dataDo.toString().length == 10){

    
        connectAndDownloadDataFromAPI("get_events&from="+dataOD+"&to="+dataDo+"&league_id="+event.target.dataset.leagueid).then(function(result){
            apiFootballData = result;
            var table = document.getElementById('gameTable');
            var tableHTML ='';

            Object.keys(apiFootballData).forEach(function(number){

                if(apiFootballData[number].match_hometeam_name == decodeURI(event.target.dataset.teamname) || apiFootballData[number].match_awayteam_name == decodeURI(event.target.dataset.teamname)){
                    tableHTML+= "<tr data-teamId="+apiFootballData[number].match_id+"><td>"+apiFootballData[number].match_date+"</td><td>"+apiFootballData[number].match_hometeam_name+"</td><td>-</td><td>"+apiFootballData[number].match_awayteam_name+"</td><td> -    </td><td>"+apiFootballData[number].match_hometeam_score+"</td><td>-</td><td>"+apiFootballData[number].match_awayteam_score+"</td></tr>";

                }
            })
            table.innerHTML = tableHTML;

        }).catch(function(result){
            document.querySelector("#errorMessage").value = result;
        });

    }
    else{
        document.querySelector("#errorMessage").value = "Błąd. Sprawdz pola z datą"
        table = document.getElementById('gameTable');
        tableHTML ='';
        table.innerHTML = tableHTML;
    }
    
 
    
    

})


