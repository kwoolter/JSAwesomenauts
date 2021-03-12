/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var globalCharacterData;
var globalCharacterNames = [];
var globalCardSlot = 1;

function init() {

    console.log("Initialising...");

    loadCardData();
    //loadCardDataAsync();
    printCardData();

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

function renderCharacter(data, skillName = "", upgradeName = "") {

    var characterName = data["name"];
    var characterImage = data["img"];
    var characterData = data;

    console.log("Rendering character " + characterName);

    var skills = data["skills"];
    var skill;
    if (skillName == "") {
        skill = skills[Math.floor(Math.random() * skills.length)];
        skillName = skill["name"];
    } else {
        x = 10;
    }

    var upgrades = skill["upgrades"];
    var upgrade;
    if (upgradeName == "") {
        upgrade = upgrades[Math.floor(Math.random() * upgrades.length)];
        upgradeName = upgrade["name"];
    }


    console.log("\tRendering skill " + skillName);
    document.getElementById("an_header").innerHTML = characterName;
    document.getElementById("an_img").src = characterImage;

    // Print the key attributes and their values...
    var key_data_items = ["Health", "Movement Speed", "Attack Type", "Role", "Mobility"];
    var stats_html = "";

    key_data_items.forEach(function (item, index) {
        var item_value = characterData[item];
        stats_html += item + ": " + item_value + "<br>";
    });

    document.getElementById("an_stats").innerHTML = stats_html;


    // Render the skill section of the card...
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
    console.log("\t\tRendering upgrade " + upgradeName);

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


}


function showRandomCard() {

    console.log("Showing a random card...");
    var characterName = globalCharacterNames[Math.floor(Math.random() * globalCharacterNames.length)];
    var characterData = globalCharacterData[characterName];
    renderCharacter(characterData);
}

function dealCard(cardHTML, slot = 1) {
    slot = globalCardSlot;
    var card_id = "card" + slot;

    var newCard = document.getElementById("card_template");
    var newSlot = document.getElementById(card_id);

    newSlot.innerHTML = newCard.innerHTML;

    globalCardSlot += 1;
    if (globalCardSlot > 3) {
    globalCardSlot = 1;}



}