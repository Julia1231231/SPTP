/**
 *                                        Flintlock  dueling
 *                                         A mod by Nanoray
 * 
 *                                  Contact on Discord - h.alcyon
 */

MapOpen();

const _ALLOW_LEGACY_TURN = true;

let settings = {
    PUBLISH_TO_SERVERLIST: false,
};

let staticMemory = {
    // * If your mod is still laggy, use setTickThrottle and set this to ahigher number
    // * Alternatively, stop the mod and set a higher number here
    // * Explanation: 
    // - How much time is added to tick loop job delay per player. E.g., if this variable is 2 and there are 3 players, the delay will be 6 ticks (2 * 3)
    // - MUST be an integer, never set it to a decimal number
    TICK_THROTTLE_PER_PLAYER: 1,

    // ! IF YOU WANT TO COMPLETELY DISABLE TICK THROTTLE, SET THIS TO TRUE
    DISABLE_TICK_THROTTLE: false,

    MAX_PLAYER_COUNT: 30, // * Maximum number of player allowed on dueling host

    alwaysPickUpGems: true, // * Changeable - example: If you have 720 gems as a-speedster it will go down to 719

    // * Since low ELO players gain more from winning against high elo players, and vice versa -
    // * This variable determines the maximum ELO one can gain/lose from a single battle 
    MAX_WIN_LOSS_THRESHOLD: 75,

    // * K factor based in which ELO is calculated. Recommended not to change
    ELO_K_FACTOR: 64,


    // ! Experimental mode
    // * Mode description:
    // *             - Other player stats will be invisible (how much shield/gems they have remaining) during duel
    // *             - Dropped gems will be invisible
    // *             - Lasers fired will be invisible
    _ultraDarkMode: false,

    // * If you want players to ONLY be able to select a certain ship, set this to that ships code
    // * e.g. if you want players to only use a-speedster, set it to 605
    requireShip: null,

    // * Defined in number of ticks
    // * Throttles the amount of times an individual player can call `ui_component_clicked` (therefore less lag)
    // ! To disable rate limiting, replace this number with 0
    _CLICK_RATE_LIMIT: 25,

    afkChecker: {
        // * True = will check for AFK people
        active: false,

        // * Change the first number to reflect how many seconds until a player is pronounced AFK
        delay: 20 * 60
    },

    bruteforceBan_minimumSimilarity: 75, // * FOR EXPERIENCED USERS ONLY - How similar a name needs to be to be affected by bruteforceBan, in percents (e.g. 75 === 75%)

    _GLOBAL_ERROR_HANDLER: true, // * If you want every error to appear in the terminal, set this to true



    // ! BELOW ARE PROPERTIES THAT YOU SHOULD NOT CHANGE
    retractableComponentIDs: ["mainControlsBackground"],
    layout: ['qwertyuiop'.split(''), 'asdfghjkl'.split(''), 'zxcvbnm'.split('')],
    layoutString: 'qwertyuiopasdfghjklzxcvbnm',

    GEM_CAPS: {
        1: 20,
        2: 80,
        3: 180,
        4: 320,
        5: 500,
        6: 720,
        7: 980
    }
}

staticMemory.TICK_THROTTLE_PER_PLAYER = Math.round(staticMemory.TICK_THROTTLE_PER_PLAYER);


// ! SHOULD NOT BE CHANGED
let sessionMemory = {
    rememberedIDs: [],
    admins: [],
    banned: [],
    bruteforceBanned: [],
    forceIdle: []
}

const SHIPS = {
    "vanilla": {
        101: { name: "Fly", code: `` },
        191: {
            name: "Spectating",
            code: '{"name":"Spectator","level":1.9,"model":1,"size":0.025,"zoom":2.45063709469745,"specs":{"shield":{"capacity":[1e-30,1e-30],"reload":[1000,1000]},"generator":{"capacity":[1e-30,1e-30],"reload":[1,1]},"ship":{"mass":1,"speed":[200,200],"rotation":[1000,1000],"acceleration":[1000,1000]}},"bodies":{"face":{"section_segments":100,"angle":0,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"y":[-2,-2,2,2],"z":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},"width":[0,1,1,0],"height":[0,1,1,0],"vertical":true,"texture":[6]}},"typespec":{"name":"Spectator","level":1,"model":1,"code":101,"specs":{"shield":{"capacity":[1e-30,1e-30],"reload":[1000,1000]},"generator":{"capacity":[1e-30,1e-30],"reload":[1,1]},"ship":{"mass":1,"speed":[200,200],"rotation":[1000,1000],"acceleration":[1000,1000]}},"shape":[0,0,0,0,0,0,0,0,0,0],"lasers":[],"radius":200}}'
        },
        201: { name: "Delta-Fighter", code: `` },
        202: { name: "Trident", code: `` },
        301: { name: "Pulse-Fighter", code: `` },
        302: { name: "Side-Fighter", code: `` },
        303: { name: "Shadow X-1", code: `` },
        304: { name: "Y-Defender", code: `` },
        401: { name: "Vanguard", code: `` },
        402: { name: "Mercury", code: `` },
        403: { name: "X-Warior", code: `` },
        404: { name: "Side-interceptor", code: `` },
        405: { name: "Pioneer", code: `` },
        406: { name: "Crusader", code: `` },
        501: { name: "U-Sniper", code: `` },
        502: { name: "FuryStar", code: `` },
        503: { name: "T-Warrior", code: `` },
        504: { name: "Aetos", code: `` },
        505: { name: "Shadow X-2", code: `` },
        506: { name: "Howler", code: `` },
        507: { name: "Bat-Defender", code: `` },
        601: { name: "Advanced-Fighter", code: `` },
        602: { name: "Scorpion", code: `` },
        603: { name: "Marauder", code: `` },
        604: { name: "Condor", code: `` },
        605: { name: "A-Speedster", code: `` },
        606: { name: "Rock-Tower", code: `` },
        607: {
            name: "O-Defender",
            code: '{"name":"O-Defender","level":6,"model":7,"size":2.2,"specs":{"shield":{"capacity":[400,550],"reload":[10,13]},"generator":{"capacity":[70,100],"reload":[25,40]},"ship":{"mass":500,"speed":[70,80],"rotation":[30,40],"acceleration":[60,80]}},"bodies":{"main":{"section_segments":8,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0],"y":[-90,-88,0,90,91],"z":[0,0,0,0,0]},"width":[5,6,25,10,20],"height":[2,10,40,20,20],"texture":[63,1,10],"propeller":true,"laser":{"damage":[35,60],"rate":2,"type":2,"speed":[130,180],"number":1,"angle":0,"error":0}},"side":{"section_segments":10,"offset":{"x":50,"y":0,"z":0},"position":{"x":[-40,-5,15,25,20,0,-50],"y":[-100,-70,-40,-10,20,50,90],"z":[0,0,0,0,0,0,0]},"width":[5,20,20,20,20,20,5],"height":[15,25,30,30,30,25,0],"texture":[0,1,2,3,4,63]},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-60,"z":18},"position":{"x":[0,0,0,0,0,0,0],"y":[-10,0,20,30,40],"z":[0,0,0,0,0]},"width":[0,5,10,10,0],"height":[0,5,10,12,0],"texture":[9]},"top_propulsor":{"section_segments":15,"offset":{"x":0,"y":0,"z":10},"position":{"x":[0,0,0,0],"y":[80,95,100,90],"z":[0,0,0,0]},"width":[5,20,10,0],"height":[5,15,5,0],"propeller":true,"texture":[1,63,12]},"bottom_propulsor":{"section_segments":15,"offset":{"x":0,"y":0,"z":-10},"position":{"x":[0,0,0,0],"y":[80,95,100,90],"z":[0,0,0,0]},"width":[5,20,10,0],"height":[5,15,5,0],"propeller":true,"texture":[1,63,12]}},"wings":{"join":{"offset":{"x":0,"y":20,"z":0},"length":[80,0],"width":[130,50],"angle":[-1],"position":[0,-30],"texture":[8],"bump":{"position":-20,"size":15}}},"typespec":{"name":"O-Defender","level":6,"model":8,"code":608,"specs":{"shield":{"capacity":[400,550],"reload":[10,13]},"generator":{"capacity":[70,100],"reload":[25,40]},"ship":{"mass":500,"speed":[70,80],"rotation":[30,40],"acceleration":[60,80]}},"shape":[4.409,4.448,4.372,4.204,4.119,4.136,4.174,4.107,4.066,4.094,4.073,4.141,4.16,4.062,4.015,3.966,3.83,3.76,3.742,3.591,3.502,3.494,3.575,4.291,4.422,4.409,4.422,4.291,3.575,3.494,3.502,3.591,3.742,3.76,3.83,3.966,4.015,4.062,4.16,4.141,4.073,4.094,4.066,4.107,4.174,4.136,4.119,4.204,4.372,4.448],"lasers":[{"x":0,"y":-3.96,"z":0,"angle":0,"damage":[35,60],"rate":2,"type":2,"speed":[130,180],"number":1,"spread":0,"error":0,"recoil":0}],"radius":4.448}}'
        },
        609: { name: "Speedster Legacy", code: '{"name":"Speedster Legacy","level":6,"model":9,"size":1.5,"specs":{"shield":{"capacity":[200,300],"reload":[6,8]},"generator":{"capacity":[80,140],"reload":[30,45]},"ship":{"mass":175,"speed":[90,115],"rotation":[60,80],"acceleration":[90,140]}},"bodies":{"main":{"section_segments":8,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0],"y":[-100,-95,0,0,70,65],"z":[0,0,0,0,0,0]},"width":[0,10,40,20,20,0],"height":[0,5,30,30,15,0],"texture":[6,11,5,63,12],"propeller":true,"laser":{"damage":[38,84],"rate":1,"type":2,"speed":[175,230],"recoil":50,"number":1,"error":0}},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-60,"z":15},"position":{"x":[0,0,0,0,0,0,0],"y":[-20,0,20,40,50],"z":[-7,-5,0,0,0]},"width":[0,15,15,10,0],"height":[0,10,15,12,0],"texture":[4]},"side_propulsors":{"section_segments":10,"offset":{"x":50,"y":25,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-20,-15,0,10,20,25,30,40,80,70],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,15,20,20,20,15,15,20,10,0],"height":[0,15,20,20,20,15,15,20,10,0],"propeller":true,"texture":[4,4,2,2,5,63,5,4,12]},"cannons":{"section_segments":12,"offset":{"x":30,"y":40,"z":45},"position":{"x":[0,0,0,0,0,0,0],"y":[-50,-45,-20,0,20,30,40],"z":[0,0,0,0,0,0,0]},"width":[0,5,7,10,3,5,0],"height":[0,5,7,8,3,5,0],"angle":-10,"laser":{"damage":[8,12],"rate":2,"type":1,"speed":[100,130],"number":1,"angle":-10,"error":0},"propeller":false,"texture":[6,4,10,4,63,4]}},"wings":{"join":{"offset":{"x":0,"y":0,"z":10},"length":[40,0],"width":[10,20],"angle":[-1],"position":[0,30],"texture":[63],"bump":{"position":0,"size":25}},"winglets":{"offset":{"x":0,"y":-40,"z":10},"doubleside":true,"length":[45,10],"width":[5,20,30],"angle":[50,-10],"position":[90,80,50],"texture":[4],"bump":{"position":10,"size":30}}},"typespec":{"name":"A-Speedster","level":6,"model":5,"code":605,"specs":{"shield":{"capacity":[200,300],"reload":[6,8]},"generator":{"capacity":[80,140],"reload":[30,45]},"ship":{"mass":175,"speed":[90,115],"rotation":[60,80],"acceleration":[90,140]}},"shape":[3,2.914,2.408,1.952,1.675,1.49,1.349,1.263,1.198,1.163,1.146,1.254,1.286,1.689,2.06,2.227,2.362,2.472,2.832,3.082,3.436,3.621,3.481,2.48,2.138,2.104,2.138,2.48,3.481,3.621,3.436,3.082,2.832,2.472,2.362,2.227,2.06,1.689,1.286,1.254,1.146,1.163,1.198,1.263,1.349,1.49,1.675,1.952,2.408,2.914],"lasers":[{"x":0,"y":-3,"z":0,"angle":0,"damage":[38,84],"rate":1,"type":2,"speed":[175,230],"number":1,"spread":0,"error":0,"recoil":50},{"x":1.16,"y":-0.277,"z":1.35,"angle":-10,"damage":[8,12],"rate":2,"type":1,"speed":[100,130],"number":1,"spread":-10,"error":0,"recoil":0},{"x":-1.16,"y":-0.277,"z":1.35,"angle":10,"damage":[8,12],"rate":2,"type":1,"speed":[100,130],"number":1,"spread":-10,"error":0,"recoil":0}],"radius":3.621}}' },
        701: { name: "Odyssey", code: `` },
        702: { name: "Shadow X-3", code: `` },
        703: { name: "Bastion", code: `` },
        704: { name: "Aries", code: `` },
    }
}

