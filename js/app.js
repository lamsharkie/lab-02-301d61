'use strict';

let monstersArray = [];
let keywordArray= [];
let pageNumber = 'page-1';

//Ajax, stop cleaning washing the dishes and fetch me those monsters!
function queryPage(){
    keywordArray = [];
    monstersArray = [];

    $.ajax(`./data/${pageNumber}.json`, {method: 'GET', dataType: 'JSON'})
    .then ( (data) => {
        data.forEach( (value) => {
            new Monster(value).renderMonsters(value);            
            if (!keywordArray.includes(value.keyword)){
                keywordArray.push(value.keyword);
            }           
        });
    populateDropDown();    
});
}



//Constructor Function for our Monsters
function Monster(data){
    this.image_url = data.image_url;
    this.title = data.title;
    this.description = data.description;
    this.keyword = data.keyword;
    this.horns = data.horns;
    monstersArray.push(this);
}

Monster.prototype.renderMonsters= (data) => {
    let $template = $('#photo-template').html();
    let $target = $('main');
    $target.append(Mustache.render($template, data));
}

// Function to populate drop down menu
function populateDropDown() {
    keywordArray.forEach( (word) => {
        let $options = $('<option></option>');
        $options.text(word);
        $options.val(word);
        $('select').append($options);
    });
}

// Function to sort by keyword
function filterByKeyword(event) {
    const sections = $('section');
    
    sections.each( function (sect, value) {
        if ( $(value).attr('keyword') === event.target.value) {
            $(value).show();
        }else {
            $(value).hide()
        }
    });
}

$('select').change(filterByKeyword);

// removes content on page and initiates load of next page
function pageChanger(event) {
    event.preventDefault();
    pageNumber = event.target.value;
    let oldMonster = $('section').not('#photo-template');
    let oldKeyword = $('option');
    $(oldMonster).remove();
    $(oldKeyword).remove();

    queryPage();
}

$('.next').on('click', pageChanger);

//Runs AJAX on page load
queryPage();