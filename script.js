document.addEventListener('DOMContentLoaded', main)

// this is needed to avoid a bug of incorrect content shown when clicking on the friends tab but switching back to pics before the friends are loaded
// it tracks which tab is active atm, so works like a toggle
// we initialize with the Pics tab so it's false
let friendsActive = false;

// friends and picturecontent is needed because we don't want the page to regenerate the lists all the time only if it wasn't generated yet
let pictureContent;
let friendsContent;

// they are needed to avoid some other unwanted behaviors
// they track if the generation process is completed or not
let pictureLoaded;
let friendsLoaded;

function initializeValues(){
    pictureContent = '';
    friendsContent = '';
    pictureLoaded = false;
    friendsLoaded = false;
}

// for ease of use
let loadingGIF = '<img src="src/loading.gif" alt="Loading" class="loading">';

function main(){
    // enable button functionality, they are usable and properly functional while the data is on load
    aktdiv = document.querySelector('#photos');
    aktdiv.innerHTML = '<div>photos</div>';
    
    aktdiv = document.querySelector('#friends');
    aktdiv.innerHTML = '<div>friends</div>';
    
    document.querySelector('#photos>div').addEventListener('click', showPics);
    document.querySelector('#friends>div').addEventListener('click', showFriends);
    
    // load
    loadData();

    // after everything is loaded we enable the reload button
    document.querySelector('#reload').addEventListener('click', loadData);
}

async function loadData(){
    
    // erase the current content and loaded states
    initializeValues();
    

    // set the loading gifs and delete the old data

    let aktdiv = document.querySelector('#pfpdiv>div');
    aktdiv.innerHTML = loadingGIF;

    aktdiv = document.querySelector('#content>div');
    aktdiv.innerHTML = loadingGIF;

    aktdiv = document.querySelector('#name');
    aktdiv.innerHTML = '';
    
    aktdiv = document.querySelector('#age');
    aktdiv.innerHTML = '';
    
    aktdiv = document.querySelector('#dob');
    aktdiv.innerHTML = '';
    
    aktdiv = document.querySelector('#email');
    aktdiv.innerHTML = '';
    
    aktdiv = document.querySelector('#bio');
    aktdiv.innerHTML = '';
    
    aktdiv = document.querySelector('#mobile');
    aktdiv.innerHTML = '';
    
    aktdiv = document.querySelector('#nat');
    aktdiv.innerHTML = '';


    // load the header (profile) data

    let szotar = (await olvaso_fetch('https://randomuser.me/api/')).results[0];
    
    aktdiv = document.querySelector('#pfpdiv>div');
    aktdiv.innerHTML = '<img src="' + szotar.picture.large + '" alt="pfp" id="pfp" />';
    
    aktdiv = document.querySelector('#name');
    aktdiv.innerHTML = szotar.name.title + " " + szotar.name.first + " " + szotar.name.last;
    
    aktdiv = document.querySelector('#age');
    aktdiv.innerHTML = '(' + szotar.dob.age + ')';
    
    aktdiv = document.querySelector('#dob');
    aktdiv.innerHTML = new Date(szotar.dob.date).toLocaleDateString();
    
    aktdiv = document.querySelector('#email');
    aktdiv.innerHTML = 'email: <a href="mailto:' + szotar.email + '" class="mail">' + szotar.email + '</a>';
    
    aktdiv = document.querySelector('#bio');
    aktdiv.innerHTML = 'I am ' + szotar.name.first + " " + szotar.name.last + ', a(n) ' + szotar.dob.age + ' years old ' + (szotar.gender == 'male' ? 'man' : 'lady') +
    ' from ' + szotar.location.city + ' in ' + szotar.location.state + ', ' + szotar.location.country + '.';
    
    aktdiv = document.querySelector('#mobile');
    aktdiv.innerHTML = 'mobile: ' + szotar.cell;
    
    aktdiv = document.querySelector('#nat');
    aktdiv.innerHTML = '<img src="https://flagcdn.com/h24/' + szotar.nat.toLowerCase() + '.png" alt="Flag"></img>';
    

    // start the loading of the data
    
    startPicsGeneration();
    startFriendsGeneration();
}

