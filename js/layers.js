addLayer("k", {
    name: "knowledge", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "K", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#be8f3c",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "Knowledge", // Name of prestige currency
    baseResource: "meters", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("k", 14)) mult = mult.times(upgradeEffect("k", 14))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "k", description: "k: Reset for Knowledge", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Drinkin Energy Bars",
            description: "Distance is multiplied by 2",
            cost: new Decimal(2),
            tooltip: "Meters*2",
            effect() {
                return 2
            }
        },
        12: {
            title: "Exponentially speeding up",
            description: "Distance multiplies itself",
            cost: new Decimal(5),
            tooltip: "(Meters+1)^0.3",
            effect() {
                let output = Decimal.pow(Decimal.add(player.points, 1), 0.3)
                return output
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
            unlocked() {
                if (hasUpgrade("k", 11)) {
                    player.UnlockedUpgrades.push(`k12`)
                    return true
                }
                if (player.UnlockedUpgrades.includes(`k12`)) {
                    return true
                }}
            },
        13: {
            title: "Working out",
            description: "Distance is boosted by total time",
            cost: new Decimal(10),
            tooltip: "log_4(timespent+4)",
            effect() {
                let output = Decimal.log(Decimal.add(player.timePlayed, 4), 4)
                return output
            },
            effectDisplay() {
                 return format(upgradeEffect(this.layer, this.id))+"x"
             },
            unlocked() {
                if (hasUpgrade("k", 12)) {
                    player.UnlockedUpgrades.push(`k13`)
                    return true
                }
                if (player.UnlockedUpgrades.includes(`k13`)) {
                    return true
                }}
            },
        14: {
            title: "Critical Thinking",
            description: "Knowledge is multiplied by Distance",
            cost: new Decimal(25),
            tooltip: "(Meters+1)^0.2",
            effect() {
            let output = Decimal.pow(Decimal.add(player.points, 1), 0.2)
                 return output
            },
            effectDisplay() {
                   return format(upgradeEffect(this.layer, this.id))+"x"
            },
            unlocked() {
                if (hasUpgrade("k", 13)) {
                    player.UnlockedUpgrades.push(`k14`)
                    return true
                }
                if (player.UnlockedUpgrades.includes(`k14`)) {
                    return true
                }
            }},
         15: {
            title: "Critical Running",
            description: "Distance is multiplied by Knowledge",
            cost: new Decimal(50),
            tooltip: "(Knowledge+1)^0.3",
            effect() {
            let output = Decimal.pow(Decimal.add(player.k.points, 1), 0.3)
            return output
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
            unlocked() {
                if (hasUpgrade("k", 14)) {
                    player.UnlockedUpgrades.push(`k15`)
                    return true
                }
                if (player.UnlockedUpgrades.includes(`k15`)) {
                    return true
                }
            }
            }
        }}
)

addLayer("p", {
    name: "power", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#F4BC1C",
    requires: new Decimal(1000), // Can be a function that takes requirement increases into account
    resource: "Power", // Name of prestige currency
    baseResource: "Knowledge", // Name of resource prestige is based on
    baseAmount() {return player.k.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "p: Reset for Power", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        if (hasUpgrade("k", 15)) {
            if (!player.UnlockedLayers.includes("p") == true) {
                player.UnlockedLayers.push("p")
            }

            return true
        }
        if (player.UnlockedLayers.includes("p") == true) {
            return true
        }
    },
    branches: ["k"],
    upgrades: {
        11: {
            title: "Turning books into energy",
            description: "Unlock a new buyable",
            cost: new Decimal(1),
            effect() {
            let output = Decimal.pow(Decimal.add(player.k.points, 1), 0.3)
            return output
            }
        },
    },
    buyables: {
        11: {
            title: "Diet",
            display() {return autoThisBuyableDisplay("Double distance each time you buy this.", this)
            },
            cost(x) { return Decimal.pow(10, x) },
            unlocked() {if (hasUpgrade("p", 11)) {return true}},
            canAfford() { if (player.k.points.gte(this.cost())) {return true} else {return false}},
            buy() {
                player.k.points = player.k.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                let output = Decimal.pow(2, getBuyableAmount(this.layer, this.id))
                return output
            }
        },
    }
})

// A side layer with achievements, with no prestige
addLayer("a", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "yellow",
    resource: "achievements", 
    row: "side",
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Achievements")
    },
    achievementPopups: true,
    achievements: {
        11: {
            name: "Did i blend it?",
            done() {if (hasUpgrade("k", 11)) {return true}}, 
            goalTooltip: "Get the first upgrade.", // Shows when achievement is not completed
            doneTooltip: "Get the first upgrade.", // Showed when the achievement is completed
            
            onComplete() {
                player[this.layer].points = Decimal.add(player[this.layer].points, 1)
            }},
        12: {
            name: "Faster then Usian Bolt",
            done() {if (hasUpgrade("k", 15)) {return true}}, 
            goalTooltip: "Get the fifth upgrade.", // Shows when achievement is not completed
            doneTooltip: "Get the fifth upgrade.", // Showed when the achievement is completed
             
             onComplete() {
                player[this.layer].points = Decimal.add(player[this.layer].points, 1)
            }},
        13: {
            name: "POWER!!!",
            done() {if (player.p.points.gte(1)) {return true}}, 
            goalTooltip: "Get the fifth upgrade.", // Shows when achievement is not completed
            doneTooltip: "Get the fifth upgrade.", // Showed when the achievement is completed
                 
            onComplete() {
                player[this.layer].points = Decimal.add(player[this.layer].points, 1)
            }},
            },
    midsection: ["grid", "blank"],
    })
