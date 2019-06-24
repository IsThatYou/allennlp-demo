import React from 'react'
import colormap from 'colormap'
import styled from 'styled-components';
import { Tooltip } from './Shared';

// interface Props extends DefaultProps {
//   tokensWithWeights: {token: string, weight: number}[];
// }

// interface DefaultProps {
//   colormapProps: ColorMapProps
// }

// interface ColorMapProps {
//   colormap: ColorScheme;
//   format: ColorMapFormat; 
//   nshades: number;
// }

// type ColorMapFormat = "hex" | "rgbaString" | "rba" | "float";

// type ColorScheme = "jet" | "hsv" | "hot" | "cool" | "spring" |
//   "summer" | "autumn" | "winter" | "bone" | 
//   "copper" | "greys" | "YIGnBu" | "greens" |
//   "YIOrRd" | "bluered" | "RdBu" | "picnic" |
//   "rainbow" | "portland" | "blackbody" | "earth" |
//   "electric" | "viridis" | "inferno" | "magma" |
//   "plasma" | "warm" | "rainbow-soft" | "bathymetry" |
//   "cdom" | "chlorophyll" | "density" | "freesurface-blue" |
//   "freesurface-red" | "oxygen" | "par" | "phase" | "salinity" |
//   "temperature" | "turbidity" | "velocity-blue" |
//   "velocity-green" | "cubehelix";

class TextSaliencyMap extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      topK: 3
    }

    this.colorize = this.colorize.bind(this)
    this.handleTopKChange = this.handleTopKChange.bind(this)
    this.getTopKIndices = this.getTopKIndices.bind(this)
  }

  static defaultProps = {
    colormapProps: {
      colormap: 'RdBu',
      format: 'hex',
      nshades: 20
    }
  }

  colorize(tokensWithWeights, topKIdx) {
    const {colormapProps} = this.props
    // colormap package takes minimum of 6 shades 
    colormapProps.nshades =  Math.min(Math.max(colormapProps.nshades, 6), 72);
    let colors = colormap(colormapProps)

    let result_string = [];
    tokensWithWeights.forEach((obj, idx) => {
      result_string.push(
        // IMPORTANT: * the colormap pictures for colormap js go from left to right!
        //            * This means that for RdBu, low extreme is blue and high extreme is red 
        <label key={idx} data-tip={(1 - obj.weight).toFixed(5)} style={{ display: "inline-block" }} >
          <ColorizedToken backgroundColor={topKIdx.has(idx) ? colors[Math.round(obj.weight * (colormapProps.nshades - 1))] : 'transparent'}
                          key={idx}>
                          {obj.token}
          </ColorizedToken>
        </label>
      )
    })

    return result_string 
  }

  handleTopKChange = e => {
    let stateUpdate = Object.assign({}, this.state)
    console.log('state updatessss', stateUpdate)
    if (e.target.value.trim() === "") {
      stateUpdate['topK'] = e.target.value
    } else {
      stateUpdate['topK'] = parseInt(e.target.value, 10)
    }
    this.setState(stateUpdate)
  }

  getTopKIndices(tokensWithWeights) {
    function grad_compare(obj1, obj2) {
      return obj1.weight - obj2.weight
    }

    // Add indices so we can keep track after sorting
    let indexedTokens = tokensWithWeights.map((obj, idx) => Object.assign({}, obj, {idx}))
    
    indexedTokens.sort(grad_compare)
  
    // Extract top K tokens
    const topKTokens = indexedTokens.slice(0, this.state.topK)

    // Return only the indices of the top tokens
    return topKTokens.map(obj => obj.idx)
  }

  render() {
    const { tokensWithWeights } = this.props 
    const topKIdx = new Set(this.getTopKIndices(tokensWithWeights))
    const token_color_map = this.colorize(tokensWithWeights, topKIdx)
    
    return (
      <div>
        {token_color_map}
        <Tooltip />
        <input
            type="range"
            min={0}
            max={tokensWithWeights.length}
            step="1"
            value={this.state.topK}
            className="slider"
            onChange={this.handleTopKChange} style={{ padding: "0px", margin: "0px" }} />
        <br /><br />
      </div>
    )
  }
}

// interface ColorizedTokenProps {
//   backgroundColor: string;
// }

const ColorizedToken = styled.span`
  background-color: ${props => props.backgroundColor};
  padding: 5px;
  margin: 5px;
  display: inline-block;
  border-radius: 3px;
`;

export default TextSaliencyMap; 