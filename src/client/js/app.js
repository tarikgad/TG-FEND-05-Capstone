let all_Data,zipcode,ccode,lat,lng,summary,temp,placename,flag,countryname,capital,region,previewURL,tripperiod,flgimg;
let travel_date;
let return_date;

//  ------------------ POST -------------------
const postData = async ( url = '', data = {})=>{
    console.log("postData");
    console.log("data is: ",data);
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    try {
        const newData = await response.json();
        console.log("newData in POST is");
        console.log(newData);
        return newData;
    }
    catch(error) {
        console.log("error", error);
    }
};

//  ------------------ Get position -------------------
const retrievePosition = async () =>{
    console.log("starting retrievePosition function");

    fetch('http://localhost:8080/position')
    .then(res => res.json())
    .then(function(res) {
        console.log("retrievePosition: ", res);
        lat = res.postalCodes[0].lat;
        lng = res.postalCodes[0].lng;
        placename = res.postalCodes[0].placeName;
        postData('http://localhost:8080/add_geo', {lat:lat,lng:lng,placename:placename});
    });
};

//  ------------------ Get Weather -------------------
const retrieveWeather = async () =>{
    console.log("starting retrieveWeather function");
    
    const date1 = new Date(document.getElementById("travel").value);
    const date2 = new Date(document.getElementById("return").value);
    const day = new Date();

    const x1 = new Date(date1-day);
    const d1 = x1.getDate(); //days till travel day
    const x2 = new Date(date2-day);
    const d2 = x2.getDate(); //days till return day
    tripperiod = d2-d1;

    let url;
    if (d1>7){
        const __time = date1.getTime()/1000;
        url = `,${__time}?units=ca&exclude=flags,hourly,daily`;
    }
    else{
        url = `?units=ca&exclude=flags,hourly,daily`;
    }

    postData('http://localhost:8080/add_weather_url', {url:url});
    setTimeout(function(){
        fetch('http://localhost:8080/weather')
        .then(res => res.json())
        .then(function(res) {
            console.log("retrieveWeather: ", res);
            summary = res.currently.summary;
            temp = res.currently.temperature;
            postData('http://localhost:8080/add_weather', {summary:summary,temp:temp});
        });
    },2000);
};

//  ------------------ Get Pixabay -------------------
const retrievePix = async () =>{
    console.log("starting retrievePix function");

    fetch('http://localhost:8080/pix')
    .then(res => res.json())
    .then(function(res) {
        console.log("retrievePix: ", res);
        previewURL = res.hits[0].webformatURL;
        contimg = document.getElementById('contimg');
        contimg.src = previewURL;
        contimg.alt = "country image";
        contimg.width = "300";
        document.getElementById("entryHolder").innerHTML = `Hope you a safe trip to ${placename} in ${countryname}.<br>
                                                            The weather will be ${summary} on your arrival date and the temprature will be ${temp}<sup>o</sup>C.<br>
                                                            You will stay there for ${tripperiod} days.<br>
                                                            ${countryname} exists in ${region} and its capital is ${capital}.`;
    });
};


//  ------------------ Click Event Function -------------------
const generate_entry = async () => {
    console.log("generate start");

    zipcode = document.getElementById('zip').value;
    ccode = document.getElementById('cc').value;

    document.getElementById("entryHolder").innerHTML = `Loading data ...`;
    document.getElementById("image").innerHTML = ``;

    postData('http://localhost:8080/add_position', {zipcode:zipcode, ccode:ccode});
    setTimeout(function(){
        document.getElementById("entryHolder").innerHTML = `Loading position data ...`;
        retrievePosition();
        setTimeout(function(){
            console.log("start weather");
            document.getElementById("entryHolder").innerHTML = `Loading weather data ...`;
            retrieveWeather();
            setTimeout(function(){
                console.log("start Pix");
                document.getElementById("entryHolder").innerHTML = `Loading country data ...`;
                retrievePix();
            },2000);
        },2000);
    },2000);
};

//  ------------------ Get Flag -------------------
const getflag = async () =>{
    const response = await fetch(`https://restcountries.eu/rest/v2/alpha/${document.getElementById("cc").value}?fields=name;flag;capital;region`);
    try {
        all_Data = await response.json();
        flag = all_Data.flag;
        countryname = all_Data.name;
        capital = all_Data.capital;
        region = all_Data.region;
        flgimg = document.getElementById('flgimg');
        flgimg.src = flag;
        flgimg.alt = "country flag";
        flgimg.height = "100";
        postData('http://localhost:8080/add_place', {countryname:countryname});
    }
    catch(error) {
        console.log("error", error);
    }
};

//  ------------------ Click Event Listener -------------------
console.log("start");

export { postData,retrievePosition,retrieveWeather,retrievePix,generate_entry,getflag };

