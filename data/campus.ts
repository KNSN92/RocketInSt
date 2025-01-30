
type CampusesData= {[campus: string]: {allMember: number, mainRoom: number, rooms: { name: string, capacity: number, plan: { x: number, y: number, w: number, h: number } }[]}};

const campuses: CampusesData = {
    "神戸三ノ宮キャンパス": {
        mainRoom: 0,
        allMember: 200,
        rooms: [
            {name: "大広間", capacity: 80, plan: {x: 1, y: 0, w: 3, h: 2}},
            {name: "万里", capacity: 30, plan: {x: 2, y: 2, w: 2, h: 1}},
            {name: "秘密基地", capacity: 20, plan: {x: 0, y: 0, w: 1, h: 1}},
            {name: "7階", capacity: 50, plan: {x: 5, y: 0, w: 2, h: 3}},
        ]
    }
} as const

export default campuses
