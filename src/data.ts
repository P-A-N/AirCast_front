export type Co2data = {
    x:number
    y:number
}

export type Query = {
    localId:string
}

export type Props = {
    dataForVis:VisualDatas,
    width:number,
    height:number,
    yDomainFrom?:number,
    yDomainTo?:number
}

export type VisualDatas = {
    datas:Co2data[],
    min:number,
    max:number
} 