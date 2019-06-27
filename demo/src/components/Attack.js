import React from 'react';
import styled from 'styled-components';

const BlankToken = styled.span`
  background-color: transparent;
  color: white;
  padding: 1px;
  margin: 1px;
  display: inline-block;
  border-radius: 3px;
`;

const ColorizedToken = styled.span`
  background-color: ${props => props.backgroundColor};
  padding: 1px;
  margin: 1px;
  display: inline-block;
  border-radius: 3px;
`;

export function postprocessHotflip(org,data) {
  let result_string = []
  let result_string2 = []
  console.log(org)
  var obj = ''
  for (let idx=0; idx<org.length; idx++) {
    obj = org[idx]
    
    if (obj !== data[idx])
    {
      console.log(obj,data[idx])
      result_string.push(
        <ColorizedToken backgroundColor={"#FF5733"}
        key={idx}>{obj} </ColorizedToken>)
        result_string2.push(
          <ColorizedToken backgroundColor={"#26BD19"}
          key={idx}>{data[idx]} </ColorizedToken>)
    }
    else{
      result_string.push(
        <ColorizedToken backgroundColor={"transparent"}
        key={idx}>{obj} </ColorizedToken>)
        result_string2.push(
          <ColorizedToken backgroundColor={"transparent"}
          key={idx}>{data[idx]} </ColorizedToken>)
    }
    
  }
  
  return [result_string,result_string2]
}

export function postprocessInputReduction(org,data){
  let result_string = []
  let result_string2 = []  
  var idx = 0;
  var idx2 = 0;
  while (idx2<=data.length){    
    if (org[idx] == data[idx2]){
      result_string.push(
        <ColorizedToken backgroundColor={"transparent"}
        key={idx}>{org[idx]} </ColorizedToken>);
      result_string2.push(
        <ColorizedToken backgroundColor={"transparent"}
        key={idx}>{data[idx2]} </ColorizedToken>);      
      idx++;
      idx2++;
    }       
    else {
      while (idx<=org.length && org[idx] != data[idx2]){
        result_string.push(
          <ColorizedToken backgroundColor={"#FF5733"}
          key={idx}><strike>{org[idx]}</strike> </ColorizedToken>);

        result_string2.push(
          <BlankToken key={idx}>{org[idx]} </BlankToken>);
          idx++;            
      }
    }
  }
  
  return [result_string,result_string2]
}

export function postprocessAttack(attackData, attackData2){
  var attack_visual = '';
    var attack_visual2 = '';
    var attack_visual_og = '';
    var attack_visual2_og = '';  
    if (attackData === undefined) {
      attack_visual = " "
    }
    else{    
      var [first,second] = postprocessInputReduction(attackData["original"],attackData["final"][0])    
      attack_visual = second
      attack_visual_og = first
    }
    if (attackData2 === undefined) {
      attack_visual2 = " "
    }
    else{
      var [first,second] = postprocessHotflip(attackData2["original"],attackData2["final"][0])
      attack_visual2 = second
      attack_visual2_og = first        
    }  
    return [attack_visual, attack_visual_og, attack_visual2, attack_visual2_og]
}  