let modInfo = {
	name: "The Distance Tree",
	id: "distantids",
	author: "jacpa2011",
	pointsName: "meters",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: (1/60),  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1.5 Alpha",
	name: "Alpha",
}

let changelog = `<h1>Changelog:</h1><br>
<font color="red">
<h2>Spoiler warning!</h2>
</font><br>

	<br><br><h3>v0.1.5</h3><br>
	- Added a Upgrade
	<br>
	- Added a whole mechanic in layer Power
	<br>
	- Added a buyable and clickable
	<br><br><h3>v0.1.4</h3><br>
	- Added a softcap after 1e6 meters
	<br>
	- Updated the description of <b>Diet</b>
	<br><br><h3>v0.1.3</h3><br>
	- Added 1 upgrade
	<br>
	- Added 1 Achievement
	<br>
	- Reduced the cost of power
	<br>
	- Reduced the buff of <b>Turning books into energy</b>
	<br>
	- Added 1 milestone
	<br><br><h3>v0.1.2</h3><br>
	- Added 1 upgrade
	<br>
	- Added another layer
	<br>
	- Added a buyable
	<br>
	- Added 1 Achievement
	<br><br><h3>v0.1.1</h3><br>
	- Added 1 upgrade
	<br>
	- Added 1 Achievement
	<br><br><h3>v0.1</h3><br>
	- Added 2 more upgrades
	<br>
	- Added 1 Achievement
	<br><br><h3>v0.0</h3><br>
	- Added 2 upgrades
	<br>
	- Added a layer
	`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0.1) // base
	if (hasUpgrade("k", 11)) gain = gain.times(upgradeEffect("k", 11))
	if (hasUpgrade("k", 12)) gain = gain.times(upgradeEffect("k", 12))
	if (hasUpgrade("k", 13)) gain = gain.times(upgradeEffect("k", 13))
	if (hasUpgrade("k", 15)) gain = gain.times(upgradeEffect("k", 15))
	gain = gain.times(buyableEffect("p", 11));
	gain = gain.times(Decimal.log(new Decimal(player.p.spin).add(10), 10).pow(0.5))
	if (player.points.gte(1e6)) gain = gain.pow(new Decimal(1).sub(Decimal.log(player.points.sub(1e6), 10).div(30)))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() {
	return {
	UnlockedLayers: [],
	UnlockedUpgrades: []
}}

// Display extra things at the top of the page
var displayThings = [
	function() {
	return "TPS = "+format(player.p.fps)+"s/tick"
	},
	function() {
		if (player.points.gte(1e6)) {
			return `<font color="red">Distance is softcapped by ^${new Decimal(1).sub(Decimal.log(player.points.sub(1e6), 10).div(30))}</font>`
		}
	}
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return 3600 // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}