const SHIP_SELECTION = {
    "vanilla": {
        "tier7": [
            [701, "Odyssey"],
            [702, "Shadow X3"],
            [703, "Bastion"],
            [704, "Aries"]
        ],
        "tier6": [
            [601, "Advanced Fighter"],
            [602, "Scorpion"],
            [603, "Marauder"],
            [604, "Condor"],
            [605, "A-Speedster"],
            [606, "Rock Tower"],
            [607, "O-Defender"],
            [608, "Barracuda"]
        ],
        "tier5": [
            [501, "U-Sniper"],
            [502, "Fury-Star"],
            [503, "T-Warrior"],
            [504, "Aetos"],
            [505, "Shadow X2"],
            [506, "Howler"],
            [507, "Toscain"],
            [508, "Bat-Defender"],
        ],
        "tier4": [
            [401, "Vanguard"],
            [402, "Mercury"],
            [403, "X-Warrior"],
            [404, "Interceptor"],
            [405, "Pioneer"],
            [406, "Crusader"],
        ],
        "tier3": [
            [301, "Pulse Fighter"],
            [302, "Side Fighter"],
            [303, "Shadow X1"],
            [304, "Y-Defender"],
        ],
        "tier2": [
            [201, "Delta Fighter"],
            [202, "Trident"],
        ],
        "tier1": [
            [101, "Fly"]
        ]
    }
}

const VOCABULARY = [
    // 1
    { text: "You", icon: "\u004e", key: "O" },
    { text: "Me", icon: "\u004f", key: "E" },
    { text: "Wait", icon: "\u0048", key: "T" },
    { text: "Yes", icon: "\u004c", key: "Y" },
    // 2
    { text: "No", icon: "\u004d", key: "N" },
    { text: "Hello", icon: "\u0045", key: "H" },
    { text: "Sorry", icon: "\u00a1", key: "S" },
    { text: "My ship", icon: "\u0061", key: "M" },
    // 3
    { text: "Attack", icon: "\u0049", key: "A" },
    { text: "Follow Me", icon: "\u0050", key: "F" },
    { text: "Good Game", icon: "\u00a3", key: "G" },
    { text: "Leave", icon: "\u00b3", key: "L" },
    // 4
    { text: "Stats", icon: "\u0078", key: "K" },
    { text: "Hmm", icon: "\u004b", key: "Q" },
    { text: "Lucky", icon: "\u2618", key: "U" },
    { text: "Ping", icon: "\u231b", key: "P" },
    // 5
    { text: "Discord", icon: "\u007b", key: "D" },
    { text: "Idiot", icon: "\u0079", key: "I" },
    { text: "Lag", icon: "\u0069", key: "J" },
    { text: "Spectate", icon: "\u0059", key: "W" },
    // Infinity
    { text: "Love", icon: "❤️", key: "B" },
]

const VERSION = "1.21-Julia"

this.options = {
    ships: Object.values(SHIPS["vanilla"]).flatMap(a => a.code),
    map_name: "",
    max_players: staticMemory.MAX_PLAYER_COUNT,
    starting_ship: 801,
    map_size: 100,
    speed_mod: 1.2,
    max_level: 1,
    weapons_store: false,
    vocabulary: VOCABULARY,
    soundtrack: "warp_drive.mp3",
    custom_map: "",
    map_name: "Flintlock Dueling LV",
};

if (typeof window.onerror !== "function" && staticMemory._GLOBAL_ERROR_HANDLER) {
    window.onerror = function(message, source, lineno, colno, error) {
        statusMessage("warn", "GLOBAL ERROR HANDLER:")
        statusMessage("warn", error);
        statusMessage("warn", message);
        statusMessage("warn", `col: ${colno}, line: ${lineno}`);
    };
}


let SWEAR_WORD_LIST = [];

// ! S1
const statusMessage = (status, message) => {
    try {
        let str = ""
        switch (status) {
            case "err":
            case "error":
                str = str + "[[b;#FF0000;]｢ERROR｣ "
                break
            case "suc":
            case "success":
                str = str + "[[b;#00FF00;]｢SUCCESS｣ "
                break
            case "warn":
                str = str + "[[b;#FFFF00;]｢WARN｣ "
                break
            default:
                str = str + "[[b;#007bff;]｢INFO｣ "
                break
        }
        game.modding.terminal.echo(" ");
        game.modding.terminal.echo(str + "[[;#FFFFFF;]" + message);
        game.modding.terminal.echo(" ");
    } catch (ex) {
        console.warn(ex)
    }
}

const hideAllUI = (ship, hide = true) => {
    const hideableElements = ["spectate", "regen", "teleport", "showShipTree", "asLegacy"];
    if (hide) {
        ship.isUIExpanded = false;
        ship.globalChatExpanded = false;
        for (let id of[...hideableElements, ...staticMemory.retractableComponentIDs]) {
            ship.setUIComponent({ id, ...NULL_COMPONENT })
        }
    } else {
        renderSpectateRegen(ship);
    }
}

// ! ONLY RUNS ONCE
const renderSpectateRegen = (ship) => {
    if (ship.type == "605" || ship.type == "609") {
        selectedSpeedsterProcedure(ship, true);
    }

    ship.setUIComponent({
        id: "hide_all_ui",
        position: [25, 1, 10, 3],
        clickable: true,
        shortcut: "6",
        visible: true,
        components: [
            { type: "text", position: [0, 0, 100, 100], align: "left", value: "[6] - Hide all UI", color: "hsla(0, 0%, 100%, 1.00)" },
        ]
    })

    ship.setUIComponent({
        id: "spectate",
        position: [64, 1, 3.5, 5.5],
        clickable: true,
        shortcut: "1",
        visible: true,
        components: [
            { type: "box", position: [0, 38, 100, 60], fill: "hsla(180, 40%, 75%, 0.25)" },
            { type: "text", position: [0, 38, 100, 60], align: "center", value: "1", color: "hsla(180, 40%, 75%, 1)" },
            { type: "box", position: [0, 0, 100, 33.5], fill: "hsla(180, 40%, 75%, 1)" },
            { type: "text", position: [0, 1, 100, 31.5], align: "center", value: "𝗦𝗣𝗘𝗖𝗧", color: "hsla(0, 0%, 0%, 1.00)" },
        ]
    })


    ship.setUIComponent({
        id: "regen",
        position: [68, 1, 3.5, 5.5],
        clickable: true,
        shortcut: "2",
        visible: true,
        components: [
            { type: "box", position: [0, 38, 100, 60], fill: "hsla(3, 100%, 69%, 0.25)" },
            { type: "text", position: [0, 38, 100, 60], align: "center", value: "2", color: "hsla(3, 100%, 69%, 1.00)" },
            { type: "box", position: [0, 0, 100, 33.5], fill: "hsla(3, 100%, 69%, 1.00)" },
            { type: "text", position: [0, 1, 100, 31.5], align: "center", value: "𝗥𝗘𝗚𝗘𝗡", color: "hsla(0, 0%, 0%, 1.00)" },
        ]
    })

    ship.setUIComponent({
        id: "teleport",
        position: [72, 1, 3.5, 5.5],
        clickable: true,
        shortcut: "3",
        visible: true,
        components: [
            { type: "box", position: [0, 38, 100, 60], fill: "hsla(57, 100%, 81%, 0.25)" },
            { type: "text", position: [0, 38, 100, 60], align: "center", value: "3", color: "hsla(57, 100%, 81%, 1.00)" },
            { type: "box", position: [0, 0, 100, 33.5], fill: "hsla(57, 100%, 81%, 1.00)" },
            { type: "text", position: [0, 1, 100, 31.5], align: "center", value: "𝗧𝗣", color: "hsla(0, 0%, 0%, 1.00)" },
        ]
    })


    ship.setUIComponent(showShipTreeComponent());
}

const showShipTreeComponent = (replace = {}) => {
    return {
        id: "showShipTree",
        position: [76, 1, 3.5, 5.5],
        clickable: true,
        shortcut: "4",
        visible: true,
        components: [
            { type: "box", position: [0, 38, 100, 60], fill: "hsla(345, 95%, 71%, 0.25)" },
            { type: "text", position: [0, 38, 100, 60], align: "center", value: "4", color: "hsla(345, 95%, 71%, 1.00)" },
            { type: "box", position: [0, 0, 100, 33.5], fill: "hsla(345, 95%, 71%, 1.00)" },
            { type: "text", position: [0, 1, 100, 31.5], align: "center", value: "𝗦𝗛𝗜𝗣𝗦", color: "hsla(0, 0%, 0%, 1.00)" },
        ],
        ...replace
    }
}

const turnToSpectator = (ship) => {
    ship.spectating = {
        value: true,
        lastShip: String(ship.type) === "191" ? ship.spectating.lastShip : String(ship.type)
    }
    ship.set({ type: 191, collider: false, crystals: 0 });
}


const deselectedSpeedsterProcedure = (ship) => {
    ship.setUIComponent({
        id: "asLegacy",
        ...NULL_COMPONENT
    })
}

const selectedSpeedsterProcedure = (ship, skipSet = false) => {
    //ship.custom.speedsterType = "new";

    let astRef = ship.custom.speedsterType;
    let font = astRef === "new" ? "𝗡𝗘𝗪" : "𝗟𝗘𝗚𝗔𝗖𝗬";
    let stype = astRef === "new" ? "605" : "609";

    ship.setUIComponent({
        id: "asLegacy",
        position: [60, 1, 3.5, 5.5],
        clickable: true,
        shortcut: "5",
        visible: true,
        components: [
            { type: "box", position: [0, 38, 100, 60], fill: "hsla(333, 100%, 50%, 0.25)" },
            { type: "text", position: [0, 38, 100, 60], align: "center", value: "5", color: "hsla(333, 100%, 50%, 1)" },
            { type: "box", position: [0, 0, 100, 33.5], fill: "hsla(333, 100%, 50%, 1)" },
            { type: "text", position: [0, 1, 100, 31.5], align: "center", value: font, color: "hsla(0, 0%, 0%, 1.00)" },
        ]
    })

    if (!skipSet) {
        ship.set({ type: Number(stype), stats: 66666666, crystals: 720, shield: 99999, collider: true });
    }
}

