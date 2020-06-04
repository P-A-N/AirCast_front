import React from 'react'
import {AirCast} from './aircast'
import firebase, { firestore } from 'firebase'
import { Query, VisualDatas } from './data'
import { useCollectionData } from "react-firebase-hooks/firestore";
import {useParams} from 'react-router-dom'

var firebaseConfig = {
    apiKey: "AIzaSyDe3NXAy7YddQfnoZc-0L6YEBDI95dYijs",
    authDomain: "co2space-84757.firebaseapp.com",
    databaseURL: "https://co2space-84757.firebaseio.com",
    projectId: "co2space-84757",
    storageBucket: "co2space-84757.appspot.com",
    messagingSenderId: "702069795009",
    appId: "1:702069795009:web:fbb6d1005ba4371217cc40",
    measurementId: "G-BQFHN0XDM1"
  };
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const INITIAL_MIN:number = 10000
const INITIAL_MAX:number = 0

function sortData(unsorted : {}) : Array<number[]>
{
  type Co2DataWithTimeKey = {
    [k:string]:number
  }
  let arr = []
  if( unsorted !== undefined)
  {
    let today00 = new Date();
    today00.setHours(0);
    today00.setMinutes(0);
    today00.setSeconds(0);
    today00.setMilliseconds(0);
    let today00num = today00.getTime() / 1000;
    let dayInSec = 60 * 60 * 3;
    let nowInSec = new Date().getTime()/1000;  
    for( let key in unsorted )
    {
      let keyNo : number = +key.substr(1,key.length-1)
      if(keyNo > (nowInSec - dayInSec))
      {
        let val : number = (unsorted as Co2DataWithTimeKey)[key]
        arr.push([keyNo, val]);
      }
    }
    arr.sort((a, b) => a[0] - b[0]);
  }
  return arr;
}

function loadData(localId : string) : [VisualDatas, boolean, Error|undefined]
{
  let loadedData : VisualDatas = {"datas":[], "min":INITIAL_MIN, "max":INITIAL_MAX}
  type DataRecv = {
    [k:string]:any
  }
  let [values, loading, error] = useCollectionData<DataRecv>(
    firebase.firestore().collection(localId)
      .orderBy('documentId','desc').limit(2),
    { idField: "id" }
  );
  let sortedArr = new Array<number[]>()
  if(values !== undefined)
  {
    values.map((value)=>{
      let arr = sortData(value.datas)
      sortedArr = arr.concat(sortedArr)
    })
    //console.log(sortedArr)
    sortedArr.forEach((_data)=>{
      let yval = _data[1] as number;
      if( loadedData.max < yval ) loadedData.max = yval;
      if( loadedData.min > yval ) loadedData.min = yval;
      loadedData.datas.push({x:_data[0], y:yval})
    })
    //console.log(dataForVis)
  }
  return [loadedData,loading, error];
}


export const ContentsBody = () =>{
    const  query : Query  = useParams();
    const [dataForVis, loading, error] = loadData(query.localId);
    if (loading) {  
        return <div>Loading...</div>;
      }
      else if (error) {
        return <div>{`Error: ${error.message}`}</div>;
      }
      else
      {
        return (
            <div className="contentsBody">
                <AirCast dataForVis={dataForVis} width={600} height={200} 
                    yDomainFrom={350} yDomainTo={1800}/>
            </div>
        )
      }
}