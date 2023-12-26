function getItem(n){
    console.info(`-> Fetching dex entry from API: #${n}.`);
    LOADING = true;
    CURRENT_TYPES = []; // reset
    CURRENT_FLAVOR = []; // reset
    
    let pkmn_name = "";

    // GET POKEMON INFO
    $.getJSON('https://pokeapi.co/api/v2/pokemon/' + n, function(data) {
        
        
        for (const item of data.types) { // get CURRENT TYPES
            CURRENT_TYPES.push(`${item.type.name}`);
        }
    });

    // GET SPECIES INFO
    $.getJSON('https://pokeapi.co/api/v2/pokemon-species/' + n, function(data) {
        pkmn_name = data.name;
        // Get a RANDOM FLAVOR TEXT
        for (const item of data.flavor_text_entries){
            if (item.language.name == CURRENT_LANG){
                CURRENT_FLAVOR.push(stripname(item.flavor_text, pkmn_name));
            }
        }
        document.getElementById("question").innerHTML = CURRENT_FLAVOR[(Math.floor(Math.random() * CURRENT_FLAVOR.length))]
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
    document.getElementById("complete").innerHTML = `${(DATA.total / MAX_QUESTIONS * 100).toFixed(2)}% Complete`;
}

function apply(n){
    console.info(`-> Attempt apply score change.`);
    
    if (LOADING == false){
        document.getElementById("question").innerHTML = "<span class='loading'>Loading...</span>";
        DATA.total += 1;
        for (const type of CURRENT_TYPES){
            DATA.types[type].score += n;
            DATA.types[type].count += 1;
        }
        if (DATA.total >= MAX_QUESTIONS){
            finishQuiz();
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

function finishQuiz(){
    console.info(`-> Finish quiz.`);
    document.getElementById("content").innerHTML = `
        <h2>Results!</h2>
        <ol id="ranking">
    `;
    for (const [key, value] of Object.entries(DATA.types)) {
        document.getElementById("content").innerHTML += `
        <li data-subject="${getNum(value.score / value.count) }" class="tooltip">
            <span class="${key}">
                ${key.toUpperCase()} 
            </span>(${(getNum(value.score / value.count) / 4 * 100).toFixed(2)}%)
            <span class="tooltiptext ${key}">
                Score: ${value.score}, Votes: ${value.count}
            </span>
        </li>
        `;
    }
    document.getElementById("content").innerHTML += `</ol>`;

    var subjects = document.querySelectorAll("[data-subject]"); 
    var subjectsArray = Array.from(subjects); 
    let sorted = subjectsArray.sort(comparator); 

    sorted.forEach(e => 
        document.querySelector("#ranking"). 
            appendChild(e)); 
}

getItem(randomIntFromInterval(1, MAX_DEXNUM));
displayCompletion();