const clickLegacyButton = (ship) => {
    if (ship.spectating.value) return;

    ship.custom.speedsterType = ship.custom.speedsterType === "new" ? "legacy" : "new";

    let astRef = ship.custom.speedsterType;
    let font = astRef === "new" ? "𝗡𝗘𝗪" : "𝗟𝗘𝗚𝗔𝗖𝗬";
    let stype = astRef === "new" ? "605" : "609";


    ship.setUIComponent({
        id: "asLegacy",
        position: [60, 1, 3.5, 5.5],
        clickable: true,
        shortcut: "5",
        visible: true,
        components: [
            { type: "box", position: [0, 38, 100, 60], fill: "hsla(333, 100%, 50%, 0.25)" },
            { type: "text", position: [0, 38, 100, 60], align: "center", value: "5", color: "hsla(333, 100%, 50%, 1)" },
            { type: "box", position: [0, 0, 100, 33.5], fill: "hsla(333, 100%, 50%, 1)" },
            { type: "text", position: [0, 1, 100, 31.5], align: "center", value: font, color: "hsla(0, 0%, 0%, 1.00)" },
        ]
    });

    ship.set({ type: Number(stype), stats: 66666666, crystals: 720, shield: 99999, collider: true });
}


const ECHO_SPAN = 105;

const NULL_COMPONENT = {
    position: [0, 0, 0, 0],
    visible: false,
    shortcut: null,
    components: []
};

const shipByID = (id) => game.ships.find(obj => obj.id == id);

const newLine = () => game.modding.terminal.echo(" ");
const debugEcho = (msg) => game.modding.terminal.echo(JSON.stringify(msg));
const centeredEcho = (msg, color = "") => game.modding.terminal.echo(`${" ".repeat(~~((ECHO_SPAN / 2) - Array.from(msg).length / 2))}${color}${msg}`)
const anchoredEcho = (msgLeft, msgRight, color = "", anchor) => game.modding.terminal.echo(color + `${" ".repeat(~~((ECHO_SPAN / 2) - (anchor.length / 2)) - Array.from(msgLeft).length)}${msgLeft}${anchor}${msgRight}`, " ")
const commandEcho = (command, description, example, color) => game.modding.terminal.echo(color + command + `[[;#FFFFFF30;]${" ".repeat(~~(((ECHO_SPAN / 2) - command.length) - (description.length / 2)))}` + color + description + `[[;#FFFFFF30;]${" ".repeat(Math.ceil(((ECHO_SPAN / 2) - example.length) - (description.length / 2)))}` + color + example)

