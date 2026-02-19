// SETTINGS
const MAX_RESULTS = 10

function getItem(n){
    console.info(`-> Fetching dex entry from API: #${n}.`);
    LOADING = true;
    CURRENT_TYPES = []; // reset
    CURRENT_ABILITIES = [];
    CURRENT_HABITAT = "";
    CURRENT_FLAVOR = []; // reset
    
    let pkmn_name = "";

    // GET POKEMON INFO
    $.getJSON('https://pokeapi.co/api/v2/pokemon/' + n, function(data) {
        console.log(data);
        
        for (const item of data.types) { // get CURRENT TYPES
            CURRENT_TYPES.push(`${item.type.name}`);
        }
        for (const item of data.abilities) { // get CURRENT ABILITIES
            CURRENT_ABILITIES.push(`${item.ability.name}`);
        }
    });

    // GET SPECIES INFO
    $.getJSON('https://pokeapi.co/api/v2/pokemon-species/' + n, function(data) {
        console.log(data);
        pkmn_name = data.name;

        if (data["habitat"]){
            CURRENT_HABITAT = `${data.habitat.name}`; // GET CURRENT HABITAT
        }else{
            CURRENT_HABITAT = "";
        }

        // Get a RANDOM FLAVOR TEXT
        for (const item of data.flavor_text_entries){
            if (item.language.name == CURRENT_LANG){
                CURRENT_FLAVOR.push(stripname(item.flavor_text, pkmn_name));
            }
        }
        document.getElementById("question").innerHTML = `"${CURRENT_FLAVOR[(Math.floor(Math.random() * CURRENT_FLAVOR.length))]}"`
        LOADING = false;
    });
}
function stripname(text, name){
    nameCap = name[0].toUpperCase() + name.slice(1);
    text = text.replace(name.toUpperCase(), "_____");
    text = text.replace(name.toLowerCase(), "_____");
    text = text.replace(nameCap, "_____");
    return text
}
function comparator(a, b) { 
    if (a.dataset.subject > b.dataset.subject) 
        return -1; 
    if (a.dataset.subject < b.dataset.subject) 
        return 1; 
    return 0; 
} 
function getNum(val) {
    if (isNaN(val)) {
        return 2;
    }
    return val + 2;
}

function displayCompletion(){
    console.info(`-> Display progress meter.`);
    document.getElementById("complete").innerHTML = `${(DATA.total / MAX_QUESTIONS * 100).toFixed(2)}% Complete, ${DATA.total}/${MAX_QUESTIONS}`;
}

function apply(n){
    console.info(`-> Attempt apply score change.`);
    
    if (LOADING == false){
        document.getElementById("question").innerHTML = "<span class='loading'>Loading...</span>";
        DATA.total += 1;

        for (const type of CURRENT_TYPES){ // score types
            DATA.types[type].score += n;
            DATA.types[type].count += 1;
        }

        for (const ab of CURRENT_ABILITIES){ // score types
            if (!(ab in DATA.abilities)){
                DATA.abilities[ab] = {
                    score: n,
                    count: 1
                }
            }else{
                DATA.abilities[ab].score += n;
                DATA.abilities[ab].count += 1;
            }
        }

        if (CURRENT_HABITAT != ""){         // score habitat
            if (!(CURRENT_HABITAT in DATA.habitat)){ 
                DATA.habitat[CURRENT_HABITAT] = {
                    score: n,
                    count: 1
                }
            }else{
                DATA.habitat[CURRENT_HABITAT].score += n;
                DATA.habitat[CURRENT_HABITAT].count += 1;
            }
        }
        

        if (DATA.total == MAX_QUESTIONS){
            viewResults();
        }else{
            displayCompletion();
            getItem(randomIntFromInterval(1, MAX_DEXNUM));
        }
        
    }
}

function skip(){
    console.info(`-> Attempt skip question.`);
    if (LOADING == false){
        document.getElementById("question").innerHTML = "<span class='loading'>Loading...</span>";
        displayCompletion();
        getItem(randomIntFromInterval(1, MAX_DEXNUM));
    }
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function viewResults(){
    console.info(`-> View quiz.`);
    document.getElementById("content").style.display = "none"; // hide quiz content
    document.getElementById("results").style.display = "inline-block"; // show results content

    // get type ranking
    document.getElementById("type-ranking").innerHTML = "";
    for (const [key, value] of Object.entries(DATA.types)) {
        if (value.count != 0){
            document.getElementById("type-ranking").innerHTML += `
            <li data-subject="${getNum(value.score / value.count) }" class="tooltip">
                <span class="${key}">
                    ${key.toUpperCase()} 
                </span>(${(getNum(value.score / value.count) / 4 * 100).toFixed(2)}%)
                
            </li>
            `;
        }
    }

    document.getElementById("ability-ranking").innerHTML = "";
    for (const [key, value] of Object.entries(DATA.abilities)) {
        document.getElementById("ability-ranking").innerHTML += `
            <li data-subject="${getNum(value.score / value.count) }" class="tooltip">
                <span class="${key}">
                    ${key.toUpperCase()} 
                </span>(${(getNum(value.score / value.count) / 4 * 100).toFixed(2)}%)
            </li>
            `;
    }

    document.getElementById("habitat-ranking").innerHTML = "";
    for (const [key, value] of Object.entries(DATA.habitat)) {
        document.getElementById("habitat-ranking").innerHTML += `
            <li data-subject="${getNum(value.score / value.count) }" class="tooltip">
                <span class="${key}">
                    ${key.toUpperCase()} 
                </span>(${(getNum(value.score / value.count) / 4 * 100).toFixed(2)}%)
            </li>
            `;
    }

    sortList("#type-ranking"); 
    sortList("#ability-ranking"); 
    sortList("#habitat-ranking"); 
}

function sortList(list_elem){
    var subjects = document.querySelectorAll(`${list_elem} [data-subject]`); 
    var subjectsArray = Array.from(subjects); 
    let sorted = subjectsArray.sort(comparator);
    console.log(sorted)
    let sorted_max = sorted.slice(0, MAX_RESULTS);
    console.log(sorted_max)
    document.querySelector(list_elem).innerHTML = "";
    sorted_max.forEach(e => 
        document.querySelector(list_elem). 
            appendChild(e)); 
}

function start(){
    document.getElementById("content").style.display = "block";
    document.getElementById("startscreen").style.display = "none";
}

function doMore(){
    document.getElementById("results").style.display = "none";
    document.getElementById("content").style.display = "block";
}

getItem(randomIntFromInterval(1, MAX_DEXNUM));
displayCompletion();