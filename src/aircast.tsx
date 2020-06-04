import React, { useState, useEffect } from 'react'
import { Co2data, Query, Props, VisualDatas } from './data'
import '../node_modules/react-vis/dist/style.css';
import { XAxis, YAxis, 
  VerticalGridLines, HorizontalGridLines, 
  XYPlot, LineSeries,MarkSeriesCanvas, Hint} from 'react-vis';
import './scss/main.scss'

function getTickXStr(date : Date)
{
  let dateStr = " "+String(date.getHours()) + ":";
  dateStr += (date.getMinutes() < 10 ? "0" : "") + String(date.getMinutes()) 
  return dateStr;
}

function getHintXStr(date : Date)
{
  const dayLabel = [" Sun"," Mon"," TUE"," WED"," THU"," FRI"," SAT"]
  let dateStr = String(date.getMonth()+1) + "/" + String(date.getDate()) + dayLabel[date.getDay()]; 
  dateStr += getTickXStr(date);
  return dateStr;
}

export const AirCast = (props : Props) => {
  const [index, setIndex] = useState(0);
  const [hintData, setHintData] = useState({x:0,y:0}) 
  const [hintElem, setHintElem] = useState({time:"", y:0})
  const dataForVis = props.dataForVis;
  const tickNumX = props.width / 85;
  const tickNumY = props.height / 150;

  useEffect(()=>{
    let tmStr = getHintXStr(new Date(hintData.x*1000))
    setHintElem({time:tmStr, y:hintData.y})
  },[hintData])
  
  if(hintData.y == 0 && dataForVis.datas.length > 0)
  {
    setHintData(dataForVis.datas[dataForVis.datas.length-1])
  }

  if(props.yDomainFrom !== undefined) dataForVis.min = props.yDomainFrom
  if(props.yDomainTo !== undefined ) dataForVis.max = props.yDomainTo
  return (
    <div className="App">
      <XYPlot height={props.height} width={props.width} 
          xType="time"
          yDomain={[dataForVis.min, dataForVis.max]}
          margin={{bottom: 50, left: 50, right: 10, top: 10}}>
        <XAxis tickTotal={tickNumX} tickFormat={(v)=>{
            return getTickXStr(new Date(v*1000))}} 
            tickLabelAngle={-30}
            title="time"/>
        <YAxis tickTotal={3} title="ppm"/>
        <VerticalGridLines tickTotal={tickNumX}/>
        <HorizontalGridLines tickTotal={tickNumY}/>
        <LineSeries data={dataForVis.datas} style={{strokeLinejoin: "round"}}
            onNearestXY={(value:Co2data) =>{
              if(value.x != hintData.x) setHintData(value) }}
            stroke={'black'}/>
        {hintData.y > 0 &&
        <MarkSeriesCanvas
            color={'#23daff'}
            stroke={'#ff18b3'}
            style={{pointerEvents: 'none'}}
            data={[hintData]}
            size={4}/>}
        {hintData.y > 0 &&
        <Hint value={hintData}>
          <div className="hint">
            <p><div className="date">{hintElem.time}</div>
            <div className="value">{hintData.y}&nbsp;ppm</div></p>
          </div>
        </Hint>
        }
      </XYPlot>
    </div>
  );
}