;
(function initializeAdminPanel() {
    const saveSettings = () => {
        localStorage.setItem('adminPanelSettings', JSON.stringify(settings));
    };

    const checkElements = () => {
        const monitoringElement = document.getElementById('monitoring');
        const canvasElement = document.getElementById('fieldview');
        const insideOf = document.querySelector("#insiderunpanel");
        const code = document.querySelector(".insideeditorpanel");

        if (!insideOf || !monitoringElement || !canvasElement || !code) {
            statusMessage("error", 'Не найдены необходимые элементы для инициализации панели администратора.');
            return false;
        }
        return { canvasElement, code };
    };

    const updateAdminPanel = (canvasElement) => {
        const canvasHeight = canvasElement.offsetHeight;
        const canvasWidth = canvasElement.offsetWidth;
        const panel = document.getElementById('FL_ADMIN_PANEL');

        if (panel) {
            panel.style.display = (canvasWidth === 0 || canvasHeight === 0) ? "none" : "block";
        }
    };

    const injectStyles = (canvasWidth, canvasHeight) => {
        if (!document.getElementById('admin-panel-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'admin-panel-styles';
            styleElement.textContent = atob(`CiAgICAgICAgICAgICAgICAjRkxfQURNSU5fUEFORUwgewogICAgICAgICAgICAgICAgICAgIHotaW5kZXg6IDY7CiAgICAgICAgICAgICAgICAgICAgZm9udC1mYW1pbHk6ICdSb2JvdG8gTW9ubyc7CiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlOwogICAgICAgICAgICAgICAgICAgIGJvdHRvbTogMDsKICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwOwogICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxMDAlOwogICAgICAgICAgICAgICAgICAgIGhlaWdodDogMTAwJTsKICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAjNjYwMDAwOwogICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IDQwcHg7CiAgICAgICAgICAgICAgICAgICAgY29sb3I6IHdoaXRlOwogICAgICAgICAgICAgICAgICAgIG92ZXJmbG93LXk6IGF1dG87CiAgICAgICAgICAgICAgICAgICAgYm94LXNoYWRvdzogMCAwIDE1cHggcmdiYSgwLDAsMCwwLjUpOwogICAgICAgICAgICAgICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7CiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogd2lkdGggMC4zcywgaGVpZ2h0IDAuM3M7CiAgICAgICAgICAgICAgICB9CgogICAgICAgICAgICAgICAgI0ZMX0FETUlOX1BBTkVMIGgyIHsKICAgICAgICAgICAgICAgICAgICBjb2xvcjogI2ZmNjY2NjsKICAgICAgICAgICAgICAgIH0KCiAgICAgICAgICAgICAgICAjRkxfQURNSU5fUEFORUwgbGFiZWwgewogICAgICAgICAgICAgICAgICAgIGNvbG9yOiAjZmY5OTk5OwogICAgICAgICAgICAgICAgfQoKICAgICAgICAgICAgICAgICNGTF9BRE1JTl9QQU5FTCBpbnB1dCB7CiAgICAgICAgICAgICAgICAgICAgZm9udC1mYW1pbHk6ICdSb2JvdG8gTW9ubyc7CiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogNXB4OwogICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxMDAlOwogICAgICAgICAgICAgICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7CiAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAycHggc29saWQgI2ZmNGQ0ZDsKICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzMwMDAwOwogICAgICAgICAgICAgICAgICAgIGNvbG9yOiAjZmY5OTk5OwogICAgICAgICAgICAgICAgfQoKICAgICAgICAgICAgICAgICNGTF9BRE1JTl9QQU5FTCBidXR0b24gewogICAgICAgICAgICAgICAgICAgIGZvbnQtZmFtaWx5OiAnUm9ib3RvIE1vbm8nOwogICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IDVweDsKICAgICAgICAgICAgICAgICAgICBib3JkZXI6IG5vbmU7CiAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyOwogICAgICAgICAgICAgICAgICAgIGNvbG9yOiB3aGl0ZTsKICAgICAgICAgICAgICAgIH0KCiAgICAgICAgICAgICAgICAjRkxfQURNSU5fUEFORUwgYnV0dG9uLnNob3cgewogICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZjMzMzM7CiAgICAgICAgICAgICAgICB9CgogICAgICAgICAgICAgICAgI0ZMX0FETUlOX1BBTkVMIGJ1dHRvbi5raWNrIHsKICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmYxYTFhOwogICAgICAgICAgICAgICAgfQoKICAgICAgICAgICAgICAgICNGTF9BRE1JTl9QQU5FTCBidXR0b24uYmFuIHsKICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTYwMDAwOwogICAgICAgICAgICAgICAgfQoKICAgICAgICAgICAgICAgICNGTF9BRE1JTl9QQU5FTCBidXR0b24uYmFubmVkLWxpc3QgewogICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNjYzAwMDA7CiAgICAgICAgICAgICAgICB9CgogICAgICAgICAgICAgICAgI0ZMX0FETUlOX1BBTkVMIGJ1dHRvbi51bmJhbiB7CiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2IzMDAwMDsKICAgICAgICAgICAgICAgIH0KCiAgICAgICAgICAgICAgICAjRkxfQURNSU5fUEFORUwgPiAjdG9wX3JpZ2h0IHsKICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAxMHB4OwogICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsKICAgICAgICAgICAgICAgICAgICB0b3A6IDA7CiAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IDA7CiAgICAgICAgICAgICAgICB9CgogICAgICAgICAgICAgICAgI0ZMX0FETUlOX1BBTkVMID4gI3RvcF9yaWdodCBidXR0b24udG9wX3JpZ2h0X2J1dHRvbiB7CiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmMDAwMDsKICAgICAgICAgICAgICAgIH0KCiAgICAgICAgICAgICAgICAjRkxfQURNSU5fUEFORUwgPiAjdmVyc2lvbiB7CiAgICAgICAgICAgICAgICAgICAgZm9udC1zaXplOiAxMnB4OwogICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAwOwogICAgICAgICAgICAgICAgICAgIGJvdHRvbTogMDsKICAgICAgICAgICAgICAgICAgICBtYXJnaW46IDEwcHg7CiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlOwogICAgICAgICAgICAgICAgfQoKICAgICAgICAgICAgICAgICNGTF9BRE1JTl9QQU5FTCAjc2V0dGluZ3MtYnV0dG9uIHsKICAgICAgICAgICAgICAgICAgICBtYXJnaW46IDEwcHg7CiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlOwogICAgICAgICAgICAgICAgICAgIHRvcDogMDsKICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwOwogICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZjAwMDA7CiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogNXB4OwogICAgICAgICAgICAgICAgICAgIGJvcmRlcjogbm9uZTsKICAgICAgICAgICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7CiAgICAgICAgICAgICAgICAgICAgY29sb3I6IHdoaXRlOwogICAgICAgICAgICAgICAgfQoKICAgICAgICAgICAgICAgICNGTF9BRE1JTl9QQU5FTCAjc2V0dGluZ3MtY29udGFpbmVyIHsKICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBibG9jazsKICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgICAgICAgICAgICAgICAgICAgdG9wOiAtMjAwcHg7CiAgICAgICAgICAgICAgICAgICAgbGVmdDogMDsKICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjNjYwMDAwOwogICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IDIwcHg7CiAgICAgICAgICAgICAgICAgICAgY29sb3I6IHdoaXRlOwogICAgICAgICAgICAgICAgICAgIG92ZXJmbG93LXk6IGF1dG87CiAgICAgICAgICAgICAgICAgICAgYm94LXNoYWRvdzogMCAwIDE1cHggcmdiYSgwLDAsMCwwLjUpOwogICAgICAgICAgICAgICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7CiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogdG9wIDAuM3M7CiAgICAgICAgICAgICAgICB9CgogICAgICAgICAgICAgICAgI0ZMX0FETUlOX1BBTkVMICNzZXR0aW5ncy1jb250YWluZXIuc2hvdyB7CiAgICAgICAgICAgICAgICAgICAgdG9wOiAwOwogICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAjRkxfQURNSU5fUEFORUwgI3NldHRpbmdzLWNvbnRhaW5lciAjc2V0dGluZyB7CiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogZmxleDsKICAgICAgICAgICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyOwogICAgICAgICAgICAgICAgfQoKICAgICAgICAgICAgICAgICNGTF9BRE1JTl9QQU5FTCAudG9nZ2xlLXN3aXRjaCB7CiAgICAgICAgICAgICAgICAgICAgbWFyZ2luLWxlZnQ6IDEwcHg7CiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlOwogICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jazsKICAgICAgICAgICAgICAgICAgICB3aWR0aDogNjBweDsKICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDM0cHg7CiAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAycHggc29saWQgI2ZmNGQ0ZDsKICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzMwMDAwOwogICAgICAgICAgICAgICAgfQoKICAgICAgICAgICAgICAgICNGTF9BRE1JTl9QQU5FTCAudG9nZ2xlLXN3aXRjaCBpbnB1dCB7CiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMDsKICAgICAgICAgICAgICAgICAgICB3aWR0aDogMDsKICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDA7CiAgICAgICAgICAgICAgICB9CgogICAgICAgICAgICAgICAgI0ZMX0FETUlOX1BBTkVMIC5zbGlkZXIgewogICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsKICAgICAgICAgICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7CiAgICAgICAgICAgICAgICAgICAgdG9wOiAwOwogICAgICAgICAgICAgICAgICAgIGxlZnQ6IDA7CiAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IDA7CiAgICAgICAgICAgICAgICAgICAgYm90dG9tOiAwOwogICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICM2NjAwMDA7CiAgICAgICAgICAgICAgICAgICAgLXdlYmtpdC10cmFuc2l0aW9uOiAuNHM7CiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogLjRzOwogICAgICAgICAgICAgICAgfQoKICAgICAgICAgICAgICAgICNGTF9BRE1JTl9QQU5FTCAuc2xpZGVyOmJlZm9yZSB7CiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlOwogICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICIiOwogICAgICAgICAgICAgICAgICAgIGhlaWdodDogMjZweDsKICAgICAgICAgICAgICAgICAgICB3aWR0aDogMjZweDsKICAgICAgICAgICAgICAgICAgICBsZWZ0OiA0cHg7CiAgICAgICAgICAgICAgICAgICAgYm90dG9tOiA0cHg7CiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmOTk5OTsKICAgICAgICAgICAgICAgICAgICAtd2Via2l0LXRyYW5zaXRpb246IC40czsKICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAuNHM7CiAgICAgICAgICAgICAgICB9CgogICAgICAgICAgICAgICAgI0ZMX0FETUlOX1BBTkVMIGlucHV0OmNoZWNrZWQgKyAuc2xpZGVyIHsKICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmYzMzMzOwogICAgICAgICAgICAgICAgfQoKICAgICAgICAgICAgICAgICNGTF9BRE1JTl9QQU5FTCBpbnB1dDpmb2N1cyArIC5zbGlkZXIgewogICAgICAgICAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgMCAxcHggI2ZmMzMzMzsKICAgICAgICAgICAgICAgIH0KCiAgICAgICAgICAgICAgICAjRkxfQURNSU5fUEFORUwgaW5wdXQ6Y2hlY2tlZCArIC5zbGlkZXI6YmVmb3JlIHsKICAgICAgICAgICAgICAgICAgICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWCgyNnB4KTsKICAgICAgICAgICAgICAgICAgICAtbXMtdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDI2cHgpOwogICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgyNnB4KTsKICAgICAgICAgICAgICAgIH0KCiAgICAgICAgICAgICAgICAjRkxfQURNSU5fUEFORUwgI3NhdmUtc2V0dGluZ3MgewogICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZjMzMzM7CiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogNXB4OwogICAgICAgICAgICAgICAgICAgIGJvcmRlcjogbm9uZTsKICAgICAgICAgICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7CiAgICAgICAgICAgICAgICAgICAgY29sb3I6IHdoaXRlOwogICAgICAgICAgICAgICAgfQoKICAgICAgICAgICAgICAgICNGTF9BRE1JTl9QQU5FTCAjY2xvc2Utc2V0dGluZ3MgewogICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZjFhMWE7CiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogNXB4OwogICAgICAgICAgICAgICAgICAgIGJvcmRlcjogbm9uZTsKICAgICAgICAgICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7CiAgICAgICAgICAgICAgICAgICAgY29sb3I6IHdoaXRlOwogICAgICAgICAgICAgICAgfQogICAgICAgICAgICA=`);
            document.head.appendChild(styleElement);
        }
    };

    const initAdminPanel = (code) => {
        if (!document.getElementById('FL_ADMIN_PANEL')) {
            code.insertAdjacentHTML('beforeend', atob(`CiAgICAgICAgICAgICAgICA8ZGl2IGlkPSJGTF9BRE1JTl9QQU5FTCI+CiAgICAgICAgICAgICAgICAgICAgPGgyPkFkbWluIFBhbmVsPC9oMj4KICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPSJkaXNwbGF5OiBmbGV4OyBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyBnYXA6IDhweDsiPgogICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPSJzaG93IiBvbmNsaWNrPSJzaG93SURzKCkiPlNob3cgUGxheWVyIExpc3Q8L2J1dHRvbj4KICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj0icGxheWVySUQiPlBsYXllciBJRDo8L2xhYmVsPgogICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT0idGV4dCIgaWQ9InBsYXllcklEIiBwbGFjZWhvbGRlcj0iRW50ZXIgUGxheWVyIElEIj4KICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz0ia2ljayIgb25jbGljaz0ia2ljayhkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxheWVySUQnKS52YWx1ZSkiPktpY2sgUGxheWVyPC9idXR0b24+CiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9ImJhbiIgb25jbGljaz0iYmFuKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbGF5ZXJJRCcpLnZhbHVlKSI+QmFuIFBsYXllcjwvYnV0dG9uPgogICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPSJiYW5uZWQtbGlzdCIgb25jbGljaz0iYmFubmVkTGlzdCgpIj5TaG93IEJhbm5lZCBMaXN0PC9idXR0b24+CiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9InVuYmFuIiBvbmNsaWNrPSJ1bmJhbihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxheWVySUQnKS52YWx1ZSkiPlVuYmFuIFBsYXllcjwvYnV0dG9uPgogICAgICAgICAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9InRvcF9yaWdodCI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9InRvcF9yaWdodF9idXR0b24iIG9uY2xpY2s9ImxpbmsoKSI+TGluazwvYnV0dG9uPgogICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPSJ0b3BfcmlnaHRfYnV0dG9uIiBvbmNsaWNrPSJQdWJsaXNoVG9TZXJ2ZXJMaXN0KCkiPlB1Ymxpc2g8L2J1dHRvbj4KICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz0idG9wX3JpZ2h0X2J1dHRvbiIgb25jbGljaz0iZ2FtZS5tb2RkaW5nLmNvbW1hbmRzLnN0b3AoKSI+U3RvcDwvYnV0dG9uPgogICAgICAgICAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgICAgICAgICAgIDxzcGFuIGlkPSJ2ZXJzaW9uIj5WZXJzaW9uOiA=`) + VERSION + atob(`PC9zcGFuPgogICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9InNldHRpbmdzLWJ1dHRvbiI+U2V0dGluZ3M8L2J1dHRvbj4KICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPSJzZXR0aW5ncy1jb250YWluZXIiPgogICAgICAgICAgICAgICAgICAgICAgICA8aDI+U2V0dGluZ3M8L2gyPgogICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPSJzZXR0aW5nIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9InB1Ymxpc2hUb1NlcnZlckxpc3QiPlB1Ymxpc2ggdG8gU2VydmVyIExpc3Q6PC9sYWJlbD4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9InRvZ2dsZS1zd2l0Y2giPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPSJjaGVja2JveCIgaWQ9InB1Ymxpc2hUb1NlcnZlckxpc3QiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz0ic2xpZGVyIiBmb3I9InB1Ymxpc2hUb1NlcnZlckxpc3QiPjwvbGFiZWw+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9InNhdmUtc2V0dGluZ3MiPlNhdmU8L2J1dHRvbj4KICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD0iY2xvc2Utc2V0dGluZ3MiPkNsb3NlPC9idXR0b24+CiAgICAgICAgICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICAgICAgICA8L2Rpdj4=`));

            setTimeout(function() {
                const publishToServerListInput = document.getElementById('publishToServerList');
                publishToServerListInput.checked = settings.PUBLISH_TO_SERVERLIST;
            }, 500);
        }

        document.getElementById('settings-button').addEventListener('click', () => {
            const settingsContainer = document.getElementById('settings-container');
            settingsContainer.classList.add('show');
        });

        document.getElementById('save-settings').addEventListener('click', () => {
            settings.PUBLISH_TO_SERVERLIST = document.getElementById('publishToServerList').checked;
            saveSettings();
            const settingsContainer = document.getElementById('settings-container');
            settingsContainer.classList.remove('show');
        });

        document.getElementById('close-settings').addEventListener('click', () => {
            const settingsContainer = document.getElementById('settings-container');
            settingsContainer.classList.remove('show');
        });

        document.getElementById('publishToServerList').addEventListener('change', (e) => {
            settings.PUBLISH_TO_SERVERLIST = e.target.checked;
            saveSettings();
        });
    };

    const runAdminPanel = () => {
        const elements = checkElements();
        if (!elements) return;

        injectStyles(elements.canvasElement.offsetWidth, elements.canvasElement.offsetHeight);
        initAdminPanel(elements.code);
        updateAdminPanel(elements.canvasElement);
    };

    setInterval(runAdminPanel, 1000);
    window.addEventListener('resize', () => setTimeout(runAdminPanel, 100));
})();

;
(function setCenterObject() {
    game.setObject({
        id: "centerImage",
        type: {
            id: "centerImage",
            obj: "https://starblast.data.neuronality.com/mods/objects/plane.obj",
            emissive: "https://raw.githubusercontent.com/halcyonXT/project-storage/main/LATEST.png"
        },
        position: { x: -1, y: 0, z: -15 },
        scale: { x: 95, y: 52, z: 5 },
        rotation: { x: 3, y: 0, z: 0 }
    });
})();

;
(function setBlackBackground() {
    if (staticMemory._ultraDarkMode) {
        game.setObject({
            id: "blackBackground",
            type: {
                id: "blackBackground",
                obj: "https://starblast.data.neuronality.com/mods/objects/plane.obj",
                emissive: "https://raw.githubusercontent.com/halcyonXT/project-storage/main/bcgr.png"
            },
            position: { x: -1, y: -10, z: -20 },
            scale: { x: 9999, y: 9999, z: 0 },
            rotation: { x: 0, y: 0, z: 0 }
        });
    }
})();

// mute = (ID) => {
//     let id = Number(ID);
//     if (!ID || isNaN(id)) {
//         return statusMessage("error", "Must provide valid ship ID");
//     }

//     let ship = shipByID(id);

//     if (!ship) {
//         return statusMessage("error", "No ship with the ID of " + id);
//     }

//     for (let emote of VOCABULARY) {
//         ship.setUIComponent({id: randomString(6), position: [0,0,0,0], clickable: true, visible: false, shortcut: emote.key});
//     }

//     statusMessage("success", "Player with the ID of " + id + " (" + ship.name + ") has been muted");
//     fleetingMessage(ship, "You have been muted");
// }

setAFKChecker = (value) => {
    let m = !!value;
    if (m) {
        statusMessage(
            "success",
            "AFK checker is now active"
        )
    } else {
        statusMessage(
            "error",
            "AFK checker is no longer active"
        )
    }
    staticMemory.afkChecker.active = m;
}

kick = (id, shouldReport = true) => {
    let ship = shipByID(id);
    if (!ship) {
        return statusMessage("error", "No ship with the specified ID")
    }
    if (shouldReport) {
        statusMessage("success", `${ship.name} has been kicked`);
    }
    kickPlayer(ship);
}

ban = (id) => {
    let ship = shipByID(id);
    if (!ship) {
        return statusMessage("error", "No ship with the specified ID")
    }
    sessionMemory.banned.push(ship.name);
    statusMessage("success", `${ship.name} has been banned`)
    kickPlayer(ship);
}

bannedList = () => {
    centeredEcho("Banned list:", "[[ub;#FF4f4f;]");
    anchoredEcho("Player name ", " Index", "[[b;#5FFFFF;]", "|")
    for (let player in sessionMemory.banned) {
        anchoredEcho(`${sessionMemory.banned[player]} `, ` ${player}`, "[[;#FFFFFF;]", "|")
    }
    for (let player in sessionMemory.bruteforceBanned) {
        anchoredEcho(`${sessionMemory.bruteforceBanned[player]} `, ` 99${player}`, "[[;#FF0000;]", "|")
    }
    echo("[[;#FFFFFF;]Index changes every time you unban someone. If you want to unban multiple people, it's recommended to run this function after every unban")
    newLine();
}

unban = (ind) => {
    let isBrute = false,
        sind = null;
    if (ind < 0 || ind >= sessionMemory.banned.length) {
        let bfind = Number((String(ind)).slice(2));
        if (!sessionMemory.bruteforceBanned[bfind]) {
            return statusMessage("error", "Invalid index provided. Do bannedList() to find out indexes.")
        }
        isBrute = true;
        sind = bfind;
    }
    if (isBrute) {
        statusMessage("success", `${sessionMemory.bruteforceBanned[sind]} is no longer bruteforce banned`);
        sessionMemory.bruteforceBanned = removeIndexFromArray(sessionMemory.bruteforceBanned, sind);
    } else {
        statusMessage("success", `${sessionMemory.banned[ind]} is no longer banned`);
        sessionMemory.banned = removeIndexFromArray(sessionMemory.banned, ind);
    }
}

bruteforceBan = (id) => {
    let ship = shipByID(id);
    if (!ship) {
        return statusMessage("error", "No ship with the specified ID")
    }
    sessionMemory.bruteforceBanned.push(ship.name);
    statusMessage("warn", `${ship.name} has been bruteforce banned. To revert this action, use the unban command`);
    let copy = {...ship };
    kickPlayer(ship);
    for (let sh of game.ships) {
        let lsim = levenshteinSimilarity(copy.name, sh.name);
        if (lsim >= staticMemory.bruteforceBan_minimumSimilarity) {
            statusMessage("warn", `${sh.name} has been kicked: Levenshtein similarity ${lsim} - Maximum ${staticMemory.bruteforceBan_minimumSimilarity}`);
            kickPlayer(sh);
        }
    }
}

resetMinBruteforceSim = (num) => {
    if (!num || typeof num !== "number" || num < 10 || num > 100) {
        return statusMessage("error", "Invalid input. Must be a number from 10 to 100");
    }
    staticMemory.bruteforceBan_minimumSimilarity = num;
    statusMessage("success", "Bruteforce ban will now require " + num + "% similarity to kick");
}

help = () => {
    newLine();
    centeredEcho("Command list:", "[[ub;#FF4f4f;]");
    commandEcho("Command", "Description", "Example usage", "[[b;#5FFFFF;]")
    centeredEcho("General", "[[u;#808080;]");
    commandEcho("help()", "Prints the list of commands", "help()", "[[;#FFFFFF;]")
    commandEcho("chelp(command)", "Extended description for a specific command", "chelp(adminList)", "[[;#FFFFFF;]");
    commandEcho("showIDs()", "Prints a list with the IDs and names of all players", "showIDs()", "[[;#FFFFFF;]")
    commandEcho("showShipIDs()", "Prints a list with the IDs and names of all ships", "showShipIDs()", "[[;#FFFFFF;]");
    commandEcho("bannedList()", "Shows a list of banned player names and INDEXES", "bannedList()", "[[;#FFFFFF;]");
    newLine();
    centeredEcho("Administrative", "[[u;#808080;]");
    commandEcho("adminList()", "Prints the list of admins", "adminList()", "[[;#FFFFFF;]");
    commandEcho("forceSpec(id)", "Forces player with the specified ID to spectate", "forceSpec(4)", "[[;#FFFFFF;]");
    commandEcho("giveAdmin(id)", "Gives player with the specified ID admin privileges", "giveAdmin(4)", "[[;#FFFFFF;]");
    commandEcho("removeAdmin(id)", "Removes admin privileges from player with specified ID", "removeAdmin(4)", "[[;#FFFFFF;]");
    commandEcho("requireShip(shipID)", "Makes the selected ship mandatory for all players", "requireShip(605)", "[[;#FFFFFF;]");
    commandEcho("unrequireShip()", "Removes the required ship", "requireShip()", "[[;#FFFFFF;]");
    commandEcho("ban(id)", "Bans player with the specified ID", "ban(4)", "[[;#FFFFFF;]");
    commandEcho("unban(index)", "Unbans player with the specified INDEX", "unban(0)", "[[;#FFFFFF;]");
    commandEcho("kick(id)", "Kicks player with the specified ID", "kick(4)", "[[;#FFFFFF;]");
    commandEcho("setAFKChecker(bool)", "Set whether afk checker is active or not", "setAFKChecker(false)", "[[;#FFFFFF;]");
    commandEcho("setTickThrottle(ticks)", "Per-player impact on tick job delay", "setTickThrottle(20)", "[[;#FFFFFF;]");
    commandEcho("resetRateLimit(ticks)", "Determine how often a player can click a button", "resetRateLimit(20)", "[[;#FFFFFF;]");
    newLine();
    centeredEcho("Dangerous administrative", "[[gu;#CC0000;]");
    commandEcho("bruteforceBan(id)", "Recommended to do chelp(bruteforceBan) before using", "bruteforceBan(4)", "[[;#FFFFFF;]");
    commandEcho("resetMinBruteforceSim(num)", "Reset minimal similarity for bruteforce kick", "resetMinBruteforceSim(50)", "[[;#FFFFFF;]");
    newLine();
}

resetRateLimit = (ticks) => {
    if (typeof ticks !== "number") {
        return statusMessage("error", "Invalid argument. Must be a number");
    }
    staticMemory._CLICK_RATE_LIMIT = ticks;
    if (ticks === 0) {
        statusMessage(
            "success",
            `Players are no longer rate limited`
        )
    } else {
        statusMessage(
            "success",
            `Players will now only be able to click a button once every ${ticks} ticks, or once every ${(ticks / 60).toFixed(1)} seconds`
        )
    }
}

setTickThrottle = (ticks) => {
    if (typeof ticks !== "number") {
        return statusMessage("error", "Invalid argument. Must be a number");
    }
    let newticks = Math.max(1, Math.round(ticks));
    statusMessage(
        "success",
        "Tick throttle has been set to " + newticks
    )
    staticMemory.TICK_THROTTLE_PER_PLAYER = newticks;
    recalculateTickDelay();
}

chelp = (funct) => {
    if (typeof funct !== "function") {
        return statusMessage("error", "Invalid argument. " + String(funct) + " is not a command.")
    }
    newLine()
    switch (funct.name) {
        case "setAFKChecker":
            commandEcho("setAFKChecker(bool)", "Set whether afk checker is active or not", "setAFKChecker(false)", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] Takes an argument that is either a truthy or a falsy value.");
            echo("[[;#FFFFFF;] Setting to true might have an impact on performance");
            break
        case "forceSpec":
            commandEcho("forceSpec(id)", "Forces player with the specified ID to spectate", "forceSpec(4)", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] Player with the specified id will be turned into a spectator");
            echo("[[;#FFFFFF;] They won't be able to unspectate until you use forceSpec on them again, which will undo the action.");
            echo("[[;#FFFFFF;] To get the list of IDs for the `id` parameter, use showIDs()");
            break
        case "setTickThrottle":
            commandEcho("setTickThrottle(ticks)", "Per-player impact on tick job delay", "setTickThrottle(20)", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] In FL dueling light, tick loop jobs have a delay in order to save up on performance");
            echo("[[;#FFFFFF;] That delay is defined as (PLAYER_COUNT * TICK_THROTTLE)");
            echo("[[;#FFFFFF;] Default tick throttle is 1, but using this command you can change it to any number you want to");
            echo("[[;#FFFFFF;] Any number you input will round to the nearest integer");
            break
        case "resetRateLimit":
            commandEcho("resetRateLimit(ticks)", "Determine how often a player can click a button", "resetRateLimit(20)", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] The `ticks` argument will determine how long the player has to wait until they click a button again.");
            echo("[[;#FFFFFF;] For example, if set to 60, a player will only be able to click a button once per second");
            echo("[[;#FFFFFF;] This will help if trolls try to lag the mod by spamming expensive operations.");
            echo("[[;#FFFFFF;] Default is 15");
            break
        case "kick":
            commandEcho("kick(id)", "Kicks player with the specified ID", "kick(4)", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] Kicks the player with the specified ID.");
            echo("[[;#FFFFFF;] The player will be able to rejoin with the same name afterwards.");
            break
        case "bruteforceBan":
            commandEcho("bruteforceBan(id)", "Recommended to do chelp(bruteforceBan) before using", "bruteforceBan(4)", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] Recursively kicks every player and newcomer with a name similar to that of the player with the specified ID");
            echo("[[;#FFFFFF;] Similarity is calculated using the Levenshtein distance similarity algorithm. More on Levenshtein distance:");
            echo("[[ib!;#FFFFFF;] https://en.wikipedia.org/wiki/Levenshtein_distance");
            newLine();
            echo("[[;#FFFFFF;] minimumSimilarity - Minimal similarity of names required to kick a player - Default is 75%");
            echo("[[;#FFFFFF;] To reset minimumSimilarity, use resetMinBruteforceSim(num)");
            newLine();
            echo("[[;#FFFFFF;] Example of bruteforceBan functionality:");
            echo("[[;#FFFFFF;] Assume there are players 'HALO', 'ICEMAN1' and 'ICEMAN2' on a server");
            echo("[[;#FFFFFF;] Running bruteforceBan(2) on 'ICEMAN1' will give the following result:");
            echo("[[;#FFFFFF;]       - 'ICEMAN1' is kicked");
            echo("[[;#FFFFFF;]       - 'ICEMAN2' is kicked because they have a name similarity of 85.7%");
            echo("[[;#FFFFFF;]       - If someone named 'ICEMAN33' joins, the will be kicked because they have a similarity of 75%");
            newLine();
            echo("[[;#FFFFFF;] bruteforceBan can have unwanted effects, take this example:");
            echo("[[;#FFFFFF;] Assume the minimum similarity is 66%");
            echo("[[;#FFFFFF;] There is a player named 'ICEMAN' who likes to troll and multitab, and a good friend of yours named 'CINEMA'");
            echo("[[;#FFFFFF;] Assume the player list is 'HALO', 'ICEMAN1', 'ICEMAN2', 'ICEMAN33' and 'CINEMA'");
            echo("[[;#FFFFFF;] Running bruteforceBan(2) on 'ICEMAN1' will give the following result:");
            echo("[[;#FFFFFF;]       - 'ICEMAN1' is kicked");
            echo("[[;#FFFFFF;]       - 'ICEMAN2' is kicked");
            echo("[[;#FFFFFF;]       - 'ICEMAN33' is kicked");
            echo("[[;#FFFFFF;]       - Your good friend 'CINEMA' is kicked as well because they have a similarity above 66%");
            echo("[[;#FFFFFF;]       - Your good friend 'NICEMAN' joins the server, but is kicked due to having a similarity above 66%");
            newLine();
            echo("[[;#FFFFFF;] Think carefully before running this command");
            break
        case "ban":
            commandEcho("ban(id)", "Bans player with the specified ID", "ban(4)", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] Using the ID parameter gotten from showIDs(), bans the player with the specified ID.");
            echo(`[[;#FFFFFF;] For example, if you banned a player with the name of 'HALO', this is how it would go:`);
            echo("[[;#FFFFFF;]       - Kicks the player");
            echo("[[;#FFFFFF;]       - Every time someone named 'HALO' joins, they are immediately kicked");
            newLine();
            echo("[[;#FFFFFF;] Banning in starblast modding is not very effective, as they can just rejoin with a name like 'HALO1' to not be kicked");
            echo("[[;#FFFFFF;] Banning in starblast modding is not very effective, as they can just rejoin with a name like 'HALO1' to not be kicked");
            break
        case "adminList":
            commandEcho("adminList()", "Prints the list of admins", "adminList()", "[[;#FFFFFF;]");
            newLine()
            echo("[[;#FFFFFF;] Prints a list of players given admin permissions using the giveAdmin(id) command.");
            echo("[[;#FFFFFF;] All shown players are able to kick and ban other players.");
            echo("[[;#FFFFFF;] To remove admin permissions from any of these players, use removeAdmin(id).");
            break
        case "chelp":
            commandEcho("chelp(command)", "Extended description for a specific command", "chelp(adminList)", "[[;#FFFFFF;]");
            newLine()
            echo("[[;#FFFFFF;] Gives more information on the specified command than help() does.");
            break
        case "giveAdmin":
            commandEcho("giveAdmin(id)", "Gives player with the specified ID admin privileges", "giveAdmin(4)", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] Gives player with the specified ID administrator permissions.");
            echo("[[;#FFFFFF;] To ensure you've given the right player admin permissions, it will print a message saying their name.");
            newLine();
            echo("[[;#FFFFFF;] The newly added admin will have the following permissions:");
            echo("[[;#FFFFFF;]       - Kick");
            echo("[[;#FFFFFF;]       - Ban");
            newLine();
            echo("[[;#FFFFFF;] Note: Only the mod starter has the ability to perform a bruteforce ban.");
            break
        case "help":
            commandEcho("help()", "Prints the list of commands", "help()", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] Provides the list and an elementary description of all current commands.");
            echo("[[;#FFFFFF;] It's recommended to use chelp() if you're confused about a command.");
            break
        case "removeAdmin":
            commandEcho("removeAdmin(id)", "Removes admin privileges from player with specified ID", "removeAdmin(4)", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] Removes administrator permissions from a player with the specified ID.");
            echo("[[;#FFFFFF;] To ensure you've removen the right admin, it will pring a message saying their name.");
            newLine();
            echo("[[;#FFFFFF;] The removed admin will lose the following permissions:");
            echo("[[;#FFFFFF;]       - Kick");
            echo("[[;#FFFFFF;]       - Ban");
            break
        case "requireShip":
            commandEcho("requireShip(shipID)", "Makes the selected ship mandatory for all players", "requireShip(605)", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] Makes the specified ship a mandatory ship.");
            echo("[[;#FFFFFF;] If an incorrect ship has been provided, it will remain unset.");
            newLine();
            echo("[[;#FFFFFF;] After correctly running the command:");
            echo("[[;#FFFFFF;] All currently active players will turn into the specified ship.");
            echo("[[;#FFFFFF;] All spectators will turn into the specified ship upon unspectating.");
            echo("[[;#FFFFFF;] 'Select ship' modal will cease to give players the permission to change their ship");
            newLine();
            echo("[[;#FFFFFF;] To find out the ID of a certain ship, type showShipIDs()");
            echo("[[;#FFFFFF;] To counteract the requireShip command, type unrequireShip()");
            break
        case "showIDs":
            commandEcho("showIDs()", "Prints a list with the IDs and names of all players", "showIDs()", "[[;#FFFFFF;]")
            newLine();
            echo("[[;#FFFFFF;] Prints a list of players' names with their respective identification (ID) unique numbers.");
            echo("[[;#FFFFFF;] Player IDs are used in the following commands:");
            echo("[[;#FFFFFF;]       - giveAdmin(id)");
            echo("[[;#FFFFFF;]       - removeAdmin(id)");
            break
        case "showShipIDs":
            commandEcho("showShipIDs()", "Prints a list with the IDs and names of all ships", "showShipIDs()", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] Prints a list of ship names with their respective identification (ID) unique numbers.");
            echo("[[;#FFFFFF;] Ship IDs are used in the following commands:");
            echo("[[;#FFFFFF;]       - requireShip(shipID)");
            break
        case "unrequireShip":
            commandEcho("unrequireShip()", "Removes the required ship", "requireShip()", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] Directly counteracts requireShip - Removes the mandatory ship specified using the requireShip command.");
            echo("[[;#FFFFFF;] If there is no mandatory ship, it will remain unset.");
            newLine();
            echo("[[;#FFFFFF;] After correctly running the command:");
            echo("[[;#FFFFFF;] 'Select ship' modal will give players the permission to change their ship");
            break
        default:
            return statusMessage("if", "Unknown command or extended description hasn't been added yet")
    }
    newLine()
}

showShipIDs = () => {
    centeredEcho("Ship list:", "[[ub;#FF4f4f;]");
    anchoredEcho("Ship name ", " Ship ID", "[[b;#5FFFFF;]", "|")
    for (let key of Object.keys(SHIPS["vanilla"])) {
        anchoredEcho(`${SHIPS["vanilla"][key].name} `, ` ${key}`, "[[;#FFFFFF;]", "|")
    }
    newLine();
}

adminList = () => {
    newLine();
    centeredEcho("Admin list:", "[[ub;#FF4f4f;]");
    anchoredEcho("Player name ", " Player ID", "[[b;#5FFFFF;]", "|")
    for (let ship of sessionMemory.admins) {
        anchoredEcho(`${game.ships[fetchShip(ship)].name} `, ` ${ship}`, "[[;#FFFFFF;]", "|")
    }
    newLine();
}

requireShip = (id) => {
    let pID = Number(id);
    if (!SHIPS["vanilla"][pID]) {
        return statusMessage("error", "No ship with the ID of " + pID)
    }
    if (staticMemory.requireShip === pID) {
        return statusMessage("if", `"${SHIPS["vanilla"][pID].name}" is already the required ship`)
    }
    try {
        staticMemory.requireShip = pID;
        for (let ship of game.ships) {
            if (ship.spectating.value) {
                ship.spectating.lastShip = pID;
            } else {
                let type = String(pID);
                let level = type.charAt(0);
                ship.set({ type: Number(type), stats: Number(level.repeat(8)), crystals: staticMemory.GEM_CAPS[(Number(type) / 100) >> 0], collider: true, shield: 99999 });
            }
        }
        statusMessage("success", `"${SHIPS["vanilla"][pID].name}" is now the required ship`)
    } catch (ex) {
        statusMessage("error", "requireShip(...) error - More in console");
        console.warn(ex);
    }
}

unrequireShip = () => {
    if (!staticMemory.requireShip) {
        statusMessage("if", `There is already no required ship`)
    } else {
        statusMessage("success", `"${SHIPS["vanilla"][staticMemory.requireShip].name}" is no longer the required ship`)
    }
    staticMemory.requireShip = null;
}

showIDs = function() {
    newLine();
    centeredEcho("Player list:", "[[ub;#FF4f4f;]");
    anchoredEcho("Player name ", " Player ID", "[[b;#5FFFFF;]", "|")
    for (let ship of game.ships) {
        anchoredEcho(`${ship.name} `, ` ${ship.id}`, "[[;#FFFFFF;]", "|")
    }
    newLine();
}

forceSpec = (id) => {
    let ind = fetchShip(id);
    if (ind === -1) {
        return statusMessage("error", `No ship with the id of "${id}"`);
    }
    let ref = game.ships[ind];
    if (ref.custom.forcedToSpectate) {
        game.ships[ind].custom.forcedToSpectate = false;
        fleetingMessage(game.ships[ind], "You are no longer forced to spectate");
        statusMessage(
            "success",
            `Ship with the id of "${id}" (${ref.name}) is no longer forced to spectate`
        )
    } else {
        turnToSpectator(game.ships[ind]);
        fleetingMessage(game.ships[ind], "You have been forced to spectate");
        game.ships[ind].custom.forcedToSpectate = true;
        statusMessage(
            "success",
            `Ship with the id of "${id}" (${ref.name}) has been forced to spectate`
        )
    }
}

giveAdmin = (id) => {
    for (let ship of game.ships) {
        if (ship.id === id) {
            if (!(sessionMemory.admins.includes(id))) {
                sessionMemory.admins.push(id)
                game.ships[fetchShip(id)].isUIExpanded && renderExpandedMenu(game.ships[fetchShip(id)], "admin")
                return statusMessage("success", `Player with the id of ${id} (${game.ships[fetchShip(id)].name}) has been granted admin privileges`)
            } else {
                return statusMessage("if", `Player is already admin. Do removeAdmin(${id}) to remove`)
            }
        }
    }
    return statusMessage("error", `Player with the id of ${id} doesn't exist`)
}

removeAdmin = (id) => {
    for (let admin of sessionMemory.admins) {
        if (admin === id) {
            sessionMemory.admins = removeFromArray(sessionMemory.admins, id)
            let target = game.ships[fetchShip(id)]
            target.isUIExpanded && renderExpandedMenu(target, determineType(target))
            closeDashboard(target, game)
            return statusMessage("success", `Player with the id of ${id} (${target.name}) no longer has admin privileges`)
        }
    }
    return statusMessage("error", `There is no admin with the id of ${id}`)
}

const determineType = (ship) => sessionMemory.admins.includes(ship.id) ? "admin" : "regular";

const teleportToNext = (ship, game, __CALL_NUM = 0) => {
    turnToSpectator(ship);
    let tp = ship.lastTeleported;
    if (!tp && typeof tp !== "number") {
        tp = 0;
    } else {
        tp += 1;
        if (tp >= game.ships.length) {
            tp = 0;
        }
    }
    ship.lastTeleported = tp;
    if (game.ships[tp].id === ship.id) {
        if (__CALL_NUM < 1) {
            return teleportToNext(ship, game, __CALL_NUM + 1);
        } else {
            return fleetingMessage(ship, "Nobody to teleport to");
        }
    }
    let ref = game.ships[tp];
    ship.set({ x: ref.x, y: ref.y });
}

let _scoreboard_defaults = {
    components: [
        { type: "box", position: [0, 0, 100, 8], fill: "hsla(0, 100%, 50%, 0.25)" },
        { type: "box", position: [62, 0, 7, 8], fill: "hsla(0, 100%, 50%, 1)" },
        { type: "box", position: [70, 0, 7, 8], fill: "hsla(0, 100%, 50%, 1)" },
        { type: "box", position: [78, 0, 22, 8], fill: "hsla(0, 100%, 50%, 1)" },
        { type: "text", position: [2, 1, 98, 6], value: "𝗣𝗹𝗮𝘆𝗲𝗿𝘀", color: "hsla(0, 100%, 50%, 1)", align: "left" },
        { type: "text", position: [62, 0, 7, 8], value: "𝗞", color: "hsla(0, 0%, 0%, 1.00)", align: "center" },
        { type: "text", position: [70, 0, 7, 8], value: "𝗗", color: "hsla(0, 0%, 0%, 1.00)", align: "center" },
        { type: "text", position: [78, 0.5, 22, 7], value: "𝗘𝗟𝗢", color: "hsla(0, 0%, 0%, 1.00)", align: "center" },
    ]
}

const updateScoreboard = () => {
    let sortedPlayers = [...game.ships].sort((a, b) => b.elo - a.elo);

    let playerComponents = sortedPlayers.map((item, index) => {
        let Y_OFFSET = (index + 1) * 9;
        return [
            { type: "box", position: [0, Y_OFFSET, 100, 8], fill: "hsla(0, 100%, 50%, 0.065)" },
            { type: "box", position: [62, Y_OFFSET, 7, 8], fill: "hsla(0, 100%, 50%, 0.1)" },
            { type: "box", position: [70, Y_OFFSET, 7, 8], fill: "hsla(0, 100%, 50%, 0.1)" },
            { type: "box", position: [78, Y_OFFSET, 22, 8], fill: "hsla(0, 100%, 50%, 0.1)" },
            { type: "player", position: [2, Y_OFFSET + 1, 55, 6], id: item.id, color: "hsla(0, 0%, 100%, 1)", align: "left" },
            { type: "text", position: [62, Y_OFFSET, 7, 8], value: item.kd.kills, color: "hsla(0, 0%, 100%, 1)", align: "center" },
            { type: "text", position: [70, Y_OFFSET, 7, 8], value: item.kd.deaths, color: "hsla(0, 0%, 100%, 1)", align: "center" },
            { type: "text", position: [78, Y_OFFSET + 1, 22, 6], value: item.elo, color: "hsla(0, 0%, 100%, 1)", align: "center" },
        ]
    });

    let outp = playerComponents.flat();

    game.setUIComponent({
        id: "scoreboard",
        clickable: false,
        visible: true,
        components: [
            ..._scoreboard_defaults.components,
            ...outp
        ]
    });
}

const handleEloCalculation = (killer, victim) => {
    const KILLER_TIER = (killer.type / 100) >> 0,
        VICTIM_TIER = (victim.type / 100) >> 0;
    victim.custom.goto = { x: victim.x, y: victim.y };

    const calculateKD = (kills, deaths) => {
        let outp = kills / deaths;
        if (outp === Infinity) {
            return kills;
        }
        return Number(outp.toFixed(1));
    }

    if (KILLER_TIER <= VICTIM_TIER) {
        victimNewElo = updateSubjectElo(victim.elo, killer.elo, false);
        killer.elo = updateSubjectElo(killer.elo, victim.elo, true);
        victim.elo = victimNewElo;
    }

    killer.kd = {
        value: calculateKD(killer.kd.kills + 1, killer.kd.deaths),
        kills: killer.kd.kills + 1,
        deaths: killer.kd.deaths
    }

    victim.kd = {
        value: calculateKD(victim.kd.kills, victim.kd.deaths + 1),
        kills: victim.kd.kills,
        deaths: victim.kd.deaths + 1
    }

    updateScoreboard();
}

const customEvent = (eventName) => {
    switch (eventName) {
        case "ship_left":
            recalculateTickDelay();
            updateScoreboard();
            break
    }
}

this.event = function(event, game) {
    switch (event.name) {
        case "ship_destroyed":
            handleEloCalculation(event.killer, event.ship);
            break
        case "ship_spawned":
            if (event.ship != null) {
                if (sessionMemory.banned.includes(event.ship.name)) {
                    kickPlayer(event.ship)
                }
                if (!event.ship.custom.hasOwnProperty("registered") && event.ship.name) {
                    for (let comp of sessionMemory.bruteforceBanned) {
                        let lsim = levenshteinSimilarity(comp, event.ship.name);
                        if (lsim >= staticMemory.bruteforceBan_minimumSimilarity) {
                            statusMessage("warn", `${event.ship.name} has been kicked: Levenshtein similarity ${lsim} - Maximum ${staticMemory.bruteforceBan_minimumSimilarity}`);
                            setTimeout(() => {
                                kickPlayer(event.ship);
                            }, 50);
                        }
                    }
                }


                let type = staticMemory.requireShip ? String(staticMemory.requireShip) : String(event.ship.type);
                let level = String((type - (type % 100)) / 100);

                let statsFill = {};

                if (!event.ship.custom.hasOwnProperty("registered")) {
                    event.ship.elo = 0;
                    event.ship.kd = {
                        value: 0,
                        kills: 0,
                        deaths: 0
                    }
                    event.ship.custom.goto = { x: 0, y: 0 };
                    event.ship.custom.forcedToSpectate = false;
                    event.ship.custom.uiHidden = false;
                    event.ship.custom._shipSelectOpen = false;
                    event.ship.custom._ttlTimer = null;
                    event.ship.custom.speedsterType = "new";

                    event.ship.set({
                        type: Number(type),
                        stats: Number(level.repeat(8)),
                        shield: 9999,
                        crystals: staticMemory.GEM_CAPS[(Number(type) / 100) >> 0],
                        collider: true
                    })
                    if (_ALLOW_LEGACY_TURN) {
                        selectedSpeedsterProcedure(event.ship);
                    }
                    updateScoreboard();
                    recalculateTickDelay();
                    statusMessage("info", `${event.ship.name} joined. ID: ${event.ship.id}`);
                } else {
                    statsFill = { stats: Number(level.repeat(8)), crystals: staticMemory.GEM_CAPS[(Number(type) / 100) >> 0] };
                }
                event.ship.custom.registered = true;
                event.ship.lastTeleported = null;
                event.ship._nextButtonClick = 0;
                event.ship.afk = {
                        time: 0,
                        lastPos: {
                            x: 0,
                            y: 0
                        }
                    },
                    event.ship.spectating = {
                        value: false,
                        lastShip: null
                    };

                event.ship.set({
                    x: event.ship.custom.goto.x,
                    y: event.ship.custom.goto.y,
                    ...statsFill
                })

                if (!(sessionMemory.rememberedIDs.includes(event.ship.id))) {
                    sessionMemory.rememberedIDs.push(event.ship.id)
                }
                renderSpectateRegen(event.ship);
            }
            break;
        case "ui_component_clicked":
            var component = event.id;

            if (game.step < event.ship._nextButtonClick) {
                return fleetingMessage(event.ship, "You are being rate limited")
            }

            const DELAY_BUTTON_CLICK = staticMemory._CLICK_RATE_LIMIT; // * in ticks
            event.ship._nextButtonClick = game.step + DELAY_BUTTON_CLICK;

            switch (component) {
                case "asLegacy":
                    clickLegacyButton(event.ship);
                    break;

                case "hide_all_ui":
                    hideAllUI(event.ship, !event.ship.custom.uiHidden);
                    event.ship.custom.uiHidden = !event.ship.custom.uiHidden;
                    break;

                case "showShipTree":
                    return SHIP_TREE_PANEL.renderShipTree(event.ship);

                case "closeShipTree":
                    return SHIP_TREE_PANEL.closeShipTree(event.ship);

                case "spectate":
                    if (event.ship.custom.forcedToSpectate) {
                        return fleetingMessage(event.ship, "You have been forced to spectate");
                    }
                    if (event.ship.spectating.value) {
                        let type = event.ship.spectating.lastShip;
                        let level = type.charAt(0);
                        event.ship.set({ type: Number(type), stats: Number(level.repeat(8)), crystals: staticMemory.GEM_CAPS[(Number(type) / 100) >> 0], collider: false, shield: 99999, vx: 0, vy: 0 });

                        setTimeout(() => {
                            if (event.ship.type !== 191) {
                                event.ship.set({ collider: true });
                            }
                        }, 1000)

                        event.ship.spectating.value = false;
                    } else {
                        turnToSpectator(event.ship);
                    }
                    break

                case "regen":
                    event.ship.set({ shield: 99999, crystals: staticMemory.GEM_CAPS[(event.ship.type / 100) >> 0] })
                    break

                case "teleport":
                    return teleportToNext(event.ship, game);


                default:
                    // Search every KEY and if component.startsWith(KEY) execute and return the function
                    // All prefix-based component must be formatted like {action}_{id}
                    //                      Make sure to include the underscore ^^^

                    // Sort these by frequency to boost performance
                    const extractArg = (comp) => comp.split("_")[1];

                    const prefixes = {
                        "selectShip": () => {
                            let type = component.split("_")[1];
                            let level = type.charAt(0);

                            // ! Guard clause if the player already had ship tree open when requireShip() was fired
                            if (staticMemory.requireShip && staticMemory.requireShip != Number(type)) {
                                return;
                            }

                            if (_ALLOW_LEGACY_TURN) {
                                if (type == "605") {
                                    return selectedSpeedsterProcedure(event.ship);
                                } else {
                                    deselectedSpeedsterProcedure(event.ship);
                                }
                            }

                            event.ship.set({ type: Number(type), stats: Number(level.repeat(8)), crystals: staticMemory.GEM_CAPS[(Number(type) / 100) >> 0], shield: 99999, collider: true })
                        },
                    }
                    for (let prefix of Object.keys(prefixes)) {
                        if (component.startsWith(prefix + "_")) {
                            return prefixes[prefix]();
                        }
                    }
                    return;
            }
            return;
    }
};

const kickPlayer = (ship) => ship.gameover({ "": "You have been kicked from participating", "Score": 0 });


const removeFromArray = (arr, target) => arr.filter(item => item !== target);
const removeIndexFromArray = (arr, index) => arr.filter((_, ind) => ind !== index);

const fetchChat = (id1, id2) => sessionMemory.chatChannels.findIndex(el => el.parties !== undefined && el.parties.includes(id1) && el.parties.includes(id2))
const fetchShip = (id) => game.ships.findIndex(el => el.id === id)



const FLEETING_TTL = 3000;


let fleetingTimer = null
const fleetingMessage = (ship, message) => {
    if (!ship.custom._ttlTimer) {
        clearTimeout(fleetingTimer);
        ship.setUIComponent({
                id: "fleeting",
                position: [0, 80, 78, 5],
                clickable: false,
                visible: true,
                components: [
                    { type: "text", position: [0, 0, 100, 100], color: "hsla(0, 100%, 65%, 1.00)", value: message, align: "right" }
                ]
            })
            //fleetingTimer = 
        ship.custom._ttlTimer = setTimeout(() => {
            ship.setUIComponent({
                id: "fleeting",
                ...NULL_COMPONENT
            })
            clearTimeout(ship.custom._ttlTimer);
            ship.custom._ttlTimer = null;
        }, FLEETING_TTL)
    }
}

const randomString = (len = 16) => {
    let outp = "";
    let alp = "abcdefghjiklmnopqrstuvwxyz1234576879";
    for (let i = 0; i < len; i++) {
        outp += alp.charAt(~~(Math.random() * alp.length));
    }
    return outp;
}


const SHIP_TREE_PANEL = {
    closingComponents: ["shipTree", "navbar_stp", "closeShipTree"],
    currentClosingComponents: [],

    closeShipTree: function(ship) {
        ship.custom._shipSelectOpen = false;
        for (let component of[...this.closingComponents, ...this.currentClosingComponents]) {
            ship.setUIComponent({ id: component, ...NULL_COMPONENT })
        }
        if (!ship.custom.uiHidden) {
            ship.setUIComponent(showShipTreeComponent({ shortcut: "4" }));
        }
    },

    renderShipTree: function(ship) {
        if (ship.spectating.value) {
            return fleetingMessage(ship, "You're spectating")
        }

        if (ship.custom._shipSelectOpen) {
            return;
        } else {
            ship.custom._shipSelectOpen = true;
        }

        if (!ship.custom.uiHidden) {
            ship.setUIComponent(showShipTreeComponent({ shortcut: null }));
        }

        const START_X = 20,
            WIDTH = 50;
        let selectedTree = "vanilla";

        ship.setUIComponent({
            id: "shipTree",
            position: [START_X, 20, 60, 60],
            clickable: false,
            visible: true,
            components: [
                { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 14%, 0.31)" },
                { type: "box", position: [0, 99.5, 100, 0.5], fill: "hsla(0, 0%, 100%, 0.31)" },
                { type: "box", position: [0, 0, 100, 0.5], fill: "hsla(0, 0%, 100%, 0.31)" }
            ]
        })
        ship.setUIComponent({
            id: "navbar_stp",
            position: [START_X, 17, 60, 3],
            clickable: false,
            visible: true,
            components: [
                { type: "text", position: [2, 0, 100, 100], color: "hsla(0, 0%, 100%, 1.00)", align: 'left', value: 'Ship selection' },
                { type: "box", position: [0, 0, 100, 5], fill: "hsla(0, 0%, 100%, 0.31)" },
                { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 100%, 0.13)" },
                { type: "box", position: [0, 98, 100, 2], fill: "hsla(0, 0%, 100%, 0.31)" },
            ]
        })
        ship.setUIComponent({
                id: "closeShipTree",
                position: [76, 17, 4, 3],
                clickable: true,
                shortcut: "4",
                visible: true,
                components: [
                    { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 100%, 50%, 0.31)" },
                    { type: "text", position: [0, 10, 100, 90], color: "hsla(0, 0%, 100%, 1.00)", value: "✖" }
                ]
            })
            // Ships space - [21, 21, 58, 58] - Total width and height: 58%
            // Width and height gap 2% - 8 elements of width 5.5% and height 6.2% for tier 6, less elements but same dimensions for other tiers
        this.currentClosingComponents = [];

        let keys = Object.keys(SHIP_SELECTION[selectedTree]);
        try {
            for (let i = 0, tier = keys[0]; i < keys.length; i++) {
                tier = keys[i];
                if (tier === 191 || tier === 192) continue;
                let selectedTier = SHIP_SELECTION[selectedTree][tier];
                for (let j = 0,
                        OFFSET_X = (21 + ((58 - (5.5 * selectedTier.length + (2 * (selectedTier.length - 1) - 1))) / 2)),
                        OFFSET_Y = i * 6.2 + i * 2; j < selectedTier.length; j++) {
                    ship.setUIComponent({
                        id: `selectShip_${selectedTier[j][0]}`,
                        position: [OFFSET_X + (j * 5.5 + (j * 2)), 21 + OFFSET_Y, 5.5, 6.2],
                        visible: true,
                        clickable: !staticMemory.requireShip ? true : tier === staticMemory.requireShip,
                        components: !staticMemory.requireShip ? [
                            { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 100%, 0.00)", stroke: "hsla(0, 0%, 100%, 0.56)", width: 2 },
                            { type: "box", position: [5, 8, 90, 84], fill: "hsla(0, 0%, 100%, 0.13)", stroke: "hsla(0, 0%, 100%, 0.38)", width: 2 },
                            { type: "text", position: [7, 10, 86, 80], color: "hsla(0, 0%, 100%, 1.00)", align: "center", value: selectedTier[j][1] }
                        ] : tier === staticMemory.requireShip ? [
                            { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 100%, 0.00)", stroke: "hsla(0, 0%, 100%, 0.56)", width: 2 },
                            { type: "box", position: [5, 8, 90, 84], fill: "hsla(0, 0%, 100%, 0.13)", stroke: "hsla(0, 0%, 100%, 0.38)", width: 2 },
                            { type: "text", position: [7, 10, 86, 80], color: "hsla(0, 0%, 100%, 1.00)", align: "center", value: selectedTier[j][1] }
                        ] : [
                            { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 100%, 0)", stroke: "hsla(0, 0%, 100%, 0.56)", width: 2 },
                            { type: "box", position: [5, 8, 90, 84], fill: "hsla(0, 0%, 100%, 0.13)", stroke: "hsla(0, 0%, 100%, 0.38)", width: 2 },
                            { type: "text", position: [7, 10, 86, 80], color: "hsla(0, 0%, 100%, 1.00)", align: "center", value: selectedTier[j][1] }
                        ],
                    })
                    this.currentClosingComponents.push(`selectShip_${selectedTier[j][0]}`)
                }
            }
        } catch (ex) {
            statusMessage("error", "Error rendering ships: " + ex)
        }
    }
}


let _lastNumOfShips = 0;
let _lastCalculatedTickDelay = staticMemory.TICK_THROTTLE_PER_PLAYER + 0;
const recalculateTickDelay = () => _lastCalculatedTickDelay = staticMemory.TICK_THROTTLE_PER_PLAYER * game.ships.length;

this.tick = (game) => {
    if (staticMemory.DISABLE_TICK_THROTTLE || (game.step % _lastCalculatedTickDelay === 0)) {
        if (game.ships.length < _lastNumOfShips) {
            asynchronize(
                () => customEvent("ship_left")
            )
        }
        _lastNumOfShips = game.ships.length;

        for (let j = 0, glen = game.ships.length; j < glen; j++) {
            let ship = game.ships[j];
            if (staticMemory.afkChecker.active) {
                let fixed = ship.x;
                ship.afk.time = (ship.afk.time + 1) * ((ship.type !== 191) & (fixed >= (ship.afk.lastPos - .2) && fixed <= (ship.afk.lastPos + .2)));
                ship.afk.lastPos = fixed;
                if (ship.afk.time > staticMemory.afkChecker.delay) {
                    fleetingMessage(ship, "You are AFK");
                    ship.spectating = {
                        value: true,
                        lastShip: String(ship.type)
                    }
                    ship.set({ type: 191, collider: false, crystals: 0 });
                }
            }

            if (staticMemory.alwaysPickUpGems) {
                let t = (ship.type / 100) >> 0;
                let k = 20 * t * t;
                if (ship.crystals === k) {
                    ship.set({ crystals: k - 1 })
                }
            }
        }
    }
}

// ! Below are helper functions
function expectedProbability(playerRating, opponentRating) {
    return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
}

const roundToDecimalPlace = (number, decimalPlaces) => Number(number.toFixed(decimalPlaces));

function updateSubjectElo(subject, opponent, didSubjectWin) {
    const { MAX_WIN_LOSS_THRESHOLD } = staticMemory;

    let kFactor = staticMemory.ELO_K_FACTOR;

    const expectedWinProbability = expectedProbability(subject, opponent);

    const actualOutcome = didSubjectWin ? 1 : 0;

    const newRating = subject + kFactor * (actualOutcome - expectedWinProbability);

    if (didSubjectWin) {
        if (newRating > (subject + MAX_WIN_LOSS_THRESHOLD)) {
            newRating = subject + MAX_WIN_LOSS_THRESHOLD;
        }
    } else {
        if (newRating < (subject - MAX_WIN_LOSS_THRESHOLD)) {
            newRating = subject - MAX_WIN_LOSS_THRESHOLD;
        }
    }

    return roundToDecimalPlace(newRating, 1);
}



function levenshteinSimilarity(str1, str2) {
    function levenshteinDistance(s1, s2) {
        const m = s1.length;
        const n = s2.length;

        const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

        for (let i = 0; i <= m; i++) {
            for (let j = 0; j <= n; j++) {
                if (i === 0) {
                    dp[i][j] = j;
                } else if (j === 0) {
                    dp[i][j] = i;
                } else {
                    dp[i][j] = Math.min(
                        dp[i - 1][j - 1] + (s1[i - 1] === s2[j - 1] ? 0 : 1),
                        dp[i][j - 1] + 1,
                        dp[i - 1][j] + 1
                    );
                }
            }
        }

        return dp[m][n];
    }

    const distance = levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    const similarity = ((maxLength - distance) / maxLength) * 100;

    return similarity;
}


function asynchronize(callback) {
    setTimeout(() => {
        try {
            callback();
        } catch (error) {
            statusMessage("error", `asynchronize(...) failure: Callback - ${callback.name}. More in console`)
            console.warn(error);
        }
    }, 0);
}

link = function() {
    if (game.custom.modeLaunched) {
        newLine();
        echo("[[b;#5FFFFF;]Link:");
        echo("https://starblast.io/#" + game.modding.address);
        newLine();
    } else {
        newLine();
        statusMessage("error", "The mod has not started yet!");
        newLine();
    }
}

say = function(text = "", duration = 4, color = "#FFFFFF") {
    game.ships.forEach(ship => {
        clearTimeout(ship.custom.gameAnnouncement);
        ship.setUIComponent({
            id: "announceText",
            position: [20, 80, 60, 25],
            clickable: false,
            visible: true,
            components: [
                { type: "text", position: [0, 0, 100, 20], color: color, value: text }
            ]
        });
        ship.custom.gameAnnouncement = setTimeout(() => {
            ship.setUIComponent({
                id: "announceText",
                visible: false
            });
        }, duration * 1000);
    });

    echo(`[[g;#70ffc1;]\nText: "${text}" sent, Color: ${color}`);
}

PublishToServerList = function(url) {
    if (!game.custom.publishedToServerList) {
        if (!game.modding.address) {
            statusMessage("error", "The mod has not started yet!");
            return;
        }
        url = "https://starblast.io/#" + game.modding.address;
        const apiUrl = "https://starblast.dankdmitron.dev/api/post";

        fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: url })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                centeredEcho("The server is published in the ServerList", "[[gb;#00FF00;]");
                newLine();
                game.custom.publishedToServerList = true;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    } else {
        centeredEcho("The server is already published in ServerList", "[[gb;#00FF00;]");
        newLine();
    }
}

