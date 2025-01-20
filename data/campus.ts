
const campuses: {[campus: string]: { name: string, plan: { x: number, y: number, w: number, h: number } }[]} = {
    "神戸三ノ宮キャンパス": [
        {name: "大広間", plan: {x: 1, y: 0, w: 3, h: 2}},
        {name: "万里", plan: {x: 2, y: 2, w: 2, h: 1}},
        {name: "秘密基地", plan: {x: 0, y: 0, w: 1, h: 1}},
        {name: "7階", plan: {x: 0, y: 4, w: 4, h: 2}},
    ]
} as const

export default campuses
