/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var globalCharacterData;
var globalCharacterNames = [];
var globalSelectedCharacterNames =[];
var globalCardSlot = 1;
var globalQuestionNumber = 1;
var globalMaxQuestionNumber = 5;
var globalQuestionOptions = 4;
var globalQuestionAnswer;
var globalState;

// Choose a random element from a list
function choose(options) {
    return options[Math.floor(Math.random() * options.length)];
}


// Initialise the page
function init() {

    console.log("Initialising...");
    globalState = "LOADED";
     renderState();

    loadCardData();
    //loadCardDataAsync();
    printCardData();

}

// Start the game
function startGame() {

 globalState = "PLAYING";
 globalQuestionNumber = 1;
  generateQuestion();
 renderState();

}

// Go to the next question
function next() {
 globalQuestionNumber += 1;
 if (globalQuestionNumber > globalMaxQuestionNumber) {
    globalState = "FINISHED";
 }
 generateQuestion();
  renderState();

}

// Generate a random question
function generateQuestion() {

    let attributes = ["Health", "Health Max", "Movement Speed"];
    let scales = ["smallest", "biggest"];

    var characters = [];
    var attribute_values = [];

    var attributeName = choose(attributes);
    var scale = choose(scales);

    var characterName;
    var characterDetails;

    // Build a list of characters that all have a different value for the selected attribute
    while (attribute_values.length < globalQuestionOptions) {

        characterName = choose(globalCharacterNames);
        characterDetails = globalCharacterData[characterName];

        // If we don't have this attribute value already then add to the list
        if (attribute_values.indexOf(characterDetails[attributeName]) == -1){
            attribute_values.push(characterDetails[attributeName]);
            characters.push(characterName);
        }

    }

    // Store which characters were selected
    globalSelectedCharacterNames = characters;


    var minAnswer = attribute_values.indexOf(Math.min.apply(null, attribute_values)) + 1;
    var maxAnswer = attribute_values.indexOf(Math.max.apply(null, attribute_values)) + 1;

    if (scale == "smallest") {
        globalQuestionAnswer = minAnswer;
    }
    else if (scale == "biggest") {
        globalQuestionAnswer = maxAnswer;
    }


    var optionsHTML = "";
    var cardHTML = "";
    var slot = 1;

    // Loop through the selected character names
    characters.forEach(function (characterName) {

        // Show the card for each character
        characterDetails = globalCharacterData[characterName];
        cardHTML = renderCharacter(characterDetails,undefined, undefined, showCharacter = false, showSkill = false, showUpgrade = false);
        dealCard(cardHTML, slot = slot);
        slot += 1;

        // Build a list of the characters to choose from
        optionsHTML += "<li>" + characterName + "</li>";


    });

    var question_text = "Who has the " + (scale + " " + attributeName + "?").toLowerCase();
    document.getElementById("question_text").innerHTML = question_text;
    document.getElementById("options").innerHTML = optionsHTML;

}

// The user selected the answer to a question
function answer(selection) {
    if (globalState == "PLAYING") {
        console.log("You choose answer " + selection);
        console.log("The correct answer was " + globalQuestionAnswer);

        var slot = 1;
        var cardHTML = "";
        // Loop through the selected character names
        globalSelectedCharacterNames.forEach(function (characterName) {

            // Show the card for each character
            var characterDetails = globalCharacterData[characterName];
            cardHTML = renderCharacter(characterDetails,undefined, undefined, showCharacter = true, showSkill = false, showUpgrade = false);
            dealCard(cardHTML, slot = slot);
            slot += 1;

        });


    }
    else {
        console.log("You cannot choose an answer in state " + globalState);
    }



}

function renderState() {

    document.getElementById("state").innerHTML = globalState;
    document.getElementById("question").innerHTML = "Question #" + globalQuestionNumber;

    if (globalState == "PLAYING") {
        document.getElementById("start").style.display = "none";
        document.getElementById("next").style.display = "block";
    }
    else if (globalState == "LOADED") {
            document.getElementById("start").style.display = "block";
            document.getElementById("next").style.display = "none";
            }

    else if (globalState == "FINISHED") {
            document.getElementById("start").style.display = "block";
            document.getElementById("next").style.display = "none";
            }

    var answersHTML="";
    for (var i=1; i<globalMaxQuestionNumber;i++) {
        answersHTML += '<button class="button" type="button" onclick="answer(' + i + ')">' + i + '</button>';
        }
    document.getElementById("answers").innerHTML = answersHTML;

}

function showCard(show_id) {

    console.log("Showing card with ID=" + show_id);
    var card_ids = ["A", "B", "C"];
    var i;
    for (i = 0; i < card_ids.length; i++) {
        if (card_ids[i] !== show_id) {
            document.getElementById(card_ids[i]).style.display = 'none';
        }
    }

    document.getElementById(show_id).style.display = 'block';

}

function printCardData() {

    // The json data is dictionary keyed by character name
    var data = globalCharacterData;

    // Loop through each character name in the dictionary...
    var name;
    for (name in data) {

        console.log("\nCharacter: " + name);

        globalCharacterNames.push(name);

        // Get all of the details for a character keyed by name
        var character = data[name];

        // Print the key attributes and their values...
        var key_data_items = ["Health", "Movement Speed", "Attack Type", "Role", "Mobility"];
        key_data_items.forEach(function (item, index) {
            var item_value = character[item];
            console.log("\t" + item + ": " + item_value);
        });

        console.log("\nSkills:");

        // Get the list of the character's skills...
        var skills, skill;
        skills = character["skills"];
        skills.forEach(function (skill, index) {

            console.log("\tSkill: " + skill["name"]);

            //  Get the list of skill upgrades...
            var upgrades, upgrade;
            upgrades = skill["upgrades"];
            upgrades.forEach(function (upgrade, index) {
                text = name + ":" + skill["name"] + ":" + upgrade["name"];
                text = text.replaceAll(" ", "_");

                console.log("\t\t* " + upgrade["name"]);
                //console.log(text);
            });

        });
    }

}