function MapOpen() {
    if (!game.custom.modeLaunched) {
        setTimeout(() => {
            newLine();
            newLine();

            centeredEcho("welcome to", "[[b;#FFFFFF;]");
            centeredEcho(" ＦＬＩＮＴＬＯＣＫ ＤＵＥＬＩＮＧ            ", "[[gb;#FF0000;]");
            centeredEcho("a mod by nanoray", "[[;#FFFFFF30;]")
            newLine();
            centeredEcho("Contact:", "[[ub;#FF4f4f;]");
            centeredEcho("Discord - h.alcyon", "[[;#FFFFFF;]");
            help();
            newLine();
            echo("[[;#FFFF00;]If it seems like a part of the instructions is cut off, zoom out");
            echo("[[;#FFFF00;]NOTE: Giving yourself admin upon mod startup using giveAdmin() is highly recommended");
            newLine();

            game.custom.modeLaunched = true;

            link();

            const loadSettings = () => {
                const storedSettings = localStorage.getItem('adminPanelSettings');
                if (storedSettings) {
                    settings = JSON.parse(storedSettings);
                }
            };

            loadSettings();

            if (localStorage.getItem('adminPanelSettings')) {
                const settings = JSON.parse(localStorage.getItem('adminPanelSettings'));
                if (settings.PUBLISH_TO_SERVERLIST === true) {
                    PublishToServerList();
                }
            }
        }, 2500)
    } else {
        setTimeout(() => {
            centeredEcho("[[g;#ff2626;] ⚠️ Main code edited ⚠️ ]");
            centeredEcho("[[g;#ff2626;] Problems may arise in the future ]");
        }, 2000)
    }
}