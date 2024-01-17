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
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "k", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},

    upgrades: {
        11: {
            title: "Drinkin Energy Bars",
            description: "Meters are multiplied by 2",
            cost: new Decimal(2),
            tooltip: "Meters*2",
            effect() {
                return 2
            }
        },
        12: {
            title: "Exponentially speeding up",
            description: "Meters multiplies itself",
            cost: new Decimal(5),
            tooltip: "Meters*((Meters+1)^0.3)",
            effect() {
                let k12 = Decimal.pow(Decimal.add(player.points, 1), 0.3)
                return k12
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            }},
        13: {
            title: "Working out",
            description: "Meters are boosted by total time",
            cost: new Decimal(10),
            tooltip: "Meters*(log_4(timespent))",
            effect() {
                let k13 = Decimal.div(Decimal.log(new Decimal(player.timePlayed)), Decimal.log(4))
                return k13
            },
            effectDisplay() {
                 return format(upgradeEffect(this.layer, this.id))+"x"
             }
            }
        }}
)