async function startPicsGeneration(){
    await generatePics();
}
async function startFriendsGeneration(){
    await generateFriends();
}

function showFriends(){
    // switching through tabs is only available with buttons which call the corresponding show function so only here should we set the toggle
    friendsActive = true;

    let content = document.querySelector('#content');
    
    // we only want to modify the content value if still this tab is loaded
    if (friendsActive){
        // if the loading process is finished, we show the content
        if (friendsLoaded) {
            content.innerHTML = friendsContent;
        }
        // otherwise we set the loading gif as the content
        else{
            content.innerHTML = '<div class="flex-wrapped-all-center flex-row">' + loadingGIF + '</div>';
        }
    }
}
function showPics(){
    // switching through tabs is only available with buttons which call the corresponding show function so only here should we set the toggle
    friendsActive = false;

    let content = document.querySelector('#content');
    
    // we only want to modify the content value if still this tab is loaded
    if (!friendsActive){
        // if the loading process is finished, we show the content
        if (pictureLoaded) {
            content.innerHTML = pictureContent;
        }
        // otherwise we set the loading gif as the content
        else{
            content.innerHTML = '<div class="flex-wrapped-all-center flex-row">' + loadingGIF + '</div>';
        }
    }
}

async function generateFriends(){

    // the loading process starts with overwriting this one so only if it isn't modified means we haven't started the loading process yet
    if (friendsContent == '') {
        
        // set the content to the loading state if this tab is active
        let content = document.querySelector('#content');
        
        if(friendsActive){
            content.innerHTML = '<div class="flex-wrapped-all-center flex-row">' + loadingGIF + '</div>';
        }
        
        let friendNum = getRndInteger(4,35);
        
        // build up the friendlist's content
        friendsContent = '<div id="friendlist" class="flex-row flex-wrapped-all-center">';
            for (let i = 0; i < friendNum; i++) {
                
                let candidate = (await olvaso_fetch('https://randomuser.me/api/')).results[0];
            
                friendsContent += '<div class="friend flex-row">';
                
                    friendsContent += '<div>';
                    friendsContent += '<img src="' + candidate.picture.thumbnail + '" alt="Thumbnail"></img>';
                    friendsContent += '</div>';
        
                    friendsContent += '<div>';
                    friendsContent += candidate.name.first + ' ' + candidate.name.last;
                    friendsContent += '</div>';
        
                    friendsContent += '<div>';
                    friendsContent += '<a href="mailto:' + candidate.email + '" class="mail">' + candidate.email + '</a>';
                    friendsContent += '</div>';
                
                friendsContent += '</div>';
            }
        friendsContent += '</div>';
        
        // it is loaded, if the tab is still active, show it
        friendsLoaded = true;
        if (friendsActive) {
            content.innerHTML = friendsContent;
        }
    }
}
async function generatePics(){

    // the loading process starts with overwriting this one so only if it isn't modified means we haven't started the loading process yet
    if (pictureContent == '') {
        
        // set the content to the loading state if this tab is active
        let content = document.querySelector('#content');
        if(!friendsActive){
            content.innerHTML = '<div class="flex-wrapped-all-center flex-row">' + loadingGIF + '</div>';
        }
        
        let picNum = getRndInteger(4,35);
        
        // build up the picturelist's content
        pictureContent = '<div id="picturelist" class="flex-row flex-wrapped-all-center">';
            for (let i = 0; i < picNum; i++) {
                pictureContent +='<img src="' + (await fetch('https://picsum.photos/200')).url + '" alt="Picture"></img>';
            }
        pictureContent += '</div>';

        // it is loaded, if the tab is still active, show it
        pictureLoaded = true;
        if (!friendsActive) {
            content.innerHTML = pictureContent;
        }
    }
}

// some random function yoinked from the web
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

// this is the fetch function for the user API
async function olvaso_fetch(url){
    let promise = await fetch(url);
    let promise_json = await promise.json();
    return promise_json;
}