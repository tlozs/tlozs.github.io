document.addEventListener('DOMContentLoaded', main)

// friends and picturecontent is needed because we don't want the page to regenerate the lists all the time only if it wasn't generated yet
let pictureContent = '';
let friendsContent = '';

// this is needed to avoid a bug of incorrect content shown when clicking on the friends tab but switching back to pics before the friends are loaded
let friendsActive = false;

// they are needed to avoid some other unwanted behaviors
let pictureLoaded = false;
let friendsLoaded = false;


// for ease of use
let loadingGIF = '<img src="src/loading.gif" alt="Loading" class="loading">';


function main(){
    loadData();

    // after everything is loaded we enable the reload button
    document.querySelector('#reload').addEventListener('click', loadData);
}

async function loadData(){
    
    // erase the current content and loaded states

    pictureContent = '';
    friendsContent = '';
    pictureLoaded = false;
    friendsLoaded = false;

    // set the loading gifs

    let aktdiv = document.querySelector('#pfpdiv>div');
    aktdiv.innerHTML = loadingGIF;

    aktdiv = document.querySelector('#content>div');
    aktdiv.innerHTML = loadingGIF;


    // load the header data

    let szotar = (await olvaso_fetch('https://randomuser.me/api/')).results[0];
    
    aktdiv = document.querySelector('#pfpdiv>div');
    aktdiv.innerHTML = '<img src="' + szotar.picture.large + '" alt="pfp" id="pfp" />';
    
    aktdiv = document.querySelector('#name');
    aktdiv.innerHTML = szotar.name.title + " " + szotar.name.first + " " + szotar.name.last;
    
    aktdiv = document.querySelector('#age');
    aktdiv.innerHTML = "(" + szotar.dob.age + ")";
    
    aktdiv = document.querySelector('#dob');
    aktdiv.innerHTML = new Date(szotar.dob.date).toLocaleDateString();
    
    aktdiv = document.querySelector('#email');
    aktdiv.innerHTML='email: <a href="mailto:' + szotar.email + '" class="mail">' + szotar.email + '</a>';
    
    aktdiv = document.querySelector('#bio');
    aktdiv.innerHTML='I am ' + szotar.name.first + " " + szotar.name.last + ', a(n) ' + szotar.dob.age + ' years old ' + (szotar.gender == 'male' ? 'man' : 'lady') +
    ' from ' + szotar.location.city + ' in ' + szotar.location.state + ', ' + szotar.location.country + '.';
    
    aktdiv = document.querySelector('#mobile');
    aktdiv.innerHTML="mobile: " + szotar.cell;
    
    aktdiv = document.querySelector('#nat');
    aktdiv.innerHTML='<img src="https://flagcdn.com/h24/' + szotar.nat.toLowerCase() + '.png" alt="Flag"></img>';
    
    // load the pictures and show them

    
    // enable button functionality
    aktdiv = document.querySelector('#photos');
    aktdiv.innerHTML = '<div>photos</div>';
    
    aktdiv = document.querySelector('#friends');
    aktdiv.innerHTML = '<div>friends</div>';
    
    document.querySelector('#photos>div').addEventListener('click', showPics);
    document.querySelector('#friends>div').addEventListener('click', showFriends);
    
    // load friends and enable it's functionality
    await generatePics();
    
    await generateFriends();
    


}

async function showFriends(){
    friendsActive = true;
    await generateFriends();

    let content = document.querySelector('#content');
    if (friendsActive){
        if (friendsLoaded) {
            content.innerHTML = friendsContent;
        }
        else{
            content.innerHTML = '<div class="flex-wrapped-all-center flex-row">' + loadingGIF + '</div>';
        }
    }
}
async function showPics(){
    friendsActive = false;
    await generatePics();
    
    let content = document.querySelector('#content');
    if (!friendsActive){
        if (pictureLoaded) {
            content.innerHTML = pictureContent;
        }
        else{
            content.innerHTML = '<div class="flex-wrapped-all-center flex-row">' + loadingGIF + '</div>';
        }
    }
}


async function generateFriends(){
    
    if (friendsContent == '') {
    
        let content = document.querySelector('#content');
        if(friendsActive){
            
            // set it to a loading gif till the content is properly loaded
        
            content.innerHTML = '<div class="flex-wrapped-all-center flex-row">' + loadingGIF + '</div>';
        }
    
        // build up the friendlist's content
    
        friendsContent = '<div id="friendlist" class="flex-row flex-wrapped-all-center">';
        let friendNum = getRndInteger(4,35);
        //let friendNum = 4;
    
        for (let i = 0; i < friendNum; i++) {
            
            let candidate = (await olvaso_fetch('https://randomuser.me/api/')).results[0];
        
            friendsContent += '<div class="friend flex-row">';
            
                friendsContent += '<div>';
                friendsContent += '<img src="' + candidate.picture.thumbnail + '" alt="Thumbnail"></img>';
                friendsContent += '</div>';
    
                friendsContent += '<div>';
                friendsContent += candidate.name.first + " " + candidate.name.last;
                friendsContent += '</div>';
    
                friendsContent += '<div>';
                friendsContent += '<a href="mailto:' + candidate.email + '" class="mail">' + candidate.email + '</a>';
                friendsContent += '</div>';
            
            friendsContent += '</div>';
        }
        friendsContent += '</div>';
        
        friendsLoaded = true;
        if (friendsActive) {
            content.innerHTML = friendsContent;
        }
    }
}

async function generatePics(){
    if (pictureContent == '') {
        
        let content = document.querySelector('#content');
        if(!friendsActive){
            
            // set it to a loading gif till the content is properly loaded
        
            content.innerHTML = '<div class="flex-wrapped-all-center flex-row">' + loadingGIF + '</div>';
        }
        
        // build up the picturelist's content
    
        pictureContent = '<div id="picturelist" class="flex-row flex-wrapped-all-center">';
        let picNum = getRndInteger(4,35);
        //let picNum = 100;
    
        for (let i = 0; i < picNum; i++) {
            pictureContent +='<img src="' + (await fetch('https://picsum.photos/200')).url + '" alt="Picture"></img>';
        }
        pictureContent += '</div>';

        pictureLoaded = true;

        if (!friendsActive) {
            content.innerHTML = pictureContent;
        }
    }
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

async function olvaso_fetch(url){
    let promise = await fetch(url);
    let promise_json = await promise.json();
    return promise_json;
}