function loadCardData() {

// Retrieving data:
    var file_name = "./awesomenauts.json";
    //file_name = "./nauts.json";
    console.log("Loading " + file_name + "...");

    let myRequest = new Request(file_name);
    let job = fetch(myRequest);

    job.then(response => {
        return response.json()
    }).then(data => {

        // The json data is dictionary keyed by character name
        globalCharacterData = data;

        // Loop through each character name in the dictionary...
        var name;
        for (name in data) {
            console.log("Load character: " + name);
            globalCharacterNames.push(name);
        }
    });

    console.log("Loaded " + globalCharacterNames.toString());

}

async function loadCardDataAsync() {

// Retrieving data:
    var file_name = "./awesomenauts.json";
    console.log("Loading " + file_name + "...");

    let myRequest = new Request(file_name);
    let successResponse = await fetch(myRequest);
    let data = await successResponse.json();

    data.then(
            successResponse => {
                if (successResponse.status != 200) {
                    return null;
                } else {
                    globalCharacterData = successResponse.json();

                    // Loop through each character name in the dictionary...
                    var name;
                    for (name in globalCharacterData) {
                        console.log("Load character: " + name);
                        globalCharacterNames.push(name);
                    }

                    return globalCharacterData;
                }
            },
            failResponse => {
                return null;
            }
    );
    console.log("Loaded " + globalCharacterNames.toString());

}

function renderCharacter(data, skillName = "", upgradeName = "", showCharacter = true, showSkill = true, showUpgrade = true) {
    // Character Data
    var characterName = data["name"];
    var characterImage = data["img"];
    var characterData = data;

    // Skill data
    var skills = data["skills"];
    var skill = choose(skills);
    var skillName = skill["name"];

    // Upgrade Data
    var upgrades = skill["upgrades"];
    var upgrade = choose(upgrades);
    var upgradeName = upgrade["name"];

    // Render the character details...
    console.log("Rendering character " + characterName + " show=" + showCharacter);

    if (showCharacter == false) {
        document.getElementById("character").style.visibility = "hidden";
    }
    else {
        document.getElementById("character").style.visibility = "visible";
    }

    document.getElementById("an_header").innerHTML = characterName;
    document.getElementById("an_img").src = characterImage;

    // Print the Character key attributes and their values...
    var key_data_items = ["Health", "Health Max", "Movement Speed", "Attack Type", "Role", "Mobility"];
    var stats_html = "";

    key_data_items.forEach(function (item, index) {
        var item_value = characterData[item];
        stats_html += item + ": " + item_value + "<br>";
    });

    document.getElementById("an_stats").innerHTML = stats_html;




    // Render the skill section of the card...
    console.log("\tRendering skill " + skillName + " show="+showSkill);

    if (showSkill == false) {
        document.getElementById("skill1").style.visibility = "hidden";
        document.getElementById("skill2").style.visibility = "hidden";
    }
    else {
        document.getElementById("skill1").style.visibility = "visible";
        document.getElementById("skill2").style.visibility = "visible";

    }

    document.getElementById("an_skill_name").innerHTML = "Skill: " + skillName;
    document.getElementById("an_skill_img").src = skill["img"];

    // Render the skill key attributes and their values...
    stats_html = "";
    var stat;
    var skill_stats = skill["stats"];
    for (stat in skill_stats) {
        stats_html += stat + ": " + skill_stats[stat] + "<br>";
    }



    document.getElementById("an_skill_stats").innerHTML = stats_html;

    // Render the upgrade section...
    console.log("\t\tRendering upgrade " + upgradeName + " show="+showUpgrade);

    if (showUpgrade == false) {
        document.getElementById("upgrade1").style.visibility = "hidden";
        document.getElementById("upgrade2").style.visibility = "hidden";
        document.getElementById("upgrade3").style.visibility = "hidden";
    }
    else {
        document.getElementById("upgrade1").style.visibility = "visible";
        document.getElementById("upgrade2").style.visibility = "visible";
        document.getElementById("upgrade3").style.visibility = "visible";
    }

    document.getElementById("an_upgrade_name").innerHTML = "Upgrade: " + upgradeName;
    document.getElementById("an_upgrade_img").src = upgrade["img"];
    document.getElementById("an_upgrade_description").innerHTML = upgrade["description"] +
            "<br>Cost [$" +
            upgrade["cost"] + "]";

    // Render how upgrades scale with level...
    var upgrade_stats = upgrade["levels"];
    upgrade_stats.forEach(function (item, index) {
        stats_html = "";
        var key;
        for (key in item) {
            stats_html += key + ": " + item[key] + ", ";
        }
        stats_html += "<br>"
        document.getElementById("an_upgrade_level_" + (index + 1)).innerHTML = stats_html;
    });



    return document.getElementById("card_template").innerHTML;

}


function showRandomCard() {

    console.log("Showing a random card...");
    var characterName = globalCharacterNames[Math.floor(Math.random() * globalCharacterNames.length)];
    var characterData = globalCharacterData[characterName];
    renderCharacter(characterData);
}

function dealCard(cardHTML, slot = 1) {

    var card_id = "card" + slot;
    //var newCard = document.getElementById("card_template");
    var newSlot = document.getElementById(card_id);

    newSlot.innerHTML = cardHTML;


}