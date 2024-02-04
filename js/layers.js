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
                if (hasUpgrade("p", 12)) {
                    let output = upgradeEffect("p", 12).times(2)
                    return output
                }
                return 2
            }
        },
        12: {
            title: "Exponentially speeding up",
            description: "Distance multiplies itself",
            cost: new Decimal(5),
            tooltip: "(Meters+1)^0.3",
            effect() {
                let output = Decimal.pow(player.points.add(1), 0.3)
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
                let output = Decimal.log(Decimal.add(player.timePlayed,4), 4)
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
        },
        passiveGeneration() {
            if (hasMilestone("p", 0)) {
                return 0.1
            }
        }
    }
)

////////////////---------------////////////////////////////

addLayer("p", {
    name: "power", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        total: new Decimal(0),
        fps: new Decimal(0),
        spin: decimalZero,
        spincooldown: new Decimal(10)
    }},
    color: "#F4BC1C",
    requires: new Decimal(100), // Can be a function that takes requirement increases into account
    resource: "Power", // Name of prestige currency
    baseResource: "Knowledge", // Name of resource prestige is based on
    baseAmount() {return player.k.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.4, // Prestige currency exponent
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
    branches: ["k"],
    update(diff) {
        if (player.k.points.gte(100)) {
            player[this.layer].unlocked = true
        }
        let tooltip1 = tmp.p.buyables[11].effect
        tmp.p.buyables[11].tooltip = `Currently: ${format(tooltip1)}x`
        player.p.fps = diff
        player.p.spin = player.p.spin.add(player.p.spin.mul(new Decimal(diff).mul(player.p.spincooldown.pow(-1))))
        player.p.spincooldown = buyableEffect("p", 12).abs()
    },
    upgrades: {
        11: {
            title: "Turning books into energy",
            description: "Unlock a new buyable",
            cost: new Decimal(1),
            effect() {
            let output = Decimal.pow(player.k.points.add(1), 0.3)
            return output
            }
        },
        12: {
            title: "I like energy bars",
            description: "Boost <b>Drinkin Energy Bars</b> based on OoMs of distance",
            tooltip: "1.14^floor(log(meters+1))",
            cost: new Decimal(3),
            effect() {
            let output = Decimal.pow(1.14, Decimal.floor(Decimal.log(player.points.add(1), 10)))
            return output
            },
            unlocked() {
                if (hasUpgrade("p", 11)) {
                    player.UnlockedUpgrades.push(`p12`)
                    return true
                }
                if (player.UnlockedUpgrades.includes(`p12`)) {
                    return true
                }
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
        },
        13: {
            title: "Angular momentum?",
            description: "Unlock a new tab.",
            tooltip: "",
            cost: new Decimal(6),
            unlocked() {
                if (hasUpgrade("p", 12)) {
                    player.UnlockedUpgrades.push(`p13`)
                    return true
                }
                if (player.UnlockedUpgrades.includes(`p13`)) {
                    return true
                }
            },
        },
    },
    buyables: {
        11: {
            title: "Diet",
            display() {return autoThisBuyableDisplay("Multiply Disance by 2^(amount/2)", this, " Knowledge")
            },
            cost(x) { return Decimal.pow(10, x) },
            unlocked() {if (hasUpgrade("p", 11)) {return true}},
            canAfford() { if (player.k.points.gte(this.cost())) {return true}},
            buy() {
                player.k.points = player.k.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                let output = Decimal.pow(2, getBuyableAmount(this.layer, this.id).div(2))
                return output
            },
        },
        12: {
            title: "FASTER!",
            display() {return autoThisBuyableDisplay("Divide Rotation cooldown by 2", this, " Power")},
            style() {
                if (player.p.points.gte(this.cost())) {
                return {
                    "background-color": "lightblue",
                }}
                else {
                    return {
                        "background-color": "#bf8f8f",
                    }  
                }
            },
            cost(x) { return (new Decimal(2).pow(x)) },
            unlocked() {return true},
            canAfford() { if (player.p.points.gte(this.cost())) {return true}},
            buy() {
                player.p.points = player.p.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                let output = new Decimal(10).div(new Decimal(2).pow(getBuyableAmount(this.layer, this.id)))
                return output
            },
        },
    },
    clickables: {
        11: {
            display() {return `<h3>Add 1 spin</h3>`},
            canClick() {return true},
            style() {
                return {
                    "background-color": "lightblue",
                }
            },
            onClick() {player.p.spin = player.p.spin.add(1)}
        }
    },
    bars: {
        11: {
            direction: RIGHT,
            width: 400,
            height: 50,
            fillStyle: {'background-color' : "lightblue"},
            borderStyle: {"border-width": "7px"},
            progress() {
                let output = player.p.spin.div(Decimal.log(player.p.spin.add(1000), 1000).floor().pow_base(1000))
                return output.div(1000)
            }
        }
    },
    milestones: {
        0: {
            requirementDescription: "Get 2 total Power",
            effectDescription: "Gain 10% of Knowledge per second",
            done() { return player.p.total.gte(1.9) }
        }
    },
    tabFormat: {
        "Power": {
            content:[
                "main-display",
                "prestige-button",
                "resource-display",
                "milestones",
                "blank",
                ["buyable", 11],
                "blank",
                "upgrades"
            ],
            unlocked() {if (hasUpgrade("p", 13)) {return true} else {return false}}
        },
        "Spin": {
            content:[
                ["display-text", function() {
                    let output = player.p.spin
                    return `<h3>You have <font color="lightblue"><h2>${format(output)}</h2></font> Rotation(s)</h3>`}],
                ["display-text", function() {
                    let output = player.p.spincooldown
                    return `(Which is doubling every ${formatSmall(output)} second(s))`
                }],
                ["display-text", function() {
                    let output = Decimal.log(new Decimal(player.p.spin).add(10), 10).pow(0.5)
                    return `(Which is also multiplying distance by x${format(output)})`
                }],
                "blank",
                ["bar", 11],
                    "blank","blank","blank","blank","blank","blank",
                ["clickable", 11],"blank",
                ["buyable", 12]
            ],
            unlocked() {if (hasUpgrade("p", 13)) {return true} else {return false}},
        }
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
            name: "Faster then Usain Bolt",
            done() {if (hasUpgrade("k", 15)) {return true}}, 
            goalTooltip: "Get the fifth upgrade.", // Shows when achievement is not completed
            doneTooltip: "Get the fifth upgrade.", // Showed when the achievement is completed
             
             onComplete() {
                player[this.layer].points = Decimal.add(player[this.layer].points, 1)
            }},
        13: {
            name: "POWER!!!",
            done() {if (player.p.points.gte(1)) {return true}}, 
            goalTooltip: "Get Power for the first time.", // Shows when achievement is not completed
            doneTooltip: "Get Power for the first time.", // Showed when the achievement is completed
                 
            onComplete() {
                player[this.layer].points = Decimal.add(player[this.layer].points, 1)
            }},
        14: {
            name: "Light-millisecond(s)",
            done() {if (player.points.gte(299792.46)) {return true}}, 
            goalTooltip: "Get around 300000 meters.", // Shows when achievement is not completed
            doneTooltip: "Get around 300000 meters.", // Showed when the achievement is completed
                     
            onComplete() {
                player[this.layer].points = Decimal.add(player[this.layer].points, 1)
            }}
            },
    midsection: ["grid", "blank"],